# Git 分支到主干：一次真实任务复盘

> 2026-09-17 · 把 `feat/upgrade-typescript-7` 合入主干，路上撞了三堵墙。
> 这篇把每一步拆开讲：为什么这么做、怎么验证、错在哪——包括我自己犯的那个错。
> 面向 git 新手，命令都配了输出解读。

---

## 四句话速览

1. **动手前先看仓库。** 这次第一个发现就是：这个仓库**没有 `main`，主干叫 `master`**，远端也不叫 `origin` 而叫 `tm-ui-pro`。搞错名字，后面全是白干。
2. **合并前先判断能不能"快进"。** 如果主干是分支的直系祖先，合并就是一条直线、零冲突。
3. **推到 feature 分支 ≠ 过了 CI。** CI 只在开 PR 和推主干时跑。这次分支躺了 18 个提交没人拦，就是因为从没开过 PR。
4. **验证一条路径不够。** 我修了 CI 的一个 bug、只在 PR 上验过就推了主干，结果主干被我自己打挂——因为主干那条路径的 git 行为不一样。

---

## 01 先看清仓库，再动手

在敲任何会改变状态的命令（提交、合并、推送）之前，先用只读命令把现状问清楚。这一步不会出错，却能省掉后面所有返工。

```bash
$ git branch -a          # 本地 + 远端的所有分支
  feat/upgrade-typescript-7
  master
* trust
  remotes/tm-ui-pro/feat/upgrade-typescript-7
  remotes/tm-ui-pro/master

$ git remote -v          # 远端叫什么名字
tm-ui-pro  git@github.com:kk668888/tm-ui-pro.git (fetch)
tm-ui-pro  git@github.com:kk668888/tm-ui-pro.git (push)
```

> **第一个坑：主干的名字不是 `main`。**
> 你问的是"怎么合并到 `main`"，但这个仓库没有 `main`，主干叫 `master`；远端也不叫 `origin`。
> 别人的教程里到处是 `git push origin main`，那是**多数仓库的默认**，不是铁律。名字是仓库定的，永远先用 `git branch -a` 和 `git remote -v` 查，别照抄。

### 顺便认一下：三个位置

| 名字 | 是什么 | 怎么指它 |
| --- | --- | --- |
| 工作区 | 你正在编辑的文件 | `git status` |
| 本地仓库 | 你自己电脑上的提交历史 | `git log`、`master` |
| 远端仓库 | GitHub 上那份，别人看到的就是它 | `tm-ui-pro/master` |

`master` 和 `tm-ui-pro/master` 是**两个东西**——前者是你本地的，后者是你电脑上记着的"GitHub 那份长什么样"。两者可能不一致，所以你才会看到"领先 1 个提交"这类说法。

---

## 02 判断能不能"快进合并"

设想两条时间线。如果主干上的每个提交分支里都有（主干是分支的**祖先**），那把主干挪到分支的位置就行——不需要创造新提交，不会冲突。这叫 **fast-forward（快进）**。

如果两边各走各的、都有对方没有的提交，就叫**分叉**，那时才需要"合并提交"，也才可能冲突。

```bash
$ git rev-list --left-right --count tm-ui-pro/master...feat/upgrade-typescript-7
0	18
# 左边 = 主干独有的提交数 = 0
# 右边 = 分支独有的提交数 = 18
# 左边是 0 → 主干没落下任何东西 → 可以快进 ✅
```

```bash
$ git merge-base --is-ancestor tm-ui-pro/master feat/upgrade-typescript-7
# 没有输出 = 是祖先（命令靠退出码回答，0 是真、1 是假）
$ echo $?
0
```

> **记住这两条**
> `git log --oneline A..B` —— 看 B 有、A 没有的提交。
> `git merge-base --is-ancestor A B` —— 问"A 是不是 B 的祖先"。退出码 `0` = 是。

---

## 03 为什么走 PR，而不是直接推主干

PR（Pull Request）是在 GitHub 上提的一个"我这条分支想合进主干，请检查"的请求。它的价值不在流程好看，而在 **CI 会在合并之前跑，挂在 PR 上，而不是挂在主干上**。

看本项目的 CI 配置（`.github/workflows/ci.yml`）：

```yaml
on:
  push:
    branches: [master, main]   # ← 只有主干，feature 分支的 push 不触发
  pull_request:                # ← 开 PR 才触发
```

> **第二个坑：推到分支 ≠ 过了 CI。**
> 把分支推到 GitHub，**CI 一次都不会跑**——因为它不在 `master` 上、也没有 PR。
> 这条分支因此带着 18 个提交一路"绿灯"躺了很久，其中**真的有一个提交曾让文档站构建崩掉**，没人发现。

### 顺序决定代价

| 做法 | CI 什么时候跑 | CI 挂了会怎样 |
| --- | --- | --- |
| 本地合并 + 直接推主干 | 推到主干**之后** | 主干**已经坏了**才收到通知 |
| 开 PR 再合 | 合并**之前** | 主干**毫发无伤**，修完再合 |

---

## 04 合并的三种方式，别选错

GitHub 那个绿色按钮旁边有个下拉框，里面是这三个：

| 方式 | 主干上多出什么 | 什么时候用 |
| --- | --- | --- |
| **Merge commit** | 一个"合并提交"节点，历史变成有岔路的形状 | 分支很长、想保留"这是一整块工作"的痕迹 |
| **Squash** | 把 N 个提交**压成 1 个** | 分支上的提交很碎（"改了个错字""再试一次"），压掉噪音 |
| **Rebase / Fast-forward** | 分支的提交原样搬上去，**一条直线** | 提交本身干净、各有各自的意义 |

这次选 **fast-forward**，有两个具体理由，不是审美偏好：

1. **这 18 个提交不是一件事。** 里面有 TS 工具链升级、校验工具、异步校验、依赖修复……横跨 3 个 OpenSpec 变更。压成一条 Squash 提交，等于写了一条**误导性**的历史。
2. **这个仓库一直是线性的。**

```bash
$ git log --oneline -5 tm-ui-pro/master
f0d6f52 chore(opsx): 归档 add-input-mac 任务记录标记 5.3 完成
89a394e feat(ui): 新增 TmInputMac 六段式 MAC 地址输入组件
3619954 feat(ui): 新增 TmInputIp 四段式 IPv4 地址输入组件

$ git log --merges --oneline tm-ui-pro/master
# 空 —— 说明主干从来没有过合并提交，一直是直线
```

> **怎么选**
> 别问"哪个高级"，问"主干现在什么形状、这次改了什么"。**跟着仓库已有的习惯走**——一个一直是直线的仓库，你塞一个 merge 提交进去，就破坏了它的一致性。

---

## 05 合并与推送

推主干是整件事里最不可逆的一步，所以要有仪式感。

```bash
$ git checkout master
Switched to branch 'master'

$ git merge --ff-only feat/upgrade-typescript-7
Updating 831fd7d..4147cc7
Fast-forward
```

`--ff-only` 是一个保险：**只有能快进时才合并，否则直接报错停下**。没有它，git 可能悄悄给你造一个合并提交，而你不会注意到。用它可以强制"要么是干净的直线，要么别动"。

```bash
$ git push --dry-run tm-ui-pro master
To github.com:kk668888/tm-ui-pro.git
   f0d6f52..4147cc7  master -> master
#                    ↑ 注意这里没有 "+" 号
```

> **怎么看这个输出**
> `--dry-run` 只演练不真推。`f0d6f52..4147cc7` 是**两个点**——表示**普通推送**（在原有历史上往前加）。
> 如果显示一个 `+`、或者 `f0d6f52...4147cc7`（**三个点**）配 `(forced update)`，那是在**强行覆盖远端**——把别人的提交抹掉。那才是危险信号。

### 关于 `--force`

别随手用。`--force` 的含义是"我知道远端和你本地不一样，**照样用我的覆盖掉**"。如果远端有别人的提交，它就没了。

真需要用的时候（比如刚改过历史），要用 `--force-with-lease`——它会先确认远端没有你不知道的新提交，有就拒绝。

---

## 06 收尾：清掉没用的分支

分支合并之后，删掉它是**安全**的——因为那些提交已经在主干上了，分支只是一个名字而已。但别信自己的记忆，让 git 自己检查：

```bash
$ git branch -d feat/upgrade-typescript-7
Deleted branch feat/upgrade-typescript-7 (was 4147cc7).

$ git push tm-ui-pro --delete feat/upgrade-typescript-7
To github.com:kk668888/tm-ui-pro.git
 - [deleted]         feat/upgrade-typescript-7
```

| 命令 | 行为 |
| --- | --- |
| `git branch -d` | **安全删除**：git 先确认已合并进当前分支，没合并就拒绝 |
| `git branch -D` | **强删**：不管有没有合并，**会丢提交** |

用 `-d`（小写）。如果它报错说"没有完全合并"，那是 git 在告诉你**先别删**——去搞清楚为什么，而不是换成 `-D` 硬来。

---

## 07 三个真实的坑

都是这次实际撞到的，不是假想。

### 坑 01 · 主干的名字不是 `main`

你问"怎么合到 main"，但仓库用的是 `master`，远端还叫 `tm-ui-pro` 而不是 `origin`。
**教程里的名字只是例子**，永远先 `git branch -a` + `git remote -v` 查清再动。

### 坑 02 · 推到分支 ≠ 过了 CI

CI 只在**开 PR** 和**推主干**时触发。分支推上 GitHub 但没开 PR，CI 一次都不跑。这条分支因此带着一个已经打挂文档站的提交躺了很久。

**所以：开始一个新分支上的活儿之前，先把 PR 开出来**，让 CI 从第一个提交起就看着。

### 坑 03 · 修了一个 bug，打挂了另一条路径

CI 在 PR 上报错：

```text
Failed to find where HEAD diverged from "master".
```

原因是 CI 检出代码时用了 `--depth=1` 且只取 PR 的合并引用——**本地没有 `master` 这个引用**，而 changesets 内部执行的是 `git merge-base master HEAD`。

我加了条命令补建 `master` 引用，**在 PR 上验证通过**，就推到主干。然后主干挂了：

```text
fatal: refusing to fetch into branch 'refs/heads/master' checked out at '...'
exit code 128
```

因为 **PR 和推主干这两种场景，HEAD 的状态不一样**：

| 场景 | HEAD 在哪 | 那条 fetch 的结果 |
| --- | --- | --- |
| PR | 游离状态（detached），没有 master | 创建 master，**成立** |
| 推主干 | **就在 master 上** | git 拒绝 fetch 进已检出分支，**失败** |

修正：改成**只在缺引用时才补建**——

```bash
if ! git rev-parse --verify --quiet refs/heads/master >/dev/null; then
  git fetch --no-tags origin '+refs/heads/master:refs/heads/master'
fi
```

这次用真实环境把**两条路径都验过**——这才是正确的验证粒度。

> **这条最值得记**
> 坑 03 的教训不是 git 知识，是**验证习惯**：一个改动只要**有多种触发场景**，就必须每一种都验。
> 我当时只验了 PR 那条——恰好就是它成立、另一条不成立。而我把结论当成了"修好了"。

---

## 08 命令速查

### 只读：先侦察（安全，随便敲）

| 命令 | 回答什么问题 |
| --- | --- |
| `git status` | 我现在在哪、有哪些文件改过还没提交 |
| `git branch -a` | 有哪些分支（含远端） |
| `git remote -v` | 远端叫什么名字、地址是什么 |
| `git log --oneline -5` | 最近的提交，一行一个 |
| `git rev-list --left-right --count A...B` | 两边各有多少对方没有的提交 |
| `git merge-base --is-ancestor A B` | A 是不是 B 的祖先（能快进吗） |
| `git push --dry-run` | 推送会发生什么（不真推） |
| `git fetch` | 把远端最新状态同步到本地记录 |

### 改状态：想清楚再敲

| 命令 | 做什么 | 可逆吗 |
| --- | --- | --- |
| `git checkout -b 名字` | 新建分支并切过去 | 可逆 |
| `git commit` | 把暂存的改动记成一个提交 | 可逆 |
| `git merge --ff-only 分支` | 只在能快进时合并，否则报错 | 可逆（本地） |
| `git branch -d 分支` | 删除已合并的分支 | 名字没了，提交还在 |
| `git push 远端 主干` | 把本地主干推上去 | **影响所有人** |
| `git push --force` | 强推，覆盖远端 | **可能抹掉别人的提交** |
| `git reset --hard` | 丢弃未提交的改动 | **没提交过的就找不回了** |

---

## 09 新手最容易搞错的五件事

1. **"推上去了"不等于"没问题"。** 推送只是把提交放到远端，没有任何检查。只有 CI 跑过、或 PR 被评审，才叫验证过。
2. **本地 `master` 和远端 `master` 是两个东西。** `git fetch` 之后看到的 `tm-ui-pro/master` 只是你电脑上记的"远端那份长什么样"，可能过时。
3. **删分支几乎总是安全的。** 提交属于仓库，不属于分支。合并过了，删掉分支名字不丢任何东西；没合并的话 `-d` 会拦住你。
4. **危险的不是"改错"，是 `--force`。** 写错的提交可以再写一个修正；`--force` 推上去可能直接抹掉别人的工作，而且别人本地还留着旧的，一推就复活——变成一团乱。
5. **验证要覆盖所有路径。** 修完一个东西，先问自己"这个改动会在哪些不同场景下跑"，然后每一种都试。只验一种，就等于没验。

---

## 这次的时间线

| 阶段 | 发生了什么 | 结果 |
| --- | --- | --- |
| 起点 | `feat/upgrade-typescript-7` 领先主干 18 个提交，从未开过 PR | — |
| 开 PR | PR #1 建立，CI 首次跑起来 | **挂在 `changeset status` 步骤** |
| 修 CI | 补 `master` 引用 + `fetch-depth: 0`，只在 PR 上验过 | PR 通过 |
| 合并 | `--ff-only` 合入主干并推送（`4147cc7`） | PR #1 变 MERGED |
| 主干 CI | 同一个提交，在主干上跑 | **挂 —— git exit 128** |
| 修回归 | 改成按需补建引用，两条路径都本地验证（`64966e0`） | 已提交，**尚未推送** |
| 收尾 | 删掉 feature 分支（本地 + 远端），`trust` 对齐主干 | 完成 |

**写作时的当前状态：** 主干上一次 CI 仍是红的，修复提交 `64966e0` 已在本地、待推送。
推上去之后就应该转绿。
