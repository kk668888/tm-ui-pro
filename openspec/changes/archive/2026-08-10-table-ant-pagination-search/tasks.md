## 1. 类型与默认值扩展

- [x] 1.1 `props.ts` 新增 `search`（声明式 ant 搜索字段）与 `density`（compact/default/loose）扩展键类型；`pagerConfig` 语义改为 ant Pagination 驱动（从 VxeGridProps 剥离透传）
- [x] 1.2 `defaults.ts` 新增 `density` → 行高映射表（compact 36 / default 48 / loose 56）与搜索表单默认按钮文案

## 2. usePagination 重构（ant 事件驱动 + 双模式）

- [x] 2.1 重构 `usePagination`：由 ant Pagination `change` 事件驱动；远程模式保留竞态 token 守卫，静态模式本地切片当前页；`total` 远程取服务端值、静态取 `data.length`
- [x] 2.2 更新 `usePagination.spec.ts` 覆盖双模式（远程翻页/页大小切换/竞态丢弃；静态切片/翻页不请求/不足一页）

## 3. useSearch 新增

- [x] 3.1 实现 `useSearch` composable：字段配置 → ant Form model；`handleSearch`（收集非空字段 → 页码置 1 → fetchData(query)）；`resetQuery`（清空字段 → 页码置 1 → 重拉）
- [x] 3.2 新增 `useSearch.spec.ts`：查询收集/空值剔除/重置清空/页码重置

## 4. Table.vue 模板改造

- [x] 4.1 布局重构：外层 flex column，`VxeGrid height="100%" + auto-resize` 占剩余高度，`a-pagination` 固定底部（远程/静态均渲染）
- [x] 4.2 接入 `useSearch`：表格上方 `a-form` 栅格渲染，按 type 分发 `a-input` / `a-select` / `a-date-picker`，查询/重置按钮接 `handleSearch` / `resetQuery`
- [x] 4.3 `density` → `row-config.height` 映射（业务显式 `row-config` 优先）；`pagerConfig` 从 forwardBindings 剥离，改喂 ant Pagination props（current/pageSize/total/pageSizeOptions/showSizeChanger）
- [x] 4.4 更新 `Table.spec.ts`：ant 分页器渲染、远程翻页拉数、静态切片、search 查询/重置、density 切换集成用例

## 5. 主题视觉对齐

- [x] 5.1 `ConfigProvider.vue` vxeVars 映射从 3 个扩展至 ~20 个（status 色 / 边框 / 表头 / hover / 斑马纹 / 选中态 / 校验色，见 design D6 映射表），保留 `?? ''` 兜底
- [x] 5.2 `style/vxe-align.css` 补充 cell 高度、表头字重、分页器与表格间距等 ant 对齐细节

## 6. Demos 与文档

- [x] 6.1 新增 `demos/remote.vue`：远程分页（msw mock 接口，含 search 查询联动）
- [x] 6.2 新增 `demos/search.vue`：ant 搜索表单（input/select 字段）查询与重置
- [x] 6.3 新增 `demos/static-pagination.vue` / `demos/density.vue` / `demos/checkbox.vue` / `demos/edit.vue`
- [x] 6.4 更新 `apps/docs/components/table.md`：新 demo 引入、API 表补 search/density、标注 `pagerConfig` BREAKING 迁移说明

## 7. 验证

- [x] 7.1 全量单测跑通（usePagination / useSearch / Table / 既有 select 等无回归）
- [x] 7.2 `pnpm build`（ui 包 dts + 产物）+ 文档站 SSG 渲染验证 + 浏览器实测（CDP 确认各 demo 表格宽度撑满、高度正常）
