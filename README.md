# @kibus/tm-ui-plus 组件库

公司内部基于 **ant-design-vue + vxe-table** 二次封装的 Vue 3 组件库，配套 VitePress 文档站。

采用「薄封装」策略：组件尽可能透传 ant / vxe 原生能力，仅在公司层叠加默认视觉规范与业务扩展键，避免重复造轮子、保持与 ant 生态零摩擦。

---

## 技术栈

| 层 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 3.5 + TypeScript | `<script setup>` + 严格类型约束，杜绝隐式 `any` |
| 基础组件 | ant-design-vue 4.2.6 | Button / Input / Select / Form / Pagination 等薄封装基座 |
| 表格主体 | vxe-table 4.20 + vxe-pc-ui 4.16 | 虚拟滚动、行编辑、列拖拽等高级能力 |
| 文档站 | VitePress 1.5 | apps/docs，端口 5555 |
| 测试 | Vitest 4 + jsdom + coverage-v8 | ≥80% 覆盖率约束 |
| 构建 | Vite 8 + vite-plugin-dts | ESM(`es/`) + CJS(`lib/`) 双格式产物 |
| 版本管理 | changeset | 语义化版本 + 自动 changelog |
| 开发流程 | OpenSpec spec-driven | 提案 → 设计 → 规格 → 任务 |

---

## Monorepo 结构

pnpm workspace 工作区，根目录 `pnpm-workspace.yaml` 声明 `packages/*` 与 `apps/*`。

```
tm-ui-new/
├── packages/
│   └── ui/                     # @kibus/tm-ui-plus 组件库（核心库，零应用依赖）
│       ├── src/
│       │   ├── components/     # 业务组件（button/input/select/form/table）
│       │   ├── config-provider/# TmConfigProvider 主题桥接 + locale
│       │   ├── composables/    # useForwardRef 方法透传
│       │   ├── utils/          # withInstall 插件注册
│       │   ├── resolver.ts     # unplugin-vue-components 按需导入 Resolver
│       │   └── index.ts        # 总出口（install + 组件/类型导出）
│       ├── es/                 # 构建产物：ESM（import 入口）
│       └── lib/                # 构建产物：CJS（require 入口）
├── apps/
│   └── docs/                   # @tm/docs VitePress 文档站
│       ├── components/         # 各组件文档页（md 内嵌实时 demo）
│       └── .vitepress/         # 站点配置 + 自定义 Layout/Theme
├── openspec/                   # OpenSpec 规格基线 + 变更记录
│   ├── specs/components/       # 已归档能力的正式规格（form/select 等）
│   └── changes/                # 变更提案（含 archive 归档）
├── package.json                # 根脚本（dev/build/test/lint/release）
└── pnpm-workspace.yaml
```

---

## 组件清单

所有组件均以 `Tm` 前缀命名，可通过 `app.use(@kibus/tm-ui-plus)` 全量注册或按需导入。
**仓库已覆盖 60+ 个 ant-design-vue 组件**（通用 / 布局 / 导航 / 表单 / 数据展示 / 反馈 / 全局配置），
完整清单见文档站 `/components/` 侧边栏或 `packages/ui/src/index.ts` 导出。以下为核心范本组件：

| 组件 | 基于 | 公司扩展能力 |
| --- | --- | --- |
| `TmButton` | ant Button | `type` 默认 primary、`debounce` 点击防抖、`confirm` 二次确认（Popconfirm） |
| `TmInput` | ant Input | `modelValue` v-model 桥接、`allowClear`/`size`/`bordered` 视觉默认 |
| `TmSelect` | ant Select | `remote` 远程搜索（防抖 + minLength）、`api` 挂载数据源（fieldNames/resultMap 映射） |
| `TmForm` / `TmFormItem` | ant Form / FormItem | `submitting` 提交 loading、`readonly`/`disabled` 全局级联、`isDirty` 等变更追踪 |
| `TmTable` | vxe-grid | ant 分页器、`search` 声明式搜索表单、`density` 密度档位、`fit` 列宽铺满 |
| `TmConfigProvider` | ant ConfigProvider | ant token → vxe CSS 变量桥接、默认 zh_CN locale |

### 公司默认值（业务可覆盖）

| 组件 | 默认值 |
| --- | --- |
| TmButton | `type: 'primary'`、`debounce: 0` |
| TmInput | `allowClear: true`、`size: 'middle'`、`bordered: true` |
| TmSelect | `showSearch: true`、`allowClear: true`、`debounce: 300`、`minLength: 1` |
| TmTable | `border: true`、`stripe: true`、`showOverflow: true`、`fit: true`、分页 `pageSize: 10` / `pageSizes: [10,20,50]` |
| TmForm | `layout: 'horizontal'`、`hideRequiredMark: false` |
| TmConfigProvider | `locale: zh_CN` |

---

## 快速开始

### 安装

```bash
pnpm install
```

### 使用组件库

```ts
// 全量注册（入口文件）
import { createApp } from 'vue'
import App from './App.vue'
import TmUi from '@kibus/tm-ui-plus'
import VXETable from 'vxe-table'
import 'vxe-table/lib/style.css'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'

const app = createApp(App)
// 业务需自行注册 vxe（vxe 非 @kibus/tm-ui-plus 依赖注入）
app.use(VXETable).use(VxeUI)
app.use(TmUi)
app.mount('#app')
```

> 注：`@kibus/tm-ui-plus` 为薄封装库，自身无样式产物（组件样式由 ant-design-vue 的 CSS-in-JS
> 与 vxe 的预编译样式提供），**不存在** `@kibus/tm-ui-plus/style.css` 入口。

### 按需导入

```ts
import { TmButton, TmTable } from '@kibus/tm-ui-plus'
import type { TmTableProps, FormInstance } from '@kibus/tm-ui-plus'
```

或配合 `unplugin-vue-components` 零配置自动导入：

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite'
import { TmResolver } from '@kibus/tm-ui-plus'

export default defineConfig({
  plugins: [Components({ resolvers: [TmResolver()] })],
})
```

`TmTable` 走独立子入口 `@kibus/tm-ui-plus/table`（vxe 体积大，独立 chunk 隔离）。

---

## 开发命令（根目录）

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` / `pnpm dev:docs` | 启动文档站开发服务器（http://localhost:5555） |
| `pnpm dev:demo` | 启动 demo 应用（http://localhost:3000） |
| `pnpm build` / `pnpm build:ui` | 构建 `@kibus/tm-ui-plus`（es + lib 双格式 + .d.ts 声明） |
| `pnpm build:demo` / `pnpm build:docs` | 构建 demo 应用 / 文档站 |
| `pnpm test` | 运行组件库单测（Vitest，jsdom） |
| `pnpm test:coverage` | 组件库单测 + 覆盖率报告（≥80% 门槛） |
| `pnpm typecheck` | vue-tsc 全仓类型检查（packages/ui + demo） |
| `pnpm check` | 统一质量门禁：lint + typecheck + coverage + build |
| `pnpm lint` / `pnpm format` | ESLint / Prettier 代码规范 |
| `pnpm changeset` | 创建变更集（发布用） |
| `pnpm release` | 构建 + changeset publish 发布 |

> 文档站通过 `workspace:*` 引用 `@kibus/tm-ui-plus`，解析到 `packages/ui/es/index.js`（**构建产物**）。
> 修改组件库源码后需重新 `pnpm --filter @kibus/tm-ui-plus build`，docs 才能看到新效果。
> demo 应用则通过 alias 直接消费 `packages/ui/src`（源码），改组件库无需重建即可生效。

---

## 架构设计

### 薄封装模式

所有组件遵循统一封装范式，核心是「原生能力全透传 + 公司扩展键剥离」：

```
props（ant 原生 + 公司扩展）
    │
    ├─ 扩展键剥离 → antProps（只留 ant 认识的 prop）
    ├─ $attrs 合并 → forwardBindings（单一 v-bind）
    ├─ slots 全透传（v-for $slots 动态转发）
    └─ useForwardRef → 方法透传（ref 可直接调用内部 ant/vxe 实例方法）
```

- **扩展键剥离**：`debounce`/`remote`/`submitting` 等公司扩展键从透传对象中解构剔除，避免 ant 收到不认识的 prop 产生 console warning。
- **单一 v-bind**：`inheritAttrs: false` + 手动合并 `$attrs` 与 `antProps`，避免 Vue 模板同元素双 `v-bind` 冲突。
- **方法透传**：`useForwardRef` 用 Proxy 把内部实例方法逐 key 转发给父组件 ref，新增方法自动透传无需枚举。

### 主题桥接（TmConfigProvider）

`TmConfigProvider` 以 ant token 为**单一真相源**，把 ant 设计变量映射为 `--vxe-ui-*` CSS 变量写入包裹 div，实现 ant 组件与 vxe-table **视觉同源**：

```
ant ConfigProvider → useToken() → vxe CSS 变量 → TmTable 自动跟随主题
```

同时提供 `locale`（默认 zh_CN），ant 4.x 的 `app.use(Antd, {locale})` 不接受参数，必须经 ConfigProvider 上下文下发。

### FormContext 联动通道

`TmForm` 经 `provide/inject` 下发 `submitting` / `readonly` / `disabled` 计算属性：

- `TmFormItem` 通过 default slot props 暴露给子控件（第三方控件也可消费）
- `TmInput` / `TmSelect` 直接 inject 自动级联（业务显式传同名 prop 优先于 context）
- `disabled` 同时透传 ant Form 原生 prop，保留整表禁用能力
- 变更追踪：`onMounted` 自动快照 model，暴露 `isDirty()` / `getDirtyFields()` / `resetToInitial()` / `markInitial()`

### 已知坑与对策（封装经验沉淀）

- **Boolean prop 默认值陷阱**：Vue 类型化 `defineProps` 会把 ant 的 Boolean prop（ant 默认 true）生成默认 `false` 的运行时 prop。所有 ant 默认 true 的 Boolean 属性须在 `withDefaults` 显式兜底。
- **`??` 级联落空**：Boolean prop 未传时是 `false` 而非 `undefined`，会阻断 `false ?? contextValue` 落到上下文。需 `withDefaults` 显式置 `undefined` 区分「未传」。
- **ant Select 无 readonly**：运行时完全不处理 readonly。用受控 `open: false` 锁死下拉 + 关闭清除按钮实现只读。
- **vxe `fit` 运行时解析为 false**：即使全局 config 为 true，prop 默认值在运行时仍为 false，需显式下发。
- **vxe 需要业务侧自行注册**：`app.use(@kibus/tm-ui-plus)` 前需 `app.use(vxe-table)` / `app.use(vxe-pc-ui)`。

---

## 构建产物与发布

`vite build` 产出双格式，由 `exports` map 按环境分发：

| 目录 | 格式 | 入口 |
| --- | --- | --- |
| `es/` | ESM | `exports["."].import` / `module`（Vite/Rollup，可 tree-shaking） |
| `lib/` | CJS | `exports["."].require` / `main`（Node require 场景） |

`files` 仅发布 `es` / `lib` 两个目录，`sideEffects` 声明仅 CSS 有副作用。

### 发布流程（changeset）

```bash
pnpm changeset        # 选择变更级别（patch/minor/major）
pnpm version          # 版本号 + 更新 changelog
pnpm release          # 构建 + changeset publish
```

> **待办**：`packages/ui/package.json` 的 `publishConfig.registry` 与 `repository` 当前为**占位符**
> （`https://registry.your-company.com/` / `git@your-company.com`），首次发布前需替换为公司真实私有 registry 与仓库地址。

---

## 文档站

VitePress 站（`apps/docs`），`pnpm dev` 启动后访问 http://localhost:5555。

- 每个组件页通过 `<DemoBlock>` 内嵌可运行 demo，源码用 `<<<` 指令直接引用 `packages/ui/src/components/*/demos/`（文档与组件库 demo 同步，不重复维护）。
- `apps/docs/.vitepress/theme/Layout.vue` 用 `TmConfigProvider` 包裹全站，统一 ant locale 与主题。
- 文档站需处理 VitePress SSR：`vite.ssr.noExternal` 把 ant / vxe / @kibus/tm-ui-plus 打进 SSR bundle，避免 `renderToString` 报错。

---

## OpenSpec 开发流程

项目采用 OpenSpec **spec-driven 开发**：先记录提案/设计/规格/任务，再实现。

```bash
openspec new change "<name>"                              # 创建变更
openspec status --change "<name>"                         # 查看待写 artifact
openspec instructions <artifact> --change "<name>"        # 获取编写指引
openspec validate --changes                               # 校验全部变更
openspec archive <name> --yes                             # 实现完成后归档（合并进基线 specs）
```

基线规格沉淀在 `openspec/specs/components/`，变更记录在 `openspec/changes/`（已归档进 `archive/`）。

---

## License

内部组件库，未对外开源。
