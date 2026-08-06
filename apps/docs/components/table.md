# Table 表格

基于 [vxe-table](https://vxetable.cn/) 的 `vxe-grid` 薄封装。在保留全部 vxe-grid 原生 props / slots / events 的基础上，新增一个公司级扩展 `request`：远程分页拉数函数。传入 `request` 后，TmTable 自动在 `onMounted` 拉取首页、监听分页变更自动 refetch，并维护 `data` / `total` / `pagerConfig`，业务侧无需手写分页逻辑。

> 视觉规范默认：`border` / `stripe` / `showOverflow` 与公司设计对齐，业务侧可覆盖。

## 何时使用

- 列表页 / 详情页子表格，需要后端分页 + 排序的远程数据。
- 静态小数据表格（不传 `request`，直接传 `data`）。
- 需要勾选、行编辑、虚拟滚动、列拖拽等 vxe-grid 高级能力。

## 基础用法

最小静态 demo：`data` + `columns`，体验公司默认视觉（边框 / 斑马纹 / 溢出省略）。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步。
// TmTable 依赖 vxe-table 运行时（VxeGrid 组件），文档站已在 theme/index.ts 全量注册 vxe。
import TableDemo from '../../../packages/ui/src/components/table/demos/basic.vue'
</script>

<DemoBlock>
  <TableDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/table/demos/basic.vue

## API

### TmTable Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| request | 远程拉数函数。传入则启用远程模式：`onMounted` 拉首页 + 分页变更自动 refetch；返回 `{ data, total }` 写入 vxe-grid 与 pager。未传则退化为静态表格（透传业务 `data` prop） | `(params: TmTablePageParam & { query?: Record<string, unknown> }) => Promise<TmTableResult>` | `-` |
| 其余属性 | 透传 vxe-grid 全部 props / slots / events（如 `columns` / `data` / `height` / `row-config` / `checkbox-config` / `pager-config`） | `VxeGridProps` | 见 defaults.ts（`border` / `stripe` / `showOverflow` / `pagerConfig.pageSize`） |

### TmTablePageParam / TmTableResult

```ts
/** 分页参数（与 vxe-pager 标准字段对齐） */
export interface TmTablePageParam {
  currentPage: number  // 当前页码（1-based）
  pageSize: number     // 每页条数
}

/** 远程拉数返回值 */
export interface TmTableResult<T = Record<string, unknown>> {
  data: T[]   // 当前页数据行
  total: number  // 总条数（驱动 vxe pager 渲染总页数）
}
```

### TmTable Methods

业务侧通过 `ref` 可调用以下 vxe-grid 实例方法（经 `useForwardRef` 透传，方法保真转发）：

- `commit(data)` / `revertData()` / `clearData()` — 数据提交 / 回滚 / 清空
- `getCheckboxRecords()` — 获取勾选行
- `loadColumn(columns)` / `loadData(data)` — 动态加载列 / 数据
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
  2. 监听 vxe-grid 的 `page-change` 事件，自动 refetch
  3. 拿到 `{ data, total }` 后写入 vxe-grid 的 `data` + `pagerConfig.total`
  4. **race condition 防护**：内部 token 守卫，快速翻页下乱序响应被丢弃，UI 始终显示最新请求结果
- **静态模式**：未传 `request` 时，TmTable 退化为透明转发，业务 `data` prop 直接绑定 vxe-grid。
- **方法透传**：`useForwardRef` + `defineExpose(exposed)` 把 vxe-grid 实例方法逐个转发，不 spread Proxy（保证 `commit` / `getCheckboxRecords` 等方法签名零损耗）。
- **视觉默认**：`tmTableDefaults` 设置 `border: true` / `stripe: true` / `showOverflow: true` / `pageSize: 10` / `pageSizes: [10, 20, 50, 100]`，业务侧可通过同名 prop 覆盖。

## 注意事项

- TmTable 依赖 vxe-table 4.20+ 与 vxe-pc-ui 4.16+ 运行时，业务方需在 `app.use(@tm/ui)` 前自行注册 vxe（或使用 `TmConfigProvider`，后续 task 会接入自动注册）。文档站已在 `theme/index.ts` 全量注册，故本页 demo 可直接渲染。
- SSR 环境（如 VitePress build 阶段的 `renderToString`）下 vxe-grid 可能因依赖 `window` / `document` 而渲染异常，文档站通过 `vite.ssr.noExternal` 配置把 vxe 打进 bundle 解决。
