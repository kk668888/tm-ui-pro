# add-missing-subcomponents — Design

## Context

- 盘点方法：`Object.keys(ant-design-vue)`（139 个大写导出）与 `Object.keys(@trustmo/tm-ui)`（108 个 Tm 导出）脚本差集，人工剔除改名/承接/非组件项后余 30 个真缺口（明细见 proposal）。
- 30 项全是「命名空间成员提升导出」类（`Select.Option` → `SelectOption`、`Input.Search` → `InputSearch`…），2026-08-12 批次按顶层组件盘点时整体漏网。
- TmInput 范本六机制与「幻影 false 兜底」经验已沉淀（见 add-input-password design），有值通道组件直接沿用。
- 关键约束：TmResolver 只认 `Tm` 前缀**具名导出**；ant 父组件（vc-select/vc-tree/vc-table 等）对模板子组件的识别机制未在库内验证过。

## Goals / Non-Goals

**Goals:**

- 30 个子组件全部可经 `<TmXxx>` / `<tm-xxx>`（全量注册 kebab 解析）使用，TmResolver 具名解析零 fail-fast 误报。
- 有值通道组件与库内既有表单控件契约完全一致；结构子组件与 ant 原生写法行为无差别。

**Non-Goals:**

- 不改 TmSelect/TmTree 等父组件代码（模板子组件能力由子组件自身承载）。
- 不补 13 项豁免清单（proposal 已列）；不动 validation / resolver 体系。

## Decisions

### D1：按「有无值通道」二分实现策略

- **结构子组件（21 项）**——SelectOption/SelectOptGroup/AutoCompleteOption/AutoCompleteOptGroup/TreeNode/TreeSelectNode/TimelineItem/BadgeRibbon/CardGrid/CardMeta/TableColumn/TableColumnGroup/TableSummary/TableSummaryRow/TableSummaryCell/ButtonGroup/Compact/FormItemRest/SkeletonTitle/InputGroup/TmTypography 本体：**直接别名复用 ant 组件**（`export const TmSelectOption = ASelectOption` 级别）或超薄包裹（仅 inheritAttrs 调整）。无 v-model、无公司默认值、无级联需求，包裹越薄风险越低。
- **有值通道组件（8 项）**——Textarea/InputSearch/CheckableTag（v-model:checked）/MonthPicker/WeekPicker/QuarterPicker/TimeRangePicker/UploadDragger（v-model:fileList）：按 TmInput 范本完整封装（v-model 桥接 + defaults + FormContext 级联 + 幻影 false 兜底）。
- ** RadioButton 介于两者**：无 v-model 但需 disabled 级联（spec 要求），薄包裹 + `useFormContext` 注入，不做值通道剥离。

### D2：结构子组件优先别名复用，规避 ant 内部识别失效

ant 父组件识别模板子组件可能依赖 **vnode.type 全等**（如 vc-select 遍历 children 判断 `type === Option`）。薄封装一旦包一层 defineComponent，type 全等即失效——选项渲染为未知节点。别名复用让 TmSelectOption 与 ASelectOption 是**同一个组件对象**，识别天然成立。这是 D1 把 23 项归入别名的根因。
**实现期验证点**：对 Select/Tree/Table 三组各写一条「模板子组件写法」集成测试；若个别组件 ant 依赖 `name` 字符串匹配而非 type 全等（包裹亦可），再评估升级为带默认值的薄封装，但默认保持别名。

### D3：Typography 仅补本体（实现期盘点修正）

初版盘点误报了整个 Typography 家族缺失——实际 `TmTypographyTitle` / `TmTypographyText` / `TmTypographyParagraph` / `TmTypographyLink` 已以 `TmTypography*` 前缀命名导出（`components.ts` 既有清单、文档站已有 typography 页），初查只测了 `TmTypography` 本体键名而漏检。本变更仅补 `TmTypography` 本体（别名复用 ant Typography，见 D2），不新增任何子导出、不挂静态成员（TmResolver 只认具名导出，静态成员访问无法按需解析——此结论对未来的组件规划依然有效）。

### D4：有值通道组件的默认值与类型来源

- Textarea/InputSearch：复用 `input/src/defaults.ts`（`tmInputDefaults`），props 类型 `InputProps & TmXxxExtProps` 自声明（ant 无 TextAreaProps/搜索专属类型导出的完整契约，沿用 add-input-password D2 的结论与写法）。
- 日期四件套（Month/Week/Quarter/TimeRange）：与 `date-picker` 组件的 defaults 同源——实现时先读 `packages/ui/src/components/date-picker/src/defaults.ts`，复用其默认值集合；`valueFormat` 透传不代理，行为与 TmDatePicker 一致。
- CheckableTag：`checked` 通道经 computed 桥接 `v-model:checked`（ant 已核实同时 emit `update:checked` 与 `change`，两个事件都透传给业务）。
- UploadDragger：`fileList` 通道桥接 `v-model:fileList`，其余 beforeUpload/accept/multiple 原样透传。

### D5：注册与文档批量接入

- `components.ts` 按分组追加 30+ 导入导出（typography 组 4 个）；`index.ts` 同步 re-export。
- 文档站 30 页按六组批量生成（统一模板：组件说明 / 何时使用 / 基础示例 / API 表），结构类组件可共用同一 demo 页面区块；sidebar 按对应分组登记。
- demo 陈列页按现有 section 归属接入（Form/DataDisplay/General 等），结构子组件随父组件演示（如 TmSelectOption 出现在 Select 演示内），不单独占陈列位。

### D6：RadioGroup children 组合限制（实现期确立，dbg 三段对照实验）

**现象**：`TmRadioGroup + TmRadioButton` 模板子组件写法断链——按钮渲染正常但选中态/组值联动失效。三段对照实验定位：原生 Group+TmButton ✓、TmGroup+原生 Button ✗、**极简纯转发 wrapper 包 RadioGroup ✗**——断链与库封装逻辑无关。

**机制**：ant RadioGroup 用 Symbol `provide/inject` 向按钮下发上下文；Vue 的 slot 内容 parent 是**转发 wrapper**（withCtx 绑定），inject 沿 parent 链找不到 Group 的 provide。这是 Vue slot 语义的固有限制（Select 不受影响是因为它用 flattenChildren vnode 遍历而非 inject——该路径问题已修复，见 D4/Select options 修正）。

**对策**：TmRadioButton 保留导出（原生 Group 下完全可用，别名复用行为一致）；TmRadioGroup 组合场景业务走 `options` prop（既有能力）；spec 已如实记录限制。**规划启示**：后续凡依赖 ant provide/inject 的子组件（Radio 系/Checkbox 系）评估 children 组合时须先做极简 wrapper 对照实验。

## Risks / Trade-offs

- [ant 父组件对别名复用之外的识别依赖未全量验证] → D2 的三组集成测试先行；别名复用是零风险下限，仅当集成测试失败才回退到更深方案。
- [结构组件「零封装」意味着无公司默认值层] → 接受。这些组件无默认值诉求（Option/Node/Meta 等），强行包裹只增加失效面；未来出现诉求时单独提案。
- [30 页文档站工作量集中] → 统一模板批量生成 + 结构类共用区块；`pnpm check` 含 build:docs 全量验证死链。
- [Countdown 类已有承接的组件被误重复实现] → proposal 豁免清单已固化（13 项），实现时以 `Object.keys(dist)` 复核防回归。

## Migration Plan

纯新增，无迁移。回滚 = revert 注册与新目录；别名复用项无独立状态，删除导出即回退。

## Open Questions

（无——实现策略已按识别风险定死，无待决分叉）
