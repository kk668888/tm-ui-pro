## 1. 骨架与共享装配

- [x] 1.1 创建 9 个组件目录骨架：`components/{breadcrumb,dropdown,menu,pagination,steps,tabs,affix,anchor,page-header}/{index.ts,src/,demos/,__tests__/}`（多子组件模块 breadcrumb/dropdown/menu/steps/tabs/anchor 按 form 形态命名导出 + 对象 default；单组件模块 pagination/affix/page-header 用 `export default TmXxx`）
- [x] 1.2 `pagination/src/defaults.ts` 定义公司默认：`showSizeChanger: true` + `pageSizeOptions: ['10','20','50']`（对齐 TmTable 分页配置）

## 2. 组件实现

- [x] 2.1 TmBreadcrumb：`Breadcrumb.vue` + `BreadcrumbItem.vue` + `BreadcrumbSeparator.vue`（三子组件，routes/itemRender/separator 透传）
- [x] 2.2 TmDropdown：`Dropdown.vue` + `DropdownButton.vue`（open 幻影 false 跳过保持非受控、menu/trigger/placement 透传）
- [x] 2.3 TmMenu：`Menu.vue` + `MenuItem.vue` + `SubMenu.vue` + `MenuItemGroup.vue` + `MenuDivider.vue`（五子组件，items/mode/theme/selectedKeys 透传）
- [x] 2.4 TmPagination：`Pagination.vue`（showSizeChanger/pageSizeOptions 公司默认兜底 + total/current 透传）
- [x] 2.5 TmSteps：`Steps.vue` + `Step.vue`（type/direction/size/items 透传）
- [x] 2.6 TmTabs：`Tabs.vue` + `TabPane.vue`（type/position/activeKey 透传）
- [x] 2.7 TmAffix：`Affix.vue`（offsetTop/offsetBottom/target 透传）
- [x] 2.8 TmAnchor：`Anchor.vue` + `AnchorLink.vue`（affix/bounds/items 透传）
- [x] 2.9 TmPageHeader：`PageHeader.vue`（title/subTitle/backIcon/tags/extra 透传）
- [x] 2.10 9 组件统一遵循薄封装约定：useForwardBindings(props, companyDefaults) 透传、slots 全透传、useForwardRef 方法透传、缺省 Boolean 幻影值跳过

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/index.ts` 追加 install 注册 + 组件/类型 export（含 18 个多子组件：Breadcrumb×3、Dropdown×2、Menu×5、Steps×2、Tabs×2、Anchor×2）
- [x] 3.2 resolver 泛化覆盖验证（无需改代码，build 产物确认）
- [x] 3.3 `pnpm --filter @tm/ui build` 通过，双格式产物与 .d.ts 正确

## 4. 测试

- [x] 4.1 每组件 `__tests__/*.spec.ts`：Breadcrumb 分隔符、Dropdown 非受控触发、Menu 渲染与选中、Pagination 公司默认与覆盖、Steps/Tabs 渲染与激活、Affix/Anchor/PageHeader 透传、slots 透传
- [x] 4.2 `pnpm test` 全绿且覆盖率 ≥80%

## 5. 文档

- [x] 5.1 每组件 `demos/*.vue` + `apps/docs/components/{breadcrumb,dropdown,menu,pagination,steps,tabs,affix,anchor,page-header}.md`
- [x] 5.2 `apps/docs/.vitepress/config.ts` 侧边栏新增「导航」分组
