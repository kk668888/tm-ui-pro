# add-missing-subcomponents

## Why

对 ant-design-vue 4.2.6 全量导出（139 个）与库内 Tm 导出（108 个）做脚本级盘点，发现 30 个子组件/命名空间成员未封装：业务写 `<tm-select-option>`、`<tm-textarea>`、排版体系 `<tm-typography>` 等时，TmResolver 按 fail-fast 约定在构建期报 named export 缺失，全量注册场景则解析失败渲染为未知元素。2026-08-12 的 100% 覆盖批次按 ant 顶层组件盘点，命名空间子组件（`Select.Option`、`Input.Search`、`Card.Meta` 这类提升导出）整体漏网，本次补齐达成真正的 100% 覆盖。

## What Changes

按 ant 原生命名空间归属分六组新增 30 个薄封装组件：

- **输入类（11）**：`TmTextarea`、`TmInputGroup`、`TmInputSearch`、`TmSelectOption`、`TmSelectOptGroup`、`TmAutoCompleteOption`、`TmAutoCompleteOptGroup`、`TmTreeNode`、`TmTreeSelectNode`、`TmRadioButton`、`TmUploadDragger`
- **日期类（4）**：`TmMonthPicker`、`TmWeekPicker`、`TmQuarterPicker`、`TmTimeRangePicker`
- **展示类（6）**：`TmTypography`（排版本体；`TmTypographyTitle` / `TmTypographyText` / `TmTypographyParagraph` / `TmTypographyLink` 已由既有导出承接，本变更仅补本体入口）、`TmTimelineItem`、`TmBadgeRibbon`、`TmCheckableTag`、`TmCardGrid`、`TmCardMeta`
- **表格类（5）**：`TmTableColumn`、`TmTableColumnGroup`、`TmTableSummary`、`TmTableSummaryRow`、`TmTableSummaryCell`
- **布局/辅助类（4）**：`TmButtonGroup`、`TmCompact`（Space.Compact）、`TmFormItemRest`、`TmSkeletonTitle`

统一实现约定：

- 无值通道的纯结构子组件（Option/Node/Meta/Summary 等）采用**直接别名或超薄包裹**，保证 ant 父组件对子组件的 vnode type 识别不被破坏（详见 design D2）
- 有值通道的输入型组件（Textarea / InputSearch / 日期四件套 / RadioButton / UploadDragger）按 TmInput 范本完整封装：v-model 桥接、公司默认值、FormContext 级联
- 主出口批量注册导出；TmResolver 无需改动
- 交付清单全项：每组件单元测试、demo 陈列页接入、文档站组件页 + sidebar 登记
- 明确不做（13 项豁免）：LayoutHeader/Footer/Content/Sider（已有 TmHeader 等改名版）、BackTop（TmFloatButtonBackTop 承接）、StatisticCountdown（TmCountdown 承接）、Grid（TmRow/Col 覆盖）、LocaleProvider（ant 已废弃）、Keyframes/StyleProvider/Theme（cssinjs 基础设施，非 UI 组件）、InputPassword（已由 add-input-password 变更承接）

## Capabilities

### New Capabilities

- `components/textarea`: TmTextarea 多行文本域——v-model 契约、公司默认值、FormContext 级联与原生能力透传
- `components/input-group`: TmInputGroup 输入框组合容器——组合渲染契约与原生透传
- `components/input-search`: TmInputSearch 带搜索按钮输入框——v-model 契约、search 事件与按钮/enterBoth 触发
- `components/select-option`: TmSelectOption 下拉选项——作为 TmSelect 子组件的识别契约与 label/value 透传
- `components/select-opt-group`: TmSelectOptGroup 下拉选项分组——分组渲染与识别契约
- `components/auto-complete-option`: TmAutoCompleteOption 自动完成选项——识别契约与透传
- `components/auto-complete-opt-group`: TmAutoCompleteOptGroup 自动完成选项分组——分组渲染与识别契约
- `components/tree-node`: TmTreeNode 树节点——作为 TmTreeNode 子组件的模板写法契约与透传
- `components/tree-select-node`: TmTreeSelectNode 树选择节点——模板写法契约与透传
- `components/radio-button`: TmRadioButton 按钮态单选——作为 TmRadioGroup 值单元的契约与级联
- `components/upload-dragger`: TmUploadDragger 拖拽上传——拖拽区渲染契约与 v-model:fileList 透传
- `components/month-picker`: TmMonthPicker 月份选择器——v-model 契约、公司默认值与级联
- `components/week-picker`: TmWeekPicker 周选择器——v-model 契约、公司默认值与级联
- `components/quarter-picker`: TmQuarterPicker 季度选择器——v-model 契约、公司默认值与级联
- `components/time-range-picker`: TmTimeRangePicker 时间范围选择器——区间 v-model 契约与级联
- `components/typography`: TmTypography 排版本体——ant Typography 本体的薄封装入口（Title/Text/Paragraph/Link 已由既有 `TmTypography*` 导出承接），透传其基础文本能力
- `components/timeline-item`: TmTimelineItem 时间线条目——作为 TmTimeline 子组件的契约（color/label/dot）与透传
- `components/badge-ribbon`: TmBadgeRibbon 缎带徽标——作为 TmBadge 子组件的契约与透传
- `components/checkable-tag`: TmCheckableTag 可选中标签——选中态契约与 change 事件
- `components/card-grid`: TmCardGrid 卡片栅格单元——作为 TmCard 子组件的契约与透传
- `components/card-meta`: TmCardMeta 卡片元信息——avatar/title/description 插槽契约与透传
- `components/table-column`: TmTableColumn 表格列模板写法——作为 TmTable 子组件的列定义契约
- `components/table-column-group`: TmTableColumnGroup 表格列分组——表头分组契约
- `components/table-summary`: TmTableSummary 表格总结栏容器——fixed/总结栏渲染契约
- `components/table-summary-row`: TmTableSummaryRow 总结栏行——行渲染契约
- `components/table-summary-cell`: TmTableSummaryCell 总结栏单元格——index/col-span/row-span 契约
- `components/button-group`: TmButtonGroup 按钮组——组合渲染契约与透传
- `components/compact`: TmCompact 紧凑排布容器（Space.Compact）——子控件去间隙排布契约与 block/direction 透传
- `components/form-item-rest`: TmFormItemRest 表单数据采集豁免区——不采集内部控件值的契约
- `components/skeleton-title`: TmSkeletonTitle 骨架屏标题条——宽度/前缀样式透传契约

### Modified Capabilities

（无——现有组件 spec 均不受影响；TmSelect/TmTree 等父组件的模板子组件写法是其 spec 未覆盖的能力补全，以新能力承载）

## Impact

- **新增代码**：`packages/ui/src/components/` 下 30 个组件目录（各含 `index.ts` / `src/<Comp>.vue` 或别名导出 / 有值通道组件含 `props.ts`、`defaults.ts`；`typography` 含多成员导出），选择性配 `demos/basic.vue` 与 `__tests__/*.spec.ts`
- **注册与导出**：`packages/ui/src/components.ts` 与 `packages/ui/src/index.ts` 批量追加 30+ 导出；demo 组件陈列页按分组接入；文档站新增 30 个组件页与 sidebar 登记
- **依赖**：无新增第三方依赖（全部来自既有 ant-design-vue）
- **风险**：核心风险是 ant 父组件对薄封装子组件的 vnode type 识别（type 全等判断会因包裹层失效）——design D2 以「无值通道直接别名复用」规避；其余沿用 TmInput 范本的已知风险（Boolean 幻影 false、默认值兜底）
