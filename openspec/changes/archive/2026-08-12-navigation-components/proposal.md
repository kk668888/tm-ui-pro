## Why

@tm/ui 导航层组件缺失，业务写页面导航（面包屑 / 下拉菜单 / 分页 / 标签页）只能裸用 ant，无法复用公司视觉规范。其中 Pagination 与既有 TmTable 强耦合（归档 `table-ant-pagination-search` 已涉及分页联动），Tabs / Dropdown 是业务页面高频骨架组件。此批补齐导航组件，是「100% 覆盖」路线图的第二批。

## What Changes

- 新增 9 个 ant 薄封装组件：`TmBreadcrumb`、`TmDropdown`、`TmMenu`、`TmPagination`、`TmSteps`、`TmTabs`、`TmAffix`、`TmAnchor`、`TmPageHeader`
- `TmPagination`：薄封装 ant Pagination，公司分页默认（`showSizeChanger` / `showTotal` 默认 + 与 TmTable 分页配置对齐），是此批核心
- `TmDropdown`：薄封装 ant Dropdown，常与 Button 组合的"操作列"高频组件，`menu` / `trigger` 默认兜底
- `TmMenu`：薄封装 ant Menu 体系，导出 `TmMenu` / `TmMenuItem` / `TmSubMenu` / `TmMenuDivider`，统一导航菜单风格
- `TmTabs`：薄封装 ant Tabs，导出 `TmTabs` / `TmTabPane`，统一页面级 tab 风格
- `TmBreadcrumb`：薄封装 ant Breadcrumb，统一页面层级导航
- `TmSteps`：薄封装 ant Steps，统一流程步骤条
- `TmAffix`：薄封装 ant Affix，固定定位兜底
- `TmAnchor`：薄封装 ant Anchor，锚点导航兜底
- `TmPageHeader`：薄封装 ant PageHeader，页头兜底
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底
- 注册导出：`index.ts` 追加 install + export，resolver 泛化覆盖；文档页 + demos + 侧边栏

## Capabilities

### New Capabilities

- `components/breadcrumb`: TmBreadcrumb 面包屑（ant 原生透传 + 公司默认）
- `components/dropdown`: TmDropdown 下拉菜单（菜单默认 + 与 Button 组合）
- `components/menu`: TmMenu 导航菜单（TmMenu / TmMenuItem / TmSubMenu / TmMenuDivider）
- `components/pagination`: TmPagination 分页（公司分页默认 + 与 TmTable 分页联动）
- `components/steps`: TmSteps 步骤条（ant 原生透传 + 公司默认）
- `components/tabs`: TmTabs 标签页（TmTabs / TmTabPane，统一 tab 风格）
- `components/affix`: TmAffix 固钉（ant 原生透传 + 默认兜底）
- `components/anchor`: TmAnchor 锚点（ant 原生透传 + 默认兜底）
- `components/page-header`: TmPageHeader 页头（ant 原生透传 + 公司默认）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{breadcrumb,dropdown,menu,pagination,steps,tabs,affix,anchor,page-header}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（泛化覆盖，无需改动，build 验证）
- `apps/docs/.vitepress/config.ts`（侧边栏「导航」分组）
- `apps/docs/components/{breadcrumb,dropdown,menu,pagination,steps,tabs,affix,anchor,page-header}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 9 个能力规格）
