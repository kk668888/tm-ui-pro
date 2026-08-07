# Table 表格

基于 [vxe-table](https://vxetable.cn/) 的 `vxe-grid` 薄封装。**表格主体**（列 / 数据 / 排序 / 勾选 / 行编辑等）由 vxe 提供，**分页器与搜索表单使用 ant-design-vue**，与公司 @tm/ui 全 ant 生态视觉一致。在透传全部 vxe-grid 原生 props / slots / events 的基础上，提供三个公司级扩展键：`request`（远程分页拉数）、`search`（声明式 ant 搜索表单）、`density`（行高密度）。

> 视觉规范默认：`border` / `stripe` / `showOverflow` / `fit`（列宽铺满容器）与公司设计对齐，业务侧可覆盖。

## 何时使用

- 列表页 / 详情页子表格，需要后端分页 + 排序的远程数据。
- 静态小数据表格（不传 `request`，直接传 `data`，本地切片分页）。
- 需要勾选、行编辑、虚拟滚动、列拖拽等 vxe-grid 高级能力。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步。
// TmTable 依赖 vxe-table 运行时（VxeGrid 组件）与 ant-design-vue（分页/表单），
// 文档站已在 theme/index.ts 全量注册 vxe，ant 组件由组件库内按需引入。
import TableBasicDemo from '../../../packages/ui/src/components/table/demos/basic.vue'
import TableRemoteDemo from '../../../packages/ui/src/components/table/demos/remote.vue'
import TableSearchDemo from '../../../packages/ui/src/components/table/demos/search.vue'
import TableStaticDemo from '../../../packages/ui/src/components/table/demos/static-pagination.vue'
import TableDensityDemo from '../../../packages/ui/src/components/table/demos/density.vue'
import TableCheckboxDemo from '../../../packages/ui/src/components/table/demos/checkbox.vue'
import TableEditDemo from '../../../packages/ui/src/components/table/demos/edit.vue'
</script>

## 基础用法

最小静态 demo：`data` + `columns`，体验公司默认视觉（边框 / 斑马纹 / 溢出省略），底部自动渲染 ant 分页器。

<DemoBlock>
  <TableBasicDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/basic.vue

## 远程分页 + 搜索

传入 `request` 启用远程模式：TmTable 自动在 `onMounted` 拉首页、监听 ant 分页器 `change` 自动 refetch，并维护 `data` / `total`。搭配 `search` 扩展键，搜索区查询 / 重置自动携带条件触发拉数，页码重置为 1。

<DemoBlock>
  <TableRemoteDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/remote.vue

## 搜索表单

`search` 扩展键声明式生成 ant 搜索表单（支持 `input` / `select` / `date` 字段），点「查询」收集非空字段为 `query` 触发拉数，「重置」清空字段并重拉。

<DemoBlock>
  <TableSearchDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/search.vue

## 静态分页

未传 `request` 时 TmTable 退化为静态表格：`data` 本地切片渲染当前页，ant 分页器 `total` 等于数据长度，翻页不发起任何请求。

<DemoBlock>
  <TableStaticDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/static-pagination.vue

## 密度切换

`density` 扩展键控制行高：`compact`（紧凑 36px）/ `default`（默认 48px）/ `loose`（宽松 56px）。业务显式传 `row-config.height` 时优先于 `density`。

<DemoBlock>
  <TableDensityDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/density.vue

## 勾选

vxe 原生勾选能力经薄封装直接透传：`checkbox-config` + checkbox 列 + `getCheckboxRecords()` 实例方法。

<DemoBlock>
  <TableCheckboxDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/checkbox.vue

## 行编辑

vxe 原生行编辑经薄封装直接透传：`edit-config` + 列 `editRender`（需 vxe-pc-ui 运行时注册）。

<DemoBlock>
  <TableEditDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/edit.vue

## API

### TmTable Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 远程拉数函数。传入则启用远程模式：`onMounted` 拉首页 + ant 分页器 change 自动 refetch；返回 `{ data, total }` 写入 vxe-grid 与 ant 分页器。未传则退化为静态表格（本地切片分页） | `(params: TmTablePageParam & { query?: Record<string, unknown> }) => Promise<TmTableResult>` | `-` |
| search | 声明式 ant 搜索表单配置。配置后表格上方渲染搜索区，「查询」收集非空字段为 `query` 触发拉数（页码重置 1），「重置」清空并重拉 | `TmTableSearchConfig` | `-` |
| density | 行高密度档位：`compact` / `default` / `loose`。未配置使用 vxe 默认行高；业务显式 `row-config.height` 优先 | `'compact' \| 'default' \| 'loose'` | `-` |
| pagerConfig | **BREAKING**：不再透传 vxe-grid（vxe 不再渲染分页器），改为驱动 ant Pagination。`pageSize` / `pageSizes` 生效，`total` 由内部接管（远程取服务端总数，静态取数据长度） | `VxeGridProps['pagerConfig']` | `{ pageSize: 10, pageSizes: [10, 20, 50] }` |
| 其余属性 | 透传 vxe-grid 全部 props / slots / events（如 `columns` / `data` / `height` / `row-config` / `checkbox-config` / `edit-config` / `sort-config`） | `VxeGridProps` | 见 defaults.ts（`border` / `stripe` / `showOverflow`） |

### TmTableSearchConfig

```ts
interface TmTableSearchField {
  field: string                 // 字段名（写入 query 的 key，也作为 Form model 的 key）
  label: string                 // 表单项标签
  type?: 'input' | 'select' | 'date'  // 字段类型（默认 input）
  placeholder?: string          // 输入占位提示
  options?: Array<{ label: string; value: unknown }>  // select 类型选项
  defaultValue?: unknown        // 重置后恢复的默认值
  span?: number                 // ant Col 栅格跨度（默认 8，一行 3 个）
}

interface TmTableSearchConfig {
  fields: TmTableSearchField[]
}
```

### TmTablePageParam / TmTableResult

```ts
/** 分页参数（与 ant Pagination 标准字段对齐） */
export interface TmTablePageParam {
  currentPage: number  // 当前页码（1-based）
  pageSize: number     // 每页条数
}

/** 远程拉数返回值 */
export interface TmTableResult<T = Record<string, unknown>> {
  data: T[]   // 当前页数据行
  total: number  // 总条数（驱动 ant Pagination 渲染总页数）
}
```

### TmTable Methods

业务侧通过 `ref` 可调用以下 vxe-grid 实例方法（经 `useForwardRef` 透传，方法保真转发）：

- `revertData()` / `clearData()` / `updateData(data)` — 数据回滚 / 清空 / 覆盖更新
- `getCheckboxRecords()` — 获取勾选行
- `loadColumn(columns)` / `loadData(data)` — 动态加载列 / 数据
- `getRecordset()` / `undo()` / `redo()` — 编辑记录集 / 撤销 / 重做
- `commitProxy(code)` — vxe 工具栏「保存」回调（触发提交代理）
- 其余 vxe-grid 实例方法全部透传。

```ts
import type { VxeGridInstance } from '@tm/ui'
const tableRef = ref<VxeGridInstance>()
const checked = tableRef.value?.getCheckboxRecords()
```

### TmTable Types

```ts
import type {
  TmTableProps,
  TmTableExtProps,
  TmTablePageParam,
  TmTableResult,
  TmTableSearchConfig,
  TmTableSearchField,
  TmTableDensity,
  VxeGridProps,
  VxeGridInstance,
  VxeColumnProps,
  VxeGridListeners,
} from '@tm/ui'

// 也可走子入口（按需 import 子模块，与主入口类型一致）
import type { TmTableProps as TmTableProps2 } from '@tm/ui/table'
```

## 扩展机制

- **request 远程**：业务侧提供 `request` 函数，TmTable 内部用 `usePagination` composable 维护分页状态：
  1. `onMounted` 触发首页拉取（`{ currentPage: 1, pageSize: 默认值 }`）
  2. 监听 ant Pagination 的 `change` 事件，自动 refetch（携带最近一次查询条件）
  3. 拿到 `{ data, total }` 后写入 vxe-grid 的 `data` + ant Pagination 的 `total`
  4. **race condition 防护**：内部 token 守卫，快速翻页下乱序响应被丢弃
- **静态模式**：未传 `request` 时，`data` 本地切片渲染当前页，ant Pagination `total` = 数据长度，翻页不请求。
- **search 声明式**：`search.fields` 声明字段，TmTable 渲染 ant 表单；「查询」收集非空字段为 `query` → 页码置 1 → 触发拉数；「重置」清空字段 → 页码置 1 → 重拉。
- **density 密度**：`density` → `row-config.height`（36 / 48 / 56），业务显式 `row-config.height` 优先。
- **方法透传**：`useForwardRef` + `defineExpose(exposed)` 把 vxe-grid 实例方法逐个转发，不 spread Proxy。
- **视觉默认**：`tmTableDefaults` 设置 `border: true` / `stripe: true` / `showOverflow: true` / `fit: true`（未设 width 的列自动铺满容器）/ `pageSize: 10` / `pageSizes: [10, 20, 50]`；TmConfigProvider 把 ant token 映射为 vxe CSS 变量（主色 / 边框 / 表头 / hover / 斑马纹 / 状态色），实现表格与 ant 主题联动。

## 注意事项

- **BREAKING（v2）**：分页器由 vxe 内置 `pagerConfig` 改为 ant Pagination。迁移：删除对 `pagerConfig.total` 的手动维护（远程模式由内部接管）；若曾监听 vxe `page-change` 事件，改由 ant Pagination 的 change 驱动（组件内自动处理，业务无需绑定）。
- TmTable 依赖 vxe-table 4.20+、vxe-pc-ui 4.16+（表格主体）与 ant-design-vue 4.x（分页 / 搜索表单）运行时，业务方需在 `app.use(@tm/ui)` 前自行注册 vxe（或使用 `TmConfigProvider`）。文档站已在 `theme/index.ts` 全量注册 vxe，故本页 demo 可直接渲染。
- SSR 环境（如 VitePress build 阶段的 `renderToString`）下 vxe-grid 可能因依赖 `window` / `document` 而渲染异常，文档站通过 `vite.ssr.noExternal` 配置把 vxe 打进 bundle 解决。
