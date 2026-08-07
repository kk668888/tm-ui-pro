## Why

TmTable 目前依赖 vxe 全生态（`vxe-pager` 分页器 + vxe toolbar/form 搜索区），与公司 @tm/ui「全 ant-design-vue」的视觉体系不一致；同时样式只有极简对齐（3 个 CSS 变量、2 个属性），demo 仅一个静态基础示例。业务表格需要分页、筛选与公司其他页面完全同源，且表格开箱即用具备公司完整视觉。

## What Changes

- **BREAKING**: 分页器由 `vxe-pager` 改为 ant-design-vue `<a-pagination>`，TmTable 内部自动渲染于表格底部；远程模式由 ant Pagination 的 change 事件驱动拉数，静态模式本地切片分页。
- **BREAKING**: `pagerConfig` 不再透传给 `VxeGrid`（vxe 不再渲染分页器），其 `total` / `currentPage` / `pageSize` 语义改为驱动 ant Pagination 的 props。
- **BREAKING**: 表格底部高度布局调整——vxe 内置分页区取消后，改用外层 flex 布局，表格自适应剩余高度。
- 新增 `search` 扩展键：声明式 ant 搜索表单（栅格布局 input/select/date），点「查询」自动 `fetchData(query)`，「重置」清空并重拉。
- 新增 `density` 密度切换：紧凑 / 默认 / 宽松 三档行高（映射 vxe `row-config`）。
- TmConfigProvider 的 vxe CSS 变量映射从 3 个扩展至 ~20 个（边框 / 表头 / hover / 斑马纹 / 状态色 / 校验色等），实现 TmTable 与 ant 主题完整视觉联动（单一真相源 = ant token）。
- TmTable `style/` 补充 cell 高度、字号、hover、表头权重等细节，与 ant 组件对齐。
- 补齐 demos：远程分页 / 搜索筛选 / 静态分页 / 密度切换 / 勾选批量 / 行编辑，并更新 `table.md` 文档。
- 保留现有能力：`request` 远程拉数语义、`useForwardRef` 方法透传、竞态 token 守卫均不变。

## Capabilities

### New Capabilities

- `components/table`: TmTable 表格组件能力——vxe-grid 表格主体 + ant 分页器与搜索表单 + 远程/静态数据驱动 + 密度切换 + ant 主题视觉对齐。

### Modified Capabilities

<!-- 无：现有 spec 仅 components/select，本 change 不改其行为 -->

## Impact

- `packages/ui/src/components/table/`：`props.ts`（新增 `search` / `density` 扩展键、`pagerConfig` 语义变化）、`Table.vue`（模板重构）、`composables/usePagination.ts`（ant Pagination 驱动重构 + 静态切片）、新增 `composables/useSearch.ts`、`defaults.ts`、`style/`（视觉细节）。
- `packages/ui/src/config-provider/ConfigProvider.vue`：vxe CSS 变量映射扩展。
- `apps/docs/components/table.md` + `packages/ui/src/components/table/demos/`：新增多个场景 demo。
- 依赖：无需新增；`ant-design-vue` 的 `Pagination` / `Form` / `Input` / `Select` / `DatePicker` 均为现有 peerDep 子组件。
- 测试：`usePagination.spec.ts` 重构后更新；新增 `useSearch.spec.ts`、`Table.spec.ts` 分页/搜索集成用例。
