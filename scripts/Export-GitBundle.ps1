[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$RepositoryPath,
    [Parameter(Mandatory)]
    [string]$OutputPath,
    [string]$Branch = 'main',
    [switch]$Initial,
    [string]$ReleaseName = 'bundle'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# 在指定仓库执行 Git 命令；任何非零退出码都会转换为可定位的异常，避免后续逻辑在错误状态下继续运行。
function Invoke-Git {
    param([string[]]$Arguments)

    $result = & git -C $RepositoryPath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($Arguments -join ' ')`n$result"
    }
    return ($result | Out-String).Trim()
}

# 只允许从干净工作区发布，确保每个发布包都精确对应一个可复现的提交状态。
function Assert-CleanWorkingTree {
    $status = Invoke-Git -Arguments @('status', '--porcelain')
    if ($status) {
        throw 'The repository has uncommitted changes. Commit or stash them before exporting.'
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $RepositoryPath '.git'))) {
    throw "RepositoryPath is not a Git working tree: $RepositoryPath"
}
if ([System.IO.Path]::GetFileName($ReleaseName) -ne $ReleaseName) {
    throw 'ReleaseName must be a file name, not a path.'
}

$RepositoryPath = (Resolve-Path -LiteralPath $RepositoryPath).Path
Assert-CleanWorkingTree

$sourceCommit = Invoke-Git -Arguments @('rev-parse', "$Branch^{commit}")
$baseCommit = $null
if (-not $Initial) {
    $baseCommit = Invoke-Git -Arguments @('rev-parse', 'sync/extranet-anchor^{commit}')
    $isAncestor = & git -C $RepositoryPath merge-base --is-ancestor $baseCommit $sourceCommit
    if ($LASTEXITCODE -ne 0) {
        throw 'The release anchor is not an ancestor of the branch. Create an initial release or repair the anchor tag.'
    }
    if ($baseCommit -eq $sourceCommit) {
        throw 'No new commits exist after sync/extranet-anchor.'
    }
}

if (Test-Path -LiteralPath $OutputPath) {
    if ((Get-ChildItem -LiteralPath $OutputPath -Force | Measure-Object).Count -gt 0) {
        throw "OutputPath must be empty: $OutputPath"
    }
} else {
    New-Item -ItemType Directory -Path $OutputPath -Force | Out-Null
}

$OutputPath = (Resolve-Path -LiteralPath $OutputPath).Path
$bundlePath = Join-Path $OutputPath $ReleaseName

if ($Initial) {
    Invoke-Git -Arguments @('bundle', 'create', $bundlePath, '--all') | Out-Null
} else {
    Invoke-Git -Arguments @('bundle', 'create', $bundlePath, $Branch, "^$baseCommit") | Out-Null
}

$sha256 = (Get-FileHash -LiteralPath $bundlePath -Algorithm SHA256).Hash.ToLowerInvariant()
$manifest = [ordered]@{
    schemaVersion = 1
    branch        = $Branch
    sourceCommit  = $sourceCommit
    baseCommit    = $baseCommit
    initial       = [bool]$Initial
    bundleFile    = $ReleaseName
    sha256        = $sha256
    generatedAt   = [DateTime]::UtcNow.ToString('o')
}

$manifestPath = Join-Path $OutputPath 'manifest.json'
$manifest | ConvertTo-Json | Set-Content -LiteralPath $manifestPath -Encoding UTF8

# 首包建立的锚点永不前移；后续累积包均从锚点开始，使内网即使漏收中间包也能导入最新包。
if ($Initial) {
    Invoke-Git -Arguments @('tag', '-f', 'sync/extranet-anchor', $sourceCommit) | Out-Null
}

Write-Host "Release created: $OutputPath"
Write-Host "Source commit: $sourceCommit"
