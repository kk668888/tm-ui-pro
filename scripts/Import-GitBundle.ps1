[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$RepositoryPath,
    [Parameter(Mandatory)]
    [string]$ReleasePath,
    [string]$Remote = 'origin',
    [string]$Branch = 'main',
    [switch]$SkipPush
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# 在指定仓库执行 Git 命令；任何非零退出码都会转换为清晰异常，防止导入在半失败状态下继续。
function Invoke-Git {
    param([string[]]$Arguments)

    $result = & git -C $RepositoryPath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($Arguments -join ' ')`n$result"
    }
    return ($result | Out-String).Trim()
}

# 有未提交本地修改时拒绝导入，避免环境改动被覆盖或混入外网发布历史。
function Assert-CleanWorkingTree {
    $status = Invoke-Git -Arguments @('status', '--porcelain')
    if ($status) {
        throw 'The repository has uncommitted changes. Commit or stash them before importing.'
    }
}

if (-not (Test-Path -LiteralPath (Join-Path $RepositoryPath '.git'))) {
    throw "RepositoryPath is not a Git working tree: $RepositoryPath"
}
if (-not (Test-Path -LiteralPath $ReleasePath -PathType Container)) {
    throw "ReleasePath does not exist: $ReleasePath"
}

$RepositoryPath = (Resolve-Path -LiteralPath $RepositoryPath).Path
$ReleasePath = (Resolve-Path -LiteralPath $ReleasePath).Path
$manifestPath = Join-Path $ReleasePath 'manifest.json'
if (-not (Test-Path -LiteralPath $manifestPath -PathType Leaf)) {
    throw 'manifest.json is missing from the release folder.'
}

$manifest = Get-Content -LiteralPath $manifestPath -Raw | ConvertFrom-Json
if ($manifest.schemaVersion -ne 1 -or -not $manifest.bundleFile -or -not $manifest.sourceCommit -or -not $manifest.sha256) {
    throw 'manifest.json is missing required fields or uses an unsupported schema.'
}
if ([System.IO.Path]::GetFileName([string]$manifest.bundleFile) -ne [string]$manifest.bundleFile) {
    throw 'manifest.bundleFile must be a file name, not a path.'
}

$bundlePath = Join-Path $ReleasePath $manifest.bundleFile
if (-not (Test-Path -LiteralPath $bundlePath -PathType Leaf)) {
    throw "Bundle file is missing: $($manifest.bundleFile)"
}

$actualHash = (Get-FileHash -LiteralPath $bundlePath -Algorithm SHA256).Hash.ToLowerInvariant()
if ($actualHash -ne ([string]$manifest.sha256).ToLowerInvariant()) {
    throw 'SHA-256 verification failed. The release bundle was damaged or altered.'
}

Assert-CleanWorkingTree
Invoke-Git -Arguments @('bundle', 'verify', $bundlePath) | Out-Null

$temporaryRef = "refs/sync-import/$([guid]::NewGuid().ToString('N'))"
try {
    # 依据 manifest 中不可变的提交号抓取，而不信任 bundle 内可变的分支名称。
    Invoke-Git -Arguments @('fetch', $bundlePath, "$($manifest.sourceCommit):$temporaryRef") | Out-Null
    $fetchedCommit = Invoke-Git -Arguments @('rev-parse', "$temporaryRef^{commit}")
    if ($fetchedCommit -ne $manifest.sourceCommit) {
        throw 'The bundle commit does not match manifest.sourceCommit.'
    }

    $currentCommit = Invoke-Git -Arguments @('rev-parse', "$Branch^{commit}")
    & git -C $RepositoryPath merge-base --is-ancestor $currentCommit $fetchedCommit
    if ($LASTEXITCODE -ne 0) {
        throw 'The intranet branch cannot fast-forward to this release. Do not force-push; reconcile the branch first.'
    }

    Invoke-Git -Arguments @('switch', $Branch) | Out-Null
    Invoke-Git -Arguments @('merge', '--ff-only', $temporaryRef) | Out-Null

    if (-not $SkipPush) {
        Invoke-Git -Arguments @('push', $Remote, "$Branch`:$Branch") | Out-Null
    }

    # 内网本地标签仅用于审计已成功导入的版本，不会也不需要回传到外网。
    Invoke-Git -Arguments @('tag', '-f', 'sync/extranet-last', $fetchedCommit) | Out-Null
    Write-Host "Release imported: $fetchedCommit"
} finally {
    & git -C $RepositoryPath update-ref -d $temporaryRef 2>$null
}
