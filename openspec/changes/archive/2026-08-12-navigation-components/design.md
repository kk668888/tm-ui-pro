## Context

@tm/ui 批次 1（通用与布局 6 组件）已实现并归档，薄封装范式成熟：`useForwardBindings(props, companyDefaults)` 消幻影 false、slots 全透传、`useForwardRef` 方法透传、公司默认收敛 `defaults.ts`。本批次补齐导航层 9 组件。行为契约见 `specs/components/{breadcrumb,dropdown,menu,pagination,steps,tabs,affix,anchor,page-header}/spec.md`，动机见 `proposal.md`。

ant-design-vue 4.2.6 已确认导出：`Breadcrumb/BreadcrumbItem/BreadcrumbSeparator`、`Dropdown/DropdownButton`、`Menu/MenuItem/SubMenu/MenuItemGroup/MenuDivider`、`Pagination`、`Steps/Step`、`Tabs/TabPane`、`Affix`、`Anchor/AnchorLink`、`PageHeader`。9 个 props 类型均为 `Partial<ExtractPropTypes<...>>` 形态（无 HTMLAttributes 交集），可直接用于 `defineProps`，无需批次 1 的 ExtractPropTypes 绕行。

## Goals / Non-Goals

**Goals:**
- 9 个导航组件与既有同构的薄封装骨架
- Pagination 公司默认（showSizeChanger + pageSizeOptions）与 TmTable 分页配置对齐
- Dropdown 触发保持非受控（open 幻影 false 跳过）

**Non-Goals:**
- 不做 Pagination 与 TmTable 的自动联动注入（业务自行用 PaginationProps 配置，本批次仅统一默认）
- 不做 Menu 的动态路由生成（ant `items` 配置即可）
- 不做 Tabs 的页面级状态持久化（ant 原生能力已够）

## Decisions

### 1. 多子组件模块按 form 形态组织

breadcrumb（3）/ dropdown（2）/ menu（5）/ steps（2）/ tabs（2）/ anchor（2）是多子组件模块，沿用 form / grid / layout 既有形态：`index.ts` 分别 `withInstall` 每个子组件并命名导出，`export default { TmXxx, ... }` 对象形态。单组件模块（pagination / affix / page-header）保持 `export default TmXxx`。

### 2. Pagination 公司默认对齐 TmTable

`showSizeChanger: true` + `pageSizeOptions: ['10','20','50']` 在 `defaults.ts` 定义，companyDefaults 列表 `['showSizeChanger', 'pageSizeOptions']` 显式转发。未来 TmTable 分页配置调整只动 TmPagination defaults。

**备选**：Pagination 也提供 `showTotal` 公司默认文案。否决——`showTotal` 依赖业务 total 语义，默认文案收益低，交给业务。

### 3. Dropdown 触发非受控（open 幻影 false）

ant Dropdown 的 `open`（v4 替代 deprecated `visible`）是受控 prop，缺省被类型化 `defineProps` 归一化为 false → 直接透传会让菜单永不弹出。`useForwardBindings(props, [])` 天然跳过非显式 prop，保持 ant 非受控（与 Popover/Popconfirm 同思路，见 `composables/useForwardBindings` 文档）。

### 4. 其余组件纯透传，无公司默认

breadcrumb / menu / steps / tabs / affix / anchor / page-header 无公司扩展键，companyDefaults 传 `[]`，缺省 Boolean 幻影值跳过。

### 5. 不抽公共 SFC 模板

延续既有决策：复制骨架比抽象共享组件更易维护。

## Risks / Trade-offs

- [Menu 五子组件 + breadcrumb 三子组件使 index.ts 注册行数继续膨胀] → 与既有多子组件模块同构，install 逐个 `app.use`，无新增复杂度
- [Dropdown 的 menu prop 支持对象/数组两种形态] → 直接透传 ant `DropdownProps['menu']`，不本地重定义
- [PageHeader 在 ant 5 有废弃倾向，但 ant-design-vue 4.2.6 仍提供] → 全覆盖路线图要求，保留封装，文档注明 ant 原生状态
