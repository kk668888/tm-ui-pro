## 1. 骨架与共享装配

- [x] 1.1 创建 6 个组件目录骨架：`components/{space,divider,flex,grid,layout,typography}/{index.ts,src/,demos/,__tests__/}`（单组件模块 `export default TmXxx`；多子组件模块 grid/layout/typography 按 form 形态命名导出 + 对象 default）
- [x] 1.2 各组件 `defaults.ts` 定义公司默认值常量：Space `size:'middle'`、Divider `type:'horizontal'` + `orientation:'center'`、Flex `gap:'middle'`

## 2. 组件实现

- [x] 2.1 TmSpace：`Space.vue`（size 公司默认兜底、useForwardBindings 透传、slots 全透传、useForwardRef 方法透传）
- [x] 2.2 TmDivider：`Divider.vue`（type/orientation 默认兜底、dashed/plain/orientationMargin 透传、default 插槽透传）
- [x] 2.3 TmFlex：`Flex.vue`（gap 公司默认 middle 兜底、vertical/justify/align/wrap 透传）
- [x] 2.4 TmGrid：`Row.vue` + `Col.vue`（TmRow/TmCol，gutter/justify/align 与 span/offset/响应式断点透传）
- [x] 2.5 TmLayout：`Layout.vue` + `Sider/Header/Content/Footer.vue`（五子组件，hasSider/collapsible/collapsedWidth/breakpoint/theme 透传）
- [x] 2.6 TmTypography：`Title/Paragraph/Text/Link.vue` 四子组件（copyable/ellipsis/editable/mark/code/keyboard 透传）
- [x] 2.7 6 组件统一遵循薄封装约定：withDefaults 对缺省 Boolean 项显式兜底、公司默认经 defaults.ts 统一来源、useForwardBindings(props, companyDefaults) 透传

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/index.ts` 追加 install 注册 + 组件/类型 export（含 12 个多子组件：TmRow/TmCol、TmLayout/TmSider/TmHeader/TmContent/TmFooter、TmTypographyTitle/Paragraph/Text/Link）
- [x] 3.2 resolver 泛化覆盖验证（TmSpace→space→@tm/ui，无需改代码，build 产物确认）
- [x] 3.3 `pnpm --filter @tm/ui build` 通过，双格式产物与 .d.ts 正确

## 4. 测试

- [x] 4.1 每组件 `__tests__/*.spec.ts`：TmSpace 默认 size 与覆盖、TmDivider 默认形态与透传、TmFlex 默认 gap、TmGrid Row/Col 透传与响应式、TmLayout 子组件透传、TmTypography 四子组件渲染、slots 透传、方法透传
- [x] 4.2 `pnpm test` 全绿且覆盖率 ≥80%，新增组件纳入 coverage 校验

## 5. 文档

- [x] 5.1 每组件 `demos/*.vue` + `apps/docs/components/{space,divider,flex,grid,layout,typography}.md`（DemoBlock + <<< 引用 + TmPropsTable）
- [x] 5.2 `apps/docs/.vitepress/config.ts` 侧边栏新增「通用与布局」分组
