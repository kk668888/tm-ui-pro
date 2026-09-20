# Git Bundle 内外网同步：从零上手

> 2026-09-20 · 外网发布代码，内网接收，用两个脚本一条命令搞定。
> 面向没用过 `git bundle` 的同学：概念先讲透，命令都能直接复制，输出都标了怎么读。
>
> **配套脚本**：
> - 外网侧 `scripts/Export-GitBundle.ps1` — 打包发布
> - 内网侧 `scripts/Import-GitBundle.ps1` — 接收导入
>
> **本目录另外两篇**：外网侧详解见 [`git-bundle-export.md`](./git-bundle-export.md)，内网侧详解见 [`git-bundle-import.md`](./git-bundle-import.md)。

---

## 四句话速览

1. **内网连不上 GitHub，但代码要从外网进来** —— 于是用 `git bundle` 把一批提交打成一个**文件**，靠 U 盘 / 单向光闸 / 文件摆渡拷进去。
2. **第一次**用 `git clone` 把首包变成内网的一个正式仓库；**以后每次**用 `Import` 脚本把增量包快进上去。
3. 每次发布产出两个文件：`bundle`（货）+ `manifest.json`（随货清单，含指纹）。**必须一起传，少一个就导不进去。**
4. **内网不要在同步分支上做自己的提交** —— 一旦两边都往前走，导入会被直接拒绝。这是保护机制，不是 bug。

---

## 01 为什么不能用别的办法

先把"想当然的方案"排掉，省得走弯路：

| 想法 | 为什么不行 |
| --- | --- |
| U 盘拷整个 `.git` 文件夹 | 几个 G，拷一半就废；而且 `.git` 里有一堆和本次发布无关的历史与垃圾，出错概率极高 |
| 打包源码 zip 拷过去 | **历史全丢**。内网变成一堆"没有出处的文件"，以后没人知道哪个提交对哪个版本 |
| 内网直接 `git pull` | 内网连不上 GitHub，这条路物理上就不存在 |
| 外网 `git push` 到内网 | 同上，反方向也不通 |
| 只拷变化的那几个文件 | 一旦涉及改名、删除、二进制文件，人工判断必错 |

`git bundle` 是 git 自带的正解：**它把"提交"（而不是"文件"）打包成一个单文件**，这个文件本身就是一个 git 能直接读的仓库。内网拿到它，可以像访问远端一样 `clone` / `fetch` —— 历史、分支、标签全都在。

---

## 02 三个概念，看懂就够

### 概念一：bundle 是"可搬运的仓库"

```bash
# 外网：把 trust 分支打包成一个文件
git bundle create bundle trust

# 内网：这个文件可以直接当远端用
git clone bundle my-project
```

关键点：bundle 里装的是**提交对象**，不是你的工作区文件。所以它体积小、且内网拿到的是一份完整可追溯的历史。

### 概念二：manifest.json 是"随货清单"

bundle 内部是 git 的二进制格式，你没法一眼看出"这是哪个版本""路上有没有坏"。所以每次发布都配一份 `manifest.json`：

```json
{
    "schemaVersion": 1,
    "branch": "trust",
    "sourceCommit": "c94dc1ff703f1f7228b15cb60894f9d14c9e43da",
    "baseCommit": "693453a97d6c6d48de3ca74f95538a879234b6ac",
    "initial": false,
    "bundleFile": "bundle",
    "sha256": "f3c4ab6d4c22c70f4c953f831b31fff86e8fec6f3343c45041079bebaab3e881",
    "generatedAt": "2026-09-20T06:40:29.1413973Z"
}
```

| 字段 | 什么意思 | 谁来用 |
| --- | --- | --- |
| `sourceCommit` | 这次发布"到"哪个提交（内网最终应该停在这里） | 导入后核对 |
| `baseCommit` | 这次发布"从"哪个提交开始（增量包的起点），首包为 `null` | 判断是首包还是增量 |
| `initial` | 是不是首包 | 决定用 clone 还是 Import |
| `sha256` | bundle 文件的指纹 | 导入前自动校验，防传输损坏/被改 |
| `branch` | 发布的分支 | **仅供人看**，导入脚本不会自动读它（见 [import 文档的提醒](./git-bundle-import.md)） |

> **为什么要指纹**
> U 盘、摆渡、网闸一路颠簸，文件坏一个字节是常事。`sha256` 让导入脚本在动手之前就能发现，**而不是先污染了仓库再报错**。

### 概念三：锚点（anchor）是"基准线"

外网首包时会打一个标签：

```bash
git tag -f sync/extranet-anchor <首包的提交>
```

之后**每个增量包都从锚点开始打包**，而不是从"上一个包"开始：

```bash
git bundle create bundle trust ^<锚点提交>   # 注意这个 ^
```

这样设计的好处很实在：**内网漏收了中间某个包，也能直接导入最新的包**。因为每个包都自带"从锚点到现在"的完整变化，是一份**累积**增量。

```
        锚点                      包A        包B        包C
外网 ────┼───────────────────────┼──────────┼──────────┼─────▶
         │                        │                        │
         │    包B = 锚点→B（含A的提交）                      │
         │    包C = 锚点→C（含A、B的提交）            ┌──────┘
内网 首包 clone 到锚点，然后：漏收B，直接导C ✅ 也接得上
```

> **锚点只存在于外网机器上**，是本地标签，脚本不会推送它。内网 clone 首包时**不会**带过去（也不需要）。

---

## 03 一次完整同步长什么样

先看地图，每条命令的细节在后面两篇里。

| 步骤 | 在哪台机器 | 做什么 | 命令 |
| --- | --- | --- | --- |
| 1 | 外网 | 确认工作区干净、提交完毕 | `git status` |
| 2 | 外网 | **首包**：导出基准 | `.\Export-GitBundle.ps1 -RepositoryPath . -OutputPath ..\release -Initial` |
| 3 | 外网 | **增量包**（以后每次） | `.\Export-GitBundle.ps1 -RepositoryPath . -OutputPath ..\release-2` |
| 4 | — | 把输出目录里的**两个文件**一起拷进内网 | U 盘 / 摆渡 |
| 5 | 内网 | **第一次**：用首包克隆出仓库 | `git clone -b trust <首包目录>\bundle my-project` |
| 6 | 内网 | **以后每次**：导入增量包 | `.\Import-GitBundle.ps1 -RepositoryPath . -ReleasePath ..\release-2` |

首次之后，日常就只有 **2 → 4 → 6** 这三步了。

> **脚本自己怎么进内网？**
> 第一个包（首包）用 `--all` 打包，包含仓库里的全部分支和文件 —— **包括 `scripts/` 目录**。
> 所以内网 clone 出来的仓库里自然就有 `Import-GitBundle.ps1`，不需要另外拷贝。

---

## 04 五分钟跑通一遍（在外网练习）

第一次用建议先拿个**练习仓库**试手，别直接上生产。下面是一份可照抄的演练：

```powershell
# 1) 造一个练习用的"外网仓库"
mkdir E:\tmp\demo-extranet
cd E:\tmp\demo-extranet
git init -b trust
git config user.email "you@example.com"
git config user.name  "Your Name"
"hello" | Set-Content a.txt
git add -A ; git commit -m "feat: first"

# 2) 首包导出（-Initial 只在第一次用）
& E:\Project\2026_my_project\tm-ui-new\scripts\Export-GitBundle.ps1 `
    -RepositoryPath . -OutputPath E:\tmp\demo-release -Initial
```

```text
Release created: E:\tmp\demo-release
Source commit: 693453a97d6c6d48de3ca74f95538a879234b6ac
```

看到这两行就成了。`E:\tmp\demo-release` 里有 `bundle` + `manifest.json` 两个文件。

```powershell
# 3) 模拟"拷进内网"：直接用本机另一个目录克隆
git clone -b trust E:\tmp\demo-release\bundle E:\tmp\demo-intranet
```

进去看一眼，文件和历史都在，这一步就验证完了。**详细的两侧手册见后面两篇。**

---

## 05 三条铁律

这三条是踩了会疼的，先记住。

### 铁律一：内网不要在同步分支上做本地提交

导入脚本做的是 **fast-forward（快进）** —— 把内网的 `trust` 从当前位置直接"平移"到发布提交。**前提是内网当前位置必须是发布提交的祖先**。

```
✅ 能快进                     ❌ 不能快进（分叉了）
外网 ────A───B───C           外网 ────A───B───C
                   ↑                              ↑
内网 ────A───B─────┘          内网 ────A───B───X──┘
                                        （内网自己提交了 X）
导入 = 平移                   导入被拒绝：Do not force-push
```

内网确实需要改代码时，**另开一个分支**（比如 `local/patch`），别在 `trust` 上改。这样 `trust` 永远只做"外网镜像"，同步永远顺畅。

### 铁律二：两个文件必须一起传

`bundle` 和 `manifest.json` 是一个整体：manifest 里存着 bundle 的指纹，导入前会校验。

```text
SHA-256 verification failed. The release bundle was damaged or altered.
```

看到这个报错，九成是**传输过程损坏**（没传完 / 拷错版本）。重新拷一次即可；如果重拷仍然报，就要怀疑文件被人动过。

### 铁律三：别对脚本重定向 stderr

```powershell
# ❌ 不要这么调
& .\Import-GitBundle.ps1 ... 2>&1

# ✅ 直接调用
& .\Import-GitBundle.ps1 ...
```

原因：Windows PowerShell 5.1 对**原生命令**（git）做 `2>&1` 合并，会把 git 的正常输出包装成"错误"，在脚本的 `$ErrorActionPreference = 'Stop'` 下**直接把脚本干掉** —— 哪怕 git 其实一切正常。比如 `git bundle verify` 那句 `... is okay` 就是走 stderr 的正常信息。

要既看屏幕、又留一份日志，用 `Start-Transcript` —— 它记录整个会话，不碰任何输出流：

```powershell
Start-Transcript -Path .\export.log    # 开始记录
& .\Export-GitBundle.ps1 -RepositoryPath . -OutputPath ..\release
Stop-Transcript                        # 结束记录
```

> **为什么不用 `| Tee-Object`**
> 脚本用 `Write-Host` 输出，而 `Write-Host` 走的是 PowerShell 的 information 流，`Tee-Object` 只接 success 流 ⇒ **管道里什么都收不到，日志是空的**。`Start-Transcript` 没有这个坑。

---

## 06 命令速查

### 外网：导出

| 场景 | 命令 |
| --- | --- |
| 首包（**只做一次**） | `.\scripts\Export-GitBundle.ps1 -RepositoryPath . -OutputPath ..\release -Initial` |
| 日常增量 | `.\scripts\Export-GitBundle.ps1 -RepositoryPath . -OutputPath ..\release-2` |
| 指定分支 | 追加 `-Branch master`（默认 `trust`） |
| 起个看得懂的文件名 | 追加 `-ReleaseName 'tm-ui-2026-09-20.bundle'`（默认 `bundle`） |
| 预览（**没有** `-WhatIf`） | 脚本未实现，加了会报"找不到参数"。发布前请自己先跑 `git status` + `git log --oneline -3` |

### 内网：导入

| 场景 | 命令 |
| --- | --- |
| 首次：克隆出仓库 | `git clone -b trust <首包目录>\bundle my-project` |
| 日常导入 | `.\scripts\Import-GitBundle.ps1 -RepositoryPath . -ReleasePath ..\release-2` |
| 内网没配远端、只更新本地 | 追加 `-SkipPush` |
| 指定分支 / 远端 | 追加 `-Branch master -Remote origin` |

### 查看状态（只读，随时可敲）

| 命令 | 看什么 |
| --- | --- |
| `git status` | 有没有没提交的改动（导入/导出前必看） |
| `git log --oneline -5` | 最近 5 个提交，确认版本对不对 |
| `git tag -l 'sync/*'` | 外网看锚点、内网看最近一次成功导入 |
| `git rev-parse HEAD` | 当前提交的完整编号（用来和外网对比） |

---

## 07 新手最容易搞错的六件事

1. **首包不能直接 Import。** `Import` 干的是"把已存在的分支快进"，内网连分支都还没有时它会明确拒绝，并提示你用 `git clone`。顺序不能反。
2. **`-Initial` 只用于第一次。** 它对锚点做强制覆盖，脚本加了保护：锚点已存在就拒绝执行。日常发布**千万别**加。
3. **输出目录必须为空（或不存在）。** 脚本会拒绝往一个非空目录里写，防止你把上一次的包和这一次的包混在一起、传错版本。
4. **未提交的改动会挡住发布。** 但"未跟踪文件"（日志、临时素材、构建产物）不挡 —— 脚本用 `git status --porcelain -uno`，只认已跟踪文件的改动。
5. **锚点不跟着包走。** 如果你有几台外网机器都在导出，必须手动让它们共用同一个锚点（见 [export 文档](./git-bundle-export.md)），否则各机打出的增量区间不一致。
6. **内网导入会打一个审计标签 `sync/extranet-last`。** 想知道"上一次成功导入的是哪个版本"，`git tag -l 'sync/*'` 一看便知；它只是个书签，不需要回传外网。

---

## 接下来

| 你是 | 去看 |
| --- | --- |
| 在外网机器上**发布** | [git-bundle-export.md](./git-bundle-export.md) |
| 在内网机器上**接收** | [git-bundle-import.md](./git-bundle-import.md) |
| 报错了不知道怎么办 | 先看对应文档末尾的"报错对照表" |
