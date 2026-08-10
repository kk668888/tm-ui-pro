## Why

文档站 demo 交互与 API 呈现有提升空间：demo 源码块常驻展开占满页面高度（Todo「代码支持展开收缩」）；API 表格为手写 markdown，与组件库 ant 视觉不统一且不可排序（Todo「api 表格使用已封装的 vxetable」）；`TmConfigProvider` 是主题桥接核心却无独立文档页。

## What Changes

- **DemoBlock 支持代码折叠/展开**：`DemoBlock` 增加 `code` prop，md 中通过 `?raw` import 源码传入，预览区下方提供「显示代码/收起」切换与复制按钮，替代常驻的 `<<<` 代码块。
- **API 表格改用 TmTable 渲染**：新建 docs 层可复用组件 `TmPropsTable`（内部用 `TmTable`，固定列 `prop/desc/type/default/required`），各组件页 Props 表格改由数据驱动渲染，统一 ant 视觉并支持排序。
- **新增 ConfigProvider 文档页**：新增 `config-provider.md`（主题桥接机制 + locale 说明）+ 配套 demo，纳入导航/侧边栏。

## Capabilities

### New Capabilities

- `docs/site`: 文档站行为扩展——demo 代码折叠交互、API 表格数据驱动渲染、ConfigProvider 文档页。

### Modified Capabilities

无（不改变组件库组件行为，TmPropsTable 为 docs 层呈现组件；ConfigProvider demo 仅新增展示，不影响组件实现）。

## Impact

- **代码**：`apps/docs/.vitepress/theme/components/DemoBlock.vue`（折叠）、新增 `apps/docs/.vitepress/theme/components/TmPropsTable.vue`、`apps/docs/components/*.md`（API 表格迁移）、新增 `apps/docs/components/config-provider.md`
- **组件库**：新增 `packages/ui/src/config-provider/demos/basic.vue`（docs 引用）
- **导航**：`apps/docs/.vitepress/config.ts` 侧边栏加 ConfigProvider 项
