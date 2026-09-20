[CmdletBinding()]
param(
    [Parameter(Mandatory)]
    [string]$RepositoryPath,
    # 发布包的输出目录。省略时默认写到 <RepositoryPath>\release —— 放在仓库里方便查找，
    # 同时 .gitignore 已排除 /release/，不会误入库。需要写到别处时显式传本参数。
    [string]$OutputPath,
    # 默认值对齐本仓库（tm-ui-new）：工作分支 trust。脚本被复制到别的仓库使用时请显式传参。
    [string]$Branch = 'trust',
    [switch]$Initial,
    [string]$ReleaseName = 'bundle'
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

# 锚点标签名：首包建立的基准提交，此后永不前移（增量包一律从锚点打包，内网漏收中间包也能接上）。
$AnchorRef = 'sync/extranet-anchor'

# 在指定仓库执行 Git 命令；任何非零退出码都会转换为可定位的异常，避免后续逻辑在错误状态下继续运行。
#
# 注意：这里刻意**不重定向 stderr**。实测（PowerShell 5.1）原生命令的 stderr 无法用 `2>文件`
# 捕获（文件恒为空），却会在 $ErrorActionPreference='Stop' 下被包成 NativeCommandError 直接
# 终止脚本。同理，调用方也不要把本脚本的 stderr 合并进成功流（`& Export-GitBundle.ps1 ... 2>&1`）。
function Invoke-Git {
    param([string[]]$Arguments)

    $result = & git -C $RepositoryPath @Arguments
    if ($LASTEXITCODE -ne 0) {
        throw "Git command failed: git $($Arguments -join ' ')`n$result"
    }
    return ($result | Out-String).Trim()
}

# 判断引用的提交是否存在（不抛异常）。--quiet 让失败静默，只看退出码。
function Test-GitRef {
    param([string]$Ref)

    $null = & git -C $RepositoryPath rev-parse --verify --quiet "$Ref^{commit}"
    return ($LASTEXITCODE -eq 0)
}

# 只允许从干净工作区发布，确保每个发布包都精确对应一个可复现的提交状态。
# 用 -uno 忽略未跟踪文件：内网/外网机器上常临时放着素材、日志、发布目录，
# 若不忽略，随便一个临时文件都会挡住发布（而它们本来就不进 bundle）。
function Assert-CleanWorkingTree {
    $status = Invoke-Git -Arguments @('status', '--porcelain', '-uno')
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

# 未指定输出目录时，默认写到仓库内的 release 目录。
# 放在仓库里方便查找；该目录已被 .gitignore 排除（/release/），不会误入版本库。
# 注意：这里基于已解析的 $RepositoryPath 拼路径，避免受调用者当前目录的影响。
if (-not $OutputPath) {
    $OutputPath = Join-Path $RepositoryPath 'release'
}

Assert-CleanWorkingTree

# 锚点保护：-Initial 会 tag -f 强制移动基准，误用会让此前按旧锚点打的包与内网状态错位。
if ($Initial -and (Test-GitRef -Ref $AnchorRef)) {
    throw "$AnchorRef already exists. Do not rebuild the base release blindly.`n" +
          "  · 正常发布请去掉 -Initial（打锚点之后的增量包）；`n" +
          "  · 确实要重建基准，先显式删除锚点：git tag -d $AnchorRef"
}

$sourceCommit = Invoke-Git -Arguments @('rev-parse', "$Branch^{commit}")
$baseCommit = $null
if (-not $Initial) {
    $baseCommit = Invoke-Git -Arguments @('rev-parse', "$AnchorRef^{commit}")
    $isAncestor = & git -C $RepositoryPath merge-base --is-ancestor $baseCommit $sourceCommit
    if ($LASTEXITCODE -ne 0) {
        throw "The release anchor ($AnchorRef) is not an ancestor of the branch. Create an initial release or repair the anchor tag."
    }
    if ($baseCommit -eq $sourceCommit) {
        throw "No new commits exist after $AnchorRef."
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
    Invoke-Git -Arguments @('tag', '-f', $AnchorRef, $sourceCommit) | Out-Null
    # 提示：锚点是本地标签，脚本不会推送。多台外网机器都参与导出时需手动
    # `git push <remote> $AnchorRef` 共用同一基准，否则各机的增量区间不一致。
}

Write-Host "Release created: $OutputPath"
Write-Host "Source commit: $sourceCommit"
