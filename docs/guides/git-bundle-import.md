# 内网接收：`Import-GitBundle.ps1` 使用手册

> 2026-09-20 · 本文只讲**内网机器**上怎么接包。
> 面向小白，每条命令都能直接复制；脚本的所有报错文案都列在 [§07](#07-报错对照表)。
>
> 先读总览：[git-bundle-sync.md](./git-bundle-sync.md)（概念解释、为什么这么做）
> 外网那侧：[git-bundle-export.md](./git-bundle-export.md)

---

## 四句话速览

1. **第一次**不跑这个脚本 —— 用 `git clone` 把首包变成一个正式仓库。
2. **之后每次**跑 `Import`，它做的是**快进**：把内网分支平移到外网发布的提交。
3. 脚本会**先校验指纹**再动手，损坏/被改的包在校验阶段就被挡下，不会污染仓库。
4. **内网别在同步分支上做本地提交** —— 一旦分叉，导入会被拒绝（[§08](#08-内网也想改代码怎么办)）。

---

## 01 先决条件

| 项 | 要求 | 怎么查 |
| --- | --- | --- |
| PowerShell | 5.1（系统自带）或 7+ | `$PSVersionTable.PSVersion` |
| Git | 2.x 即可 | `git --version` |
| 内网仓库 | 已经在本地（首次靠 clone 首包，见 §03） | `git status` |
| 工作区 | **干净**（该提交的提交掉） | `git status` |

### 如果提示"禁止运行脚本"

和 [export 手册 §01](./git-bundle-export.md#01-先决条件) 一样，用一次性绕过：

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\Import-GitBundle.ps1 `
    -RepositoryPath . -ReleasePath D:\incoming\2026-09-27-101530
```

---

## 02 参数表

```powershell
.\scripts\Import-GitBundle.ps1 -RepositoryPath <路径> -ReleasePath <目录> [-Remote 远端名] [-Branch 分支] [-SkipPush]
```

| 参数 | 必填 | 默认 | 说明 |
| --- | --- | --- | --- |
| `-RepositoryPath` | ✅ | — | 内网的仓库目录（通常写 `.`） |
| `-ReleasePath` | ✅ | — | **包所在的那个目录**（不是文件本身），里面要有 `bundle` + `manifest.json` |
| `-Remote` | | `tm-ui-pro` | 导入成功后往哪个远端推。**这个默认值是外网的远端名，内网通常没有** → 内网请显式传，或加 `-SkipPush` |
| `-Branch` | | `trust` | 要更新哪个分支 |
| `-SkipPush` | | 不加 | 加上就**只更新本地**，不推远端 |

> **`-Branch` 必须和发布方一致**
> 脚本**不会**自动读 `manifest.json` 里的 `branch` 字段 —— 那个字段是给人看的。所以外网用 `-Branch master` 发布时，内网也要 `-Branch master`，否则会找不到分支。默认两边都是 `trust`，正常用不着管。

---

## 03 首次：用首包克隆出仓库

`Import` 做的是"把**已存在**的分支快进" —— 内网连仓库都还没有，所以第一次必须用 `git clone`。

```powershell
cd D:\work
git clone -b trust "<首包目录>\bundle" my-project
```

```text
Cloning into 'my-project'...
Receiving objects: 100% (12/12), done.
```

**两个细节别漏**：

1. **`-b trust`** —— 首包用 `--all` 打包，里面可能有好几个分支（本仓库就有 `trust` 和 `master`）。不指定的话，检出哪个要看运气。
2. **路径带空格要加引号**，比如 `"E:\发布包\首包\bundle"`。

进去验一下：

```powershell
cd my-project
git log --oneline -3
git branch --show-current          # 应该输出 trust
```

```text
693453a feat: third
e176c70 feat: second
c932b58 feat: first

trust
```

历史完整、分支对得上，首包就落地了。

### 克隆完必做一件事：处理 origin

`git clone` 会把 `origin` 指向**那个 bundle 文件**，不是内网的 git 服务器：

```text
origin  E:\发布包\首包\bundle (fetch)
origin  E:\发布包\首包\bundle (push)
```

将来如果误敲 `git push origin trust`，就会去推那个文件，行为很迷惑。按内网实际情况二选一：

```powershell
# 情况 A：内网有 git 服务器（推荐，团队成员能共享）
git remote set-url origin <内网 git 服务器地址>

# 情况 B：内网就本机一份，没有服务器
git remote rename origin extranet-bundle      # 改成明确的名字，避免误用
```

**这个决定直接影响你以后导入时用不用 `-SkipPush`**（见 §06）。

---

## 04 日常导入（每次拿到新包都这么干）

```powershell
cd D:\work\my-project
git status                                          # ① 先确认干净
git log --oneline -1                                # ② 记住当前停在哪
```

```text
On branch trust
nothing to commit, working tree clean

693453a feat: third          ← 内网此刻停在这（首包带来的版本）
```

确认干净后导入：

```powershell
.\scripts\Import-GitBundle.ps1 -RepositoryPath . -ReleasePath D:\incoming\2026-09-27-101530 -SkipPush
```

```text
E:/tmp/bundledoc/release-2/bundle is okay
From E:\tmp\bundledoc\release-2\bundle
 * [new ref]         c94dc1ff703f1f7228b15cb60894f9d14c9e43da -> refs/sync-import/ecadc58612214231b891e53d0db7af0e
Already on 'trust'
Release imported: c94dc1ff703f1f7228b15cb60894f9d14c9e43da
```

**逐行读一遍**，以后出问题就知道断在哪：

| 输出行 | 含义 |
| --- | --- |
| `... bundle is okay` | `git bundle verify` 通过 —— 包的结构是完整的。（这行是 git 输出到 stderr 的正常信息，不是错误） |
| `From ...` | 正从 bundle 文件"拉取"，把它当成一个远端 |
| `[new ref] ... -> refs/sync-import/<随机串>` | 先拉到一个**临时引用**上，还没碰你的分支 |
| `Already on 'trust'` | 已经在这个分支上，不用切 |
| `Release imported: <提交号>` | ✅ 成功。这个号应该和外网发布的 `Source commit` **一模一样** |

导入完，临时引用会被自动清掉。可以自己验一下是空的：

```powershell
git for-each-ref --format='%(refname)' refs/sync-import/
# 没有任何输出 = 干净
```

### 导入成功后怎么核对

三条命令，30 秒确认"真的同步上了"：

```powershell
git rev-parse HEAD                 # 与外网 Export 输出的 Source commit 对比，应当完全一致
git log --oneline -5               # 外网发的那几个提交在不在
git tag -l 'sync/*'                # 看一眼审计标签
```

```text
c94dc1ff703f1f7228b15cb60894f9d14c9e43da

c94dc1f feat: fifth
5101ba8 feat: fourth
693453a feat: third
e176c70 feat: second
c932b58 feat: first

sync/extranet-last
```

> **`sync/extranet-last` 是什么**
> 导入成功后，脚本在内网打的**审计标签**，指向"最近一次成功导入的提交"。
> 想知道这个内网仓库上次同步到哪儿，`git tag -l 'sync/*'` 一看便知。
> 它只是个本地书签，**不需要、也不应该**回传外网。

---

## 05 脚本在背后做了哪十件事

顺序很重要 —— **校验全部在前，动手在后**，所以任何一步失败都不会留下半截状态。

| # | 动作 | 失败时会看到 |
| --- | --- | --- |
| 1 | 确认 `-RepositoryPath` 是 git 仓库 | `RepositoryPath is not a Git working tree: ...` |
| 2 | 确认 `-ReleasePath` 是个存在的目录 | `ReleasePath does not exist: ...` |
| 3 | 确认目录里有 `manifest.json` | `manifest.json is missing from the release folder.` |
| 4 | 确认 manifest 字段齐全、版本号受支持 | `manifest.json is missing required fields or uses an unsupported schema.` |
| 5 | 确认 `bundleFile` 是文件名不是路径 | `manifest.bundleFile must be a file name, not a path.` |
| 6 | 确认 bundle 文件真的在 | `Bundle file is missing: ...` |
| 7 | **算 SHA-256 和 manifest 对比** | `SHA-256 verification failed. ...` |
| 8 | 确认工作区干净（忽略未跟踪文件） | `The repository has uncommitted changes. ...` |
| 9 | 确认目标分支已存在 | `Branch 'trust' does not exist in this repository. ...` |
| 10 | 按**提交号**拉取 → 核对提交号 → 检查能否快进 → 快进 → 推送 → 打审计标签 | `The intranet branch cannot fast-forward ...` 等 |

两个设计细节值得知道：

- **第 10 步按"提交号"拉取，不按 bundle 里的分支名**。bundle 内部的分支名是可变、可伪造的；提交号（SHA）是内容算出来的，改不了。这样即使有人替换了包，也对不上 manifest。
- **第 8 步用 `-uno` 忽略未跟踪文件**。内网机器上常有构建产物、日志、导入中转目录，它们不进 git 历史，不该挡路：

| 文件状态 | 会挡住导入吗 |
| --- | --- |
| 改了已跟踪的文件、没提交 | ✅ **会挡** — 导入前先提交或 stash |
| 新增文件但没 `git add`（未跟踪） | ❌ 不挡 |

---

## 06 要不要推送？`-SkipPush` 怎么选

导入成功后的最后一步，脚本会执行：

```bash
git push <Remote> <Branch>:<Branch>
```

**是否执行，取决于内网有没有 git 服务器**：

| 内网情况 | 怎么调 |
| --- | --- |
| 有 git 服务器，团队共享这份代码 | **配好远端名**，用 `-Remote <名字>`（比如 `-Remote origin`）；默认的 `tm-ui-pro` 是外网的名字，内网一般对不上 |
| 就本机一份，没有服务器 | 加 `-SkipPush` |
| 暂时不确定 | 加 `-SkipPush` —— 只更新本地，**不影响后续**，以后想推了手动 `git push` 即可 |

> **默认值为什么是 `tm-ui-pro`**
> 脚本是从外网仓库复制的，远端名沿用了外网的习惯。内网仓库的远端叫什么，得看 §03 你是怎么配的。

---

## 07 报错对照表

### `RepositoryPath is not a Git working tree: D:\...`

路径不是 git 仓库。首次使用要先 clone（§03），或你指向了错误的目录。

### `ReleasePath does not exist: E:\...`

`-ReleasePath` 要填**包所在的目录**，不是 bundle 文件本身：

```powershell
# ❌ -ReleasePath 'D:\incoming\2026-09-27-101530\bundle'
# ✅ -ReleasePath 'D:\incoming\2026-09-27-101530'
```

### `manifest.json is missing from the release folder.`

目录里没有随货清单。八成是**只拷了 bundle，忘了拷 manifest.json** —— 回外网把两个文件一起拷过来。

### `manifest.json is missing required fields or uses an unsupported schema.`

manifest 内容不完整，或者 schema 版本比脚本新（外网脚本升级过、内网脚本没升级）。两边脚本应当**保持同一版本**。

### `Bundle file is missing: bundle`

manifest 里写了文件名，但目录里找不到它。可能是文件被重命名了，或者传的时候漏了。

### `SHA-256 verification failed. The release bundle was damaged or altered.`

**这是最需要认真对待的一条。** 指纹对不上，脚本拒绝导入 —— 仓库**没有被污染**，你现在是安全的。

| 原因 | 怎么办 |
| --- | --- |
| 传输没传完 / 拷错了版本 | **重新拷一次**，两个文件都要 |
| 传输介质有问题 | 换介质，或用 `Get-FileHash -Algorithm SHA256 <bundle>` 自己核对 |
| 重拷后仍然报 | 文件很可能被改动过 —— **停下来找管理员**，别绕过校验 |

### `Branch 'trust' does not exist in this repository.`

内网还没有这个分支（通常是首次使用，误以为可以直接 Import）。

```text
· 首次导入请用首包直接克隆出一份工作区：git clone -b trust "<初始发布目录>\bundle <目标目录>
· 之后再用本脚本导入增量包。
```

按提示做：用首包 clone 出仓库（§03），之后再用本脚本。

> 如果仓库里已经有别的分支、只是名字不对（外网发的是 `master`），那就加 `-Branch master`。

### `The repository has uncommitted changes. Commit or stash them before importing.`

有已跟踪的文件改过没提交。**先处理掉再导入**，别硬来 —— 导入会移动分支，未提交的改动夹在中间容易出乱子。

```powershell
git status
git commit -am "内网的说明"      # 提交掉
git stash                        # 或暂存，导入后 git stash pop
```

### `The intranet branch cannot fast-forward to this release. Do not force-push; reconcile the branch first.`

**内网的分支和外网分叉了。** 通常是内网在 `trust` 上做了自己的提交。

```
内网 ────A───B───X      ← X 是内网自己的提交
外网 ────A───B───C      ← C 是外网新发布的
```

导入被拒绝是**正确行为**：脚本没法既保留 X 又平移过去。**绝对不要用 `git push --force` 硬推**，那会抹掉内网这边的东西。

正确做法见下一节。

### `Git command failed: git ...`

底层 git 报错，原文附在下一行。可能是仓库损坏、磁盘满、权限问题。把完整输出交给管理员。

---

## 08 内网也想改代码怎么办？

**核心原则：`trust` 永远保持"外网镜像"的纯度。**

内网确实需要改代码时，**另开分支**：

```powershell
git switch -c local/our-patch     # 从 trust 开一条内网自己的分支
# ...在 local/our-patch 上提交...
git switch trust                  # 回到纯净的镜像分支
```

这样每次导入时 `trust` 都是干净可快进的，同步永远顺畅。

> **如果已经分叉了怎么补**
> 把内网的本地改动**搬到另一条分支**上保住，再把 `trust` 拉回正轨：
> ```powershell
> git switch -c local/rescue        # 先给本地提交留个分支，别丢
> git switch trust
> git reset --hard sync/extranet-last   # 把 trust 退回最近一次成功导入的位置
> ```
> `git reset --hard` 会**丢弃未提交的改动**，敲之前先 `git status` 确认没有你想留的东西。
> 稳妥起见，这一步建议先让管理员一起看。

---

## 09 导入前自检清单

- [ ] `git status` 干净（或只剩未跟踪文件）
- [ ] 拿到的目录里 **`bundle` 和 `manifest.json` 都在**
- [ ] `-ReleasePath` 指的是**目录**，不是文件
- [ ] 内网无 git 服务器 → 加了 `-SkipPush`；有 → `-Remote` 填内网自己的远端名
- [ ] **没有**用 `2>&1` 之类的方式重定向脚本输出
- [ ] 导入后 `git rev-parse HEAD` 与外网 `Source commit` **完全一致**
