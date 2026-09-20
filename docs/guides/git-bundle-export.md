# 外网发布：`Export-GitBundle.ps1` 使用手册

> 2026-09-20 · 本文只讲**外网机器**上怎么发版。
> 面向小白，每条命令都能直接复制；脚本的所有报错文案都列在 [§07](#07-报错对照表)。
>
> 先读总览：[git-bundle-sync.md](./git-bundle-sync.md)（概念解释、为什么这么做）
> 内网那侧：[git-bundle-import.md](./git-bundle-import.md)

---

## 四句话速览

1. **第一次**发版加 `-Initial`（建基准锚点），**之后每次**都不加（打增量包）。
2. 发版前工作区必须是**干净的** —— 该提交的都提交掉。
3. 输出目录会得到 `bundle` + `manifest.json`，**两个一起拷进内网**。
4. `-Initial` 有保护：锚点已存在时会拒绝执行，防止误把基准线挪走。

---

## 01 先决条件

| 项 | 要求 | 怎么查 |
| --- | --- | --- |
| 操作系统 | Windows（脚本是 PowerShell） | — |
| PowerShell | 5.1（系统自带）或 7+ 都行 | `$PSVersionTable.PSVersion` |
| Git | 2.x 即可，本仓库实测 2.45.2 | `git --version` |
| 当前分支 | 默认按 `trust` 发；发别的分支用 `-Branch` | `git branch --show-current` |

### 如果提示"禁止运行脚本"

```text
无法加载文件 ...\Export-GitBundle.ps1，因为在此系统上禁止运行脚本。
```

这是 Windows 默认的执行策略在拦。**两种解法，推荐第一种**（只对本次生效，不改系统设置）：

```powershell
# 解法 1：用 Bypass 启动一个新 PowerShell 来跑（一次性，最安全）
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Export-GitBundle.ps1 `
    -RepositoryPath . -Initial

# 解法 2：只把当前窗口放宽（关掉窗口就恢复）
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

---

## 02 参数表

```powershell
.\scripts\Export-GitBundle.ps1 -RepositoryPath <路径> [-OutputPath <目录>] [-Branch 分支] [-Initial] [-ReleaseName 文件名]
```

| 参数 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `-RepositoryPath` | ✅ | — | 要发布哪个仓库（就是你的工作目录，通常写 `.`） |
| `-OutputPath` | | `<仓库>\release\<时间戳>` | 包放哪。省略时自动生成到仓库内的 `release\<时间戳>\`（该目录已 gitignore）。**目录不存在会自动建**；已存在则必须**是空的** |
| `-Branch` | | `trust` | 发布哪个分支。本仓库工作分支就是 `trust` |
| `-Initial` | | 不加 | **只在第一次发布时加**。作用：把锚点 `sync/extranet-anchor` 定在当前提交 |
| `-ReleaseName` | | `bundle` | bundle 的文件名。想一眼看懂可以写 `-ReleaseName 'tm-ui-2026-09-20.bundle'` |

> **没有 `-WhatIf`**
> 加了会报"找不到参数"。要预览，自己先跑 `git status`（干净吗）和 `git log --oneline -3`（要发的提交对吗）。

---

## 03 首次发布（`-Initial`，一辈子只做一次）

```powershell
cd E:\Project\2026_my_project\tm-ui-new
git status                    # ① 先确认干净
git log --oneline -3          # ② 再确认要发的提交
```

```text
On branch trust
nothing to commit, working tree clean

d3f166c chore(scripts): Git bundle 同步脚本对齐本仓库并补三处防护
4258436 需要
4f38b29 chore(scripts): 新增模板 kebab-case 检查/修复脚本
```

确认无误后发首包：

```powershell
.\scripts\Export-GitBundle.ps1 -RepositoryPath . -Initial
```

```text
Release created: E:\Project\2026_my_project\tm-ui-new\release\2026-09-20-152509
Source commit: 693453a97d6c6d48de3ca74f95538a879234b6ac
```

> 下面这段输出里的提交号是**演示值**，与你实际运行的结果不同 —— 以你自己机器上打印的为准。

**两行输出都读一下**：
- `Release created` 是包的落地位置；
- `Source commit` 是本次发布的提交号。**把它抄下来**，内网导入后要核对这个值。

### 首包到底装了什么

首包用的是 `git bundle create <文件> --all` —— **`--all` 意思是"仓库里的全部引用"**：所有分支 + 所有标签 + 全部历史。

所以：

- 首包 = 一份完整仓库快照，体积最大，**但也因此内网 clone 出来就是完整仓库**（含 `scripts/` 目录，所以内网天然就有导入脚本）；
- 本仓库有 `trust` 和 `master` 两个分支，首包里两个都在 → 内网 clone 时**务必用 `-b trust`** 指定，别让它随便检出一个。

同时，脚本会给当前提交打上基准标签：

```bash
git tag -f sync/extranet-anchor <Source commit>
```

验证一下：

```bash
git tag -l 'sync/*'
```

```text
sync/extranet-anchor
```

> **这个标签是"基准线"**，之后的增量包全部从它开始算。它**不会被推送**，也没法随包进内网 —— 内网不需要它。

---

## 04 日常发布（不加 `-Initial`）

之后每次代码更新完，流程就三步：

```powershell
git status                                   # ① 干净吗
git log --oneline -3                         # ② 发了些什么
.\scripts\Export-GitBundle.ps1 -RepositoryPath .                           # ③ 打包
```

```text
Release created: E:\Project\2026_my_project\tm-ui-new\release\2026-09-27-101530
Source commit: c94dc1ff703f1f7228b15cb60894f9d14c9e43da
```

这次脚本实际执行的是：

```bash
git bundle create <输出>\bundle trust ^<锚点提交>
#                              └─ 分支   └─ 这个 ^ 表示"排除锚点之前的历史"
```

也就是**只装锚点之后的新提交**，所以增量包很小。

### 首包和增量包的 manifest 差在哪

| 字段 | 首包 | 增量包 |
| --- | --- | --- |
| `initial` | `true` | `false` |
| `baseCommit` | `null` | 锚点的提交号 |
| `sourceCommit` | 发布时的提交 | 发布时的提交 |

`baseCommit` 就是从 manifest 一眼看出"这是首包还是增量包"的依据。

> **每个增量包都是"从锚点累积到当前"**，不是"从上一个包到当前"。
> 所以包会随时间越来越大，但换来一个很实在的好处：**内网漏收中间某个包，直接导最新包也能接上**。

---

## 05 脚本在背后做了哪八件事

看懂这个顺序，报错时就知道卡在哪一步了。

| # | 动作 | 失败时会看到 |
| --- | --- | --- |
| 1 | 确认 `-RepositoryPath` 是个 git 仓库 | `RepositoryPath is not a Git working tree: ...` |
| 2 | 确认 `-ReleaseName` 是文件名不是路径 | `ReleaseName must be a file name, not a path.` |
| 3 | 确认工作区干净（忽略未跟踪文件） | `The repository has uncommitted changes. ...` |
| 4 | `-Initial` 时检查锚点是否已存在 | `sync/extranet-anchor already exists. ...` |
| 5 | 解析分支提交；增量时确认锚点是它的祖先 | `The release anchor (...) is not an ancestor of the branch. ...` |
| 6 | 确认没有"锚点==当前"的空发布 | `No new commits exist after sync/extranet-anchor.` |
| 7 | 确认输出目录空/可建 | `OutputPath must be empty: ...` |
| 8 | 打包 → 算 SHA-256 → 写 manifest → （首包时）打锚点 | `Git command failed: git ...` |

**第 3 步的"忽略未跟踪文件"值得单独说**：脚本用的是 `git status --porcelain -uno`。含义是：

| 文件状态 | 会挡住发布吗 |
| --- | --- |
| 改了已跟踪的文件、没提交 | ✅ **会挡** — 必须 `git commit` 或 `git stash` |
| 新增了文件但没 `git add`（未跟踪） | ❌ 不挡 — 日志、临时素材、构建产物随便放 |

---

## 06 打包之后：怎么把包送进去

输出目录里就是两个文件：

```text
release-2/
├── bundle           ← 货（git 提交）
└── manifest.json    ← 随货清单（版本 + 指纹）
```

**必须两个一起拷**。分开传、只传一个、传成上一次的版本 —— 内网侧会在校验阶段直接拒绝。

> **强烈建议给包起个能认出来的名字**
> 默认文件名就叫 `bundle`，几个包放一起根本分不清谁是谁。发布时加：
> ```powershell
> -ReleaseName 'tm-ui-2026-09-20.bundle'
> ```
> 分发时也建议**整个目录**一起拷，别只挑文件。

---

## 07 报错对照表

以下是脚本会抛出的原文，以及该怎么办。

### `RepositoryPath is not a Git working tree: E:\...`

路径下没有 `.git`。你可能指向了父目录，或指向了一个还没 `git init` 的目录。

```powershell
git -C <你的路径> rev-parse --is-inside-work-tree   # 应该输出 true
```

### `ReleaseName must be a file name, not a path.`

`-ReleaseName` 里带了斜杠/反斜杠。它只能是**文件名**：

```powershell
# ❌ -ReleaseName 'out\bundle'
# ✅ -ReleaseName 'tm-ui-2026-09-20.bundle'     目录由 -OutputPath 决定
```

### `The repository has uncommitted changes. Commit or stash them before exporting.`

有已跟踪的文件改过但没提交。三选一：

```powershell
git status                      # 看看是哪些
git commit -am "你的说明"        # 提交掉
git stash                       # 或者暂存起来，发布完再 git stash pop
```

> 未跟踪的新文件**不会**触发这条 —— 脚本已经用 `-uno` 忽略它们了。

### `sync/extranet-anchor already exists. Do not rebuild the base release blindly.`

你在已经有锚点的情况下又加了 `-Initial`。**脚本故意拦住你**，因为强行重建基准会让你之前发的包和内网状态错位。

```text
· 正常发布请去掉 -Initial（打锚点之后的增量包）；
· 确实要重建基准，先显式删除锚点：git tag -d sync/extranet-anchor
```

**99% 的情况就是去掉 `-Initial` 重跑。** 只有在"确实要从头重来"时才按提示删锚点 —— 删之前先想清楚内网那边怎么办（内网已有的历史会接不上）。

### `The release anchor (sync/extranet-anchor) is not an ancestor of the branch. Create an initial release or repair the anchor tag.`

锚点不在你要发布的分支的祖先链上。常见原因：你切到了另一个分支（比如 `master`），但锚点是在 `trust` 上打的。

```powershell
git branch --show-current                     # 我在哪个分支
git merge-base --is-ancestor sync/extranet-anchor HEAD ; echo $?   # 0 = 是祖先
```

如果确实要发另一个分支，那条分支也需要自己的基准 —— 这属于"多分支发布"，先把 `-Branch` 和锚点的关系想清楚再动。

### `No new commits exist after sync/extranet-anchor.`

锚点 == 当前提交，没有任何新东西可发。说明你把同一个版本发了两次，或者根本没提交新代码。

```powershell
git log --oneline -3          # 确认有没有新提交
```

### `OutputPath must be empty: E:\...`

输出目录里已经有东西了（大概率是上一次的包）。**这是防你传错版本。**

**用默认路径时不会遇到这条** —— 默认目录自带时间戳，每次都是全新的。只有你显式传了 `-OutputPath`、而它正好非空时才会报。

两个解法：

```powershell
# 解法 1：省略 -OutputPath，让脚本自己建带时间戳的新目录
.\scripts\Export-GitBundle.ps1 -RepositoryPath .

# 解法 2：换一个明确的新目录
.\scripts\Export-GitBundle.ps1 -RepositoryPath . -OutputPath .\release-demo
```

或者确认旧包已经没用了，手动清空再重跑（**别删错别的目录**）。

### `Git command failed: git ...`

脚本包住的底层 git 报错，原文附在下面一行。这种一般是环境问题（仓库损坏、权限不足、磁盘满）。把完整输出发给管理员。

---

## 08 多台外网机器都在发版怎么办

这是**唯一需要人工协调**的场景，务必注意。

锚点 `sync/extranet-anchor` 是**本地标签，脚本不推送**。如果你有 A、B 两台外网机器，各自打各自的锚点，两边的增量区间就会不一致，内网交叉导入时会出现"提交接不上"。

**规则：所有发布机器共用同一个锚点。**

```powershell
# 在"首包"那台机器上，把锚点推到远端
git push tm-ui-pro sync/extranet-anchor

# 其他机器首次使用前，先拉下来
git fetch tm-ui-pro sync/extranet-anchor:sync/extranet-anchor
```

之后每台机器 `git rev-parse sync/extranet-anchor` 得到的应该是**同一个提交号**。可以先自查这一条再发版。

---

## 09 发布前自检清单

发之前花 20 秒过一遍，能省掉绝大多数返工：

- [ ] `git status` 干净（或只剩未跟踪文件）
- [ ] `git log --oneline -3` 里的提交确实是这次要发的
- [ ] `git branch --show-current` 是我要发的分支（`trust`）
- [ ] **第一次**发 → 加 `-Initial`；**之后**发 → 不加
- [ ] 省略 `-OutputPath`（脚本自动建带时间戳的新目录）；若手动指定，确认那是空目录
- [ ] 发布后 `git rev-parse HEAD` 与输出的 `Source commit` 一致
- [ ] 拷给内网时，`bundle` + `manifest.json` **一起**
