## Context

TmTable 当前是 vxe-grid 的薄封装：`pager-config` 驱动 vxe 内置分页器，样式层仅 3 个 CSS 变量映射 + 一个 2 行 vxe-align.css。现有代码结构：`Table.vue`（单一 forwardBindings 合并 $attrs）、`usePagination`（远程拉数 + 竞态 token）、`useColumns`（align/showOverflow 归一化）、`useForwardRef`（方法透传）。动机见 proposal.md。本 change 把表格外圈（分页 / 筛选）从 vxe 生态切换到 ant 生态，同时做完整视觉对齐。

## Goals / Non-Goals

**Goals:**
- 表格主体仍由 vxe-grid 提供（列、数据、排序、勾选、编辑等既有能力零回归）
- 分页器统一为 ant Pagination，远程/静态模式均内部自动渲染
- search 扩展键用 ant Form 声明式渲染搜索区，自动接查询条件
- TmConfigProvider 完成 vxe ↔ ant 主题完整映射（单一真相源 = ant token）
- 保留薄封装原则：search / density 均为可选扩展，不传则退回当前行为

**Non-Goals:**
- 不把表格主体换成 ant Table（vxe 的高级能力：虚拟滚动、行编辑、列拖拽是选择它的理由）
- 不做 vxe-pager 的样式对齐（已被替代，不再需要）
- 不引入导出（xlsx）依赖（工具栏预设未纳入本次范围）
- 不改变 request / useForwardRef 的既有语义

## Decisions

### D1. 布局：flex column，grid 占剩余高度，pagination 固定底部

vxe 内置分页区取消后，表格高度不再自动扣除分页高度。改用外层 flex 布局：

```
.tm-table { display: flex; flex-direction: column }
.tm-table__grid  { flex: 1; min-height: 0 }   // VxeGrid，height="100%" + auto-resize
.tm-table__pager { flex: 0 0 auto }           // a-pagination，padding 对齐 ant
```

- vxe-grid 设置 `height="100%"` + `auto-resize`，在 flex 父级内填满剩余空间；业务传入数值 `height` 时 grid 用固定高度（`flex: none`），pagination 仍贴底。
- **备选**：继续用 vxe `pager-config` + 内部高度算法 → 被否决，因为我们要的是 ant 分页器。

### D2. usePagination 重构：ant 事件驱动 + 双模式

原 usePagination 监听 vxe `page-change`。重构后由 ant Pagination `change` 事件驱动：

```
usePagination({ getRequest, staticData }) → {
  page,            // { currentPage, pageSize }（reactive）
  data,            // 渲染数据：远程 = 拉取结果；静态 = 当前页切片
  total,           // 远程 = 服务端总数；静态 = staticData.length
  loading,
  onChange,        // ant Pagination change(page, pageSize) 回调
  fetchData(query) // 远程拉数（保留竞态 token 守卫）
}
```

- **远程模式**（有 request）：`onChange` 更新 page → `fetchData(当前 query)`。竞态 token 守卫原样保留。
- **静态模式**（无 request）：`data` 为 `computed(() => staticData.slice((page-1)*pageSize, page*pageSize))`，`onChange` 只切页不请求。
- **查询后重置页码**：search「查询」触发 `fetchData` 前先把 `page.currentPage` 置 1（见 D4）。

### D3. pagerConfig 语义变化：从 vxe 转 ant

- `pagerConfig` 不再透传 `VxeGrid`（vxe 不再渲染分页器）。
- 其 `total` / `currentPage` / `pageSize` 改为驱动 ant Pagination props：`current`、`pageSize`、`total`。
- 保留 `pageSizes` → ant `pageSizeOptions`，`showSizeChanger` 默认开启。
- 类型上，`TmTableProps` 仍继承 `VxeGridProps`，但 `forwardBindings` 剥离 `pagerConfig`，由 Table.vue 单独喂给 a-pagination。**BREAKING**：业务传 `pagerConfig.total` 不再生效，改为远程模式由内部 total 驱动。

### D4. useSearch：声明式字段 → ant Form

新增 `useSearch` composable：

```
useSearch(searchConfig, { fetchData }) → {
  model,          // ant Form model（reactive，字段值）
  resetQuery,     // 清空字段 + page.currentPage=1 + fetchData()
  handleSearch,   // 收集字段 → query → page.currentPage=1 + fetchData(query)
}
```

- `searchConfig` 声明字段：`{ field, label, type: 'input'|'select'|'date', options?, placeholder?, width? }`。
- 模板用 `a-form` + `a-row/a-col` 栅格 + 按 type 分发 `a-input` / `a-select` / `a-date-picker`，末尾「查询 / 重置」按钮。
- query 只含非空字段值（空串 / 空数组剔除）。
- 分页参数与 query 合并：`request({ currentPage, pageSize, query })`（复用现有 TmTablePageParam）。

### D5. density 映射 vxe row-config

`density` 扩展键 → `row-config.height`，与 ant Table 三档行高对齐：

| density | 行高 |
| --- | --- |
| `compact` | 36 |
| `default` | 48 |
| `loose` | 56 |

- 业务显式传 `row-config.height` 时覆盖 density。
- 切换 density 时 `forwardBindings` 的 `row-config` 重新计算。

### D6. TmConfigProvider 变量映射扩展（3 → ~20）

扩展 vxeVars，ant token → vxe CSS 变量（均已在 vxe-table/vxe-pc-ui 预编译 CSS 中确认存在）：

| ant token | vxe 变量 |
| --- | --- |
| `colorPrimary` | `--vxe-ui-primary-color`（已有） |
| `colorInfo` / `colorSuccess` / `colorWarning` / `colorError` | `--vxe-ui-status-info/success/warning/danger-color` |
| `colorText` | `--vxe-ui-font-color` |
| `colorTextSecondary` | `--vxe-ui-font-tinge-color` |
| `colorBorder` | `--vxe-ui-table-border-color` / `--vxe-ui-input-border-color` |
| `colorBgLayout` | `--vxe-ui-layout-background-color` |
| `colorFillAlter` | `--vxe-ui-table-header-background-color` |
| `colorTextSecondary` | `--vxe-ui-table-header-font-color` |
| `controlItemBgHover` | `--vxe-ui-table-row-hover-background-color` |
| `controlItemBgActive` | `--vxe-ui-table-row-current-background-color` |
| `colorFillContent` | `--vxe-ui-table-row-striped-background-color` |
| `colorError` | `--vxe-ui-table-validate-error-color` |
| `fontSize` / `fontFamily` / `borderRadius` | `--vxe-ui-font-size-*` / `--vxe-ui-font-family` / `--vxe-ui-border-radius`（已有） |

- 全部用 `?? ''` 兜底（沿用现有模式，避免 jsdom 下 `undefinedpx`）。
- TmTable `style/vxe-align.css` 补充：cell 高度、表头字重、分页区间距等细节（与 ant 表格视觉近似）。

## Risks / Trade-offs

- **布局回归风险**：vxe-grid 从「内部自动扣分页高度」切到「flex 撑满」可能在不同父容器（无显式高度）下塌陷 → Table.vue 内 `height="100%"` + `auto-resize` 兜底；静态模式不撑满（自然高度），仅远程/传 height 时 flex。
- **静态分页切片性能**：大数组每次翻页 slice 重算，量级 1w 内无感 → 不做 memo；超出再评估虚拟滚动。
- **search 字段类型有限**：首版仅 input/select/date → 通过 `type` 分发 + 扩展点预留（后续加 number/cascader 只动 useSearch 一处）。
- **pagerConfig BREAKING**：已用 vxe pager 的业务需迁移 → 文档「注意事项」标注；语义简化（total 由内部接管）反而减少业务心智负担。

## Migration Plan

1. `usePagination` 重构 + `useSearch` 新增 + Table.vue 模板改造（内部结构，不改 request 语义）
2. TmConfigProvider 变量扩展（向后兼容：新增键不删旧键）
3. demos + 文档更新（含 pagerConfig BREAKING 说明）
4. 全量测试跑通（usePagination 更新 / useSearch 新增 / Table 集成）

## Open Questions

- density 三档行高数值（36/48/56）是否与公司视觉规范最终对齐 —— 可在视觉验收时微调，不影响结构。
