# packages/ui/coverage 是什么

本文面向刚接触前端工程测试的新同学，解释 `packages/ui/coverage` 目录的来源、用途，以及它为什么通常不需要提交到 Git。

## 一句话结论

`packages/ui/coverage` 是 `packages/ui` 这个 UI 组件库运行单元测试覆盖率后自动生成的报告目录。

它不是源码，也不是手写文档，而是测试工具根据测试结果生成的临时产物。这个目录可以删除，后续再次运行覆盖率命令时会重新生成。

## 先理解几个基础概念

### 什么是 `packages/ui`

当前仓库是一个 monorepo，也就是一个仓库里放了多个应用或包。

`packages/ui` 是其中的 UI 组件库子包，包名是 `@trustmo/tm-ui`。它负责提供 `TmButton`、`TmInput`、`TmTable` 等组件。

### 什么是单元测试

单元测试是用代码检查代码的行为是否符合预期。

例如一个按钮组件应该能正确渲染文本，一个输入框组件应该能触发输入事件，这些都可以通过测试自动验证。

在当前子包里，测试工具是 Vitest。`packages/ui/package.json` 里有如下脚本：

```json
{
  "scripts": {
    "test": "vitest run"
  }
}
```

这表示运行 `pnpm --filter @trustmo/tm-ui test` 时，会执行 Vitest 测试。

### 什么是覆盖率

覆盖率用于回答一个问题：测试到底跑到了多少源码？

常见指标包括：

| 指标 | 含义 | 小白理解 |
| --- | --- | --- |
| Lines | 行覆盖率 | 源码里有多少行被测试跑到了 |
| Statements | 语句覆盖率 | 源码里有多少条语句被执行到了 |
| Functions | 函数覆盖率 | 源码里有多少函数被调用到了 |
| Branches | 分支覆盖率 | `if/else`、三元表达式等分支有多少被测到了 |

覆盖率不是越高就绝对越好，但它能帮助我们发现“看起来有测试，实际很多代码没测到”的问题。

## `coverage` 目录里有什么

当前 `packages/ui/coverage` 里主要是 HTML 报告文件和静态资源，例如：

```text
packages/ui/coverage/
├── index.html
├── base.css
├── prettify.js
├── sorter.js
├── block-navigation.js
├── favicon.png
└── src/
```

重点文件是：

| 文件或目录 | 作用 |
| --- | --- |
| `index.html` | 覆盖率报告首页，可以用浏览器打开查看 |
| `src/` | 按源码目录生成的详细覆盖率页面 |
| `base.css`、`prettify.js`、`sorter.js` | HTML 报告页面用到的样式和脚本 |

这些文件不是业务代码，只是给人看的报告页面。

## 它是怎么生成的

来源在 `packages/ui/vitest.config.ts` 的 `coverage` 配置：

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'html'],
  include: ['src/**/*.{ts,vue}'],
  exclude: [
    'src/**/*.spec.ts',
    'src/**/__tests__/**',
    'src/**/demos/**',
    'src/test/**',
    'src/**/*.d.ts',
  ],
  thresholds: {
    lines: 80,
    functions: 80,
    statements: 80,
    branches: 70,
  },
}
```

逐项解释：

| 配置 | 说明 |
| --- | --- |
| `provider: 'v8'` | 使用 Node/V8 内置能力统计覆盖率 |
| `reporter: ['text', 'html']` | 生成两种报告：终端文本报告和 HTML 网页报告 |
| `include: ['src/**/*.{ts,vue}']` | 只统计 `src` 下的 TypeScript 和 Vue 文件 |
| `exclude` | 排除测试文件、demo 文件、测试 setup 文件、类型声明文件 |
| `thresholds` | 覆盖率门槛，低于门槛时测试会失败 |

其中 `html` reporter 就是生成 `coverage` 目录的关键。

## 为什么 Git 里显示它是忽略文件

仓库根目录 `.gitignore` 里有：

```gitignore
coverage
```

这表示任何名为 `coverage` 的目录通常都不进入 Git。

原因很简单：

1. 覆盖率报告是自动生成的，不需要人工维护。
2. 每个人本地运行测试后都可能生成不同时间的报告。
3. 把报告提交到 Git 会制造大量无意义变更。
4. CI 或本地命令可以随时重新生成它。

所以 Git 状态中看到：

```text
!! packages/ui/coverage/
```

意思是：这个目录存在，但被 Git 忽略了。

这通常是正常现象，不是报错。

## 什么时候会看到这个目录

一般在运行覆盖率命令之后会看到它，例如：

```bash
pnpm --filter @trustmo/tm-ui test -- --coverage
```

或者直接进入子包运行：

```bash
cd packages/ui
pnpm test -- --coverage
```

运行后，Vitest 会：

1. 执行测试。
2. 统计哪些源码被测试跑到了。
3. 在终端输出文本覆盖率。
4. 生成 `coverage/index.html` 这种可视化页面。

## 如何查看覆盖率报告

用浏览器打开：

```text
packages/ui/coverage/index.html
```

打开后通常会看到每个文件的覆盖率数据。

常见颜色含义：

| 颜色 | 含义 |
| --- | --- |
| 绿色 | 覆盖率较好 |
| 黄色 | 覆盖率一般，需要关注 |
| 红色 | 覆盖率较低，可能缺测试 |

点进具体文件后，页面会标出哪些行没有被测试跑到。

## 可以删除它吗

可以。

`coverage` 是生成物，删除后不会影响源码。

如果只是想清理本地目录，可以删除：

```powershell
Remove-Item -LiteralPath .\packages\ui\coverage -Recurse
```

注意：这是删除目录命令。执行前请确认路径就是 `packages/ui/coverage`，不要误删其他目录。

删除后，如果再次运行覆盖率命令，它会重新生成。

## 它和 `dist` 的区别

`coverage` 和 `dist` 都是生成物，但用途不同：

| 目录 | 来源 | 用途 | 是否源码 |
| --- | --- | --- | --- |
| `packages/ui/coverage` | 测试覆盖率命令生成 | 给开发者查看测试覆盖率 | 否 |
| `packages/ui/dist` | 构建命令生成 | 给 npm 包或业务项目使用 | 否 |

简单理解：

- `coverage` 是测试报告。
- `dist` 是构建产物。
- `src` 才是主要源码。

## 覆盖率门槛是什么意思

当前 `packages/ui/vitest.config.ts` 设置了门槛：

```ts
thresholds: {
  lines: 80,
  functions: 80,
  statements: 80,
  branches: 70,
}
```

意思是：

| 指标 | 最低要求 |
| --- | --- |
| 行覆盖率 | 80% |
| 函数覆盖率 | 80% |
| 语句覆盖率 | 80% |
| 分支覆盖率 | 70% |

如果开启覆盖率运行测试，并且实际覆盖率低于这些门槛，测试命令会失败。

这不是为了追求数字本身，而是为了防止组件越来越多，但测试越来越薄。

## 小白最容易误解的点

### 误解一：`coverage` 是不是项目必须文件

不是。

它是本地生成的测试报告，不是项目运行必须文件。

### 误解二：`coverage/index.html` 是不是线上页面

不是。

它只是本地查看测试覆盖率的静态页面，不是业务系统页面。

### 误解三：覆盖率 100% 是不是代表没有 bug

不是。

覆盖率只说明代码被测试执行过，不保证测试断言写得正确，也不保证所有业务场景都覆盖到了。

例如测试只是把按钮渲染出来，但没有检查点击行为，那么覆盖率可能提高了，质量却不一定足够。

### 误解四：被 Git 忽略是不是有问题

不是。

`coverage` 被忽略是正常工程实践。它应该由命令生成，而不是提交到仓库。

## 日常怎么处理

一般建议：

1. 写组件或改组件逻辑时，补充对应测试。
2. 本地运行测试确认功能没有破坏。
3. 需要检查测试充分性时，再运行覆盖率命令。
4. 查看 `coverage/index.html`，重点关注红色或黄色文件。
5. 不要把 `coverage` 提交到 Git。

## 推荐命令

运行 UI 子包测试：

```bash
pnpm --filter @trustmo/tm-ui test
```

运行 UI 子包测试并生成覆盖率：

```bash
pnpm --filter @trustmo/tm-ui test -- --coverage
```

查看 Git 是否会提交 coverage：

```bash
git status --short --ignored -- packages/ui/coverage
```

如果看到：

```text
!! packages/ui/coverage/
```

说明它被忽略，不会被正常提交。

## 总结

`packages/ui/coverage` 是测试覆盖率报告目录。

你可以把它理解成“测试体检报告”：

- 它告诉你测试覆盖了哪些源码。
- 它帮助你发现缺少测试的地方。
- 它由 Vitest 自动生成。
- 它可以删除。
- 它不应该提交到 Git。

真正需要长期维护的是：

- `packages/ui/src` 下的源码。
- `packages/ui/src` 下的测试文件。
- `packages/ui/vitest.config.ts` 里的测试和覆盖率配置。

