# add-missing-subcomponents — Tasks

## 1. 结构子组件：别名复用（design D2，23 项）

- [x] 1.1 创建 `packages/ui/src/components/select/src/options.ts`：导出 `TmSelectOption` / `TmSelectOptGroup`（别名复用 ant SelectOption / SelectOptGroup）；同法建 `auto-complete/src/options.ts` 导出 `TmAutoCompleteOption` / `TmAutoCompleteOptGroup`
- [x] 1.2 创建 `tree`/`tree-select` 侧导出 `TmTreeNode` / `TmTreeSelectNode`（别名复用）；`timeline` 侧导出 `TmTimelineItem`；`badge` 侧导出 `TmBadgeRibbon`
- [x] 1.3 创建 `card` 侧导出 `TmCardGrid` / `TmCardMeta`；`table` 侧（主入口注册处）导出 `TmTableColumn` / `TmTableColumnGroup` / `TmTableSummary` / `TmTableSummaryRow` / `TmTableSummaryCell`
- [x] 1.4 创建 `input` 侧导出 `TmInputGroup`；`button` 侧导出 `TmButtonGroup`；`space` 侧导出 `TmCompact`；`form` 侧导出 `TmFormItemRest`；`skeleton` 侧导出 `TmSkeletonTitle`
- [x] 1.5 创建 `typography` 目录（`index.ts`）：导出 `TmTypography` 本体（别名复用 ant Typography；Title/Text/Paragraph/Link 已有既有导出，不新增）

## 2. 有值通道组件：完整封装（design D1/D4，7 项）

- [x] 2.1 创建 `packages/ui/src/components/textarea/`（index.ts / src/Textarea.vue / props.ts / defaults.ts / demos / __tests__）：v-model 桥接 + `tmInputDefaults` 复用 + FormContext 级联 + 幻影 false 兜底（autosize/showCount 等透传）
- [x] 2.2 创建 `packages/ui/src/components/input-search/`：同范本，search 事件透传 + enterButton prop/插槽 + 默认值级联
- [x] 2.3 创建 `packages/ui/src/components/checkable-tag/`：`v-model:checked` computed 桥接（`update:checked` 与 `change` 双事件透传）
- [x] 2.4 创建 `packages/ui/src/components/month-picker/` / `week-picker/` / `quarter-picker/` / `time-range-picker/`：复用 date-picker defaults，v-model 契约对齐 TmDatePicker，级联 disabled
- [x] 2.5 创建 `packages/ui/src/components/upload-dragger/`：`v-model:fileList` 桥接 + beforeUpload/accept/multiple 透传 + 拖拽区插槽
- [x] 2.6 创建 `packages/ui/src/components/radio-button/`（薄包裹级）：disabled FormContext 级联注入，无值通道剥离

## 3. 注册与导出

- [x] 3.1 `packages/ui/src/components.ts` 按分组追加全部导入与注册（30 项能力；typography 仅本体 1 个导出）
- [x] 3.2 `packages/ui/src/index.ts` 追加对应 re-export（含类型，如有独立 props 类型）；**实现期 API 调整**：选项项类型 TmSelectOption 更名 TmSelectOptionItem（与新增组件 TmSelectOption 撞名，同模块不允许同名值与类型并列导出）
- [x] 3.3 复核 `Object.keys(dist)`：确认 30 项全部出现在主出口且 13 项豁免清单未误入

## 4. 单元测试

- [x] 4.1 有值通道组件各建 `__tests__/<Comp>.spec.ts`：v-model 契约、清空/空值、默认值兜底与业务覆盖、FormContext 级联（对齐对应 spec 场景）
- [x] 4.2 集成测试（design D2 验证点）：21 项别名同一性（vnode.type 全等）+ TmSelect 内 TmSelectOption 选中回写 + TmTree 内 TmTreeNode 嵌套渲染（历史决策翻案成功）；**实现期修正**：TmSelect 需去空数组 options 兜底（否则 truthy 禁用 childrenAsData）、表系列定位为 ant 原生表格场景（service 于 TmTable/vxe 无效）、TmRadioGroup children 组合受 Vue slot parent 语义限制（design D6）
- [x] 4.3 TmTypography 本体渲染冒烟（component 容器标签透传）

## 5. demo 陈列接入

- [x] 5.1 Form/General/DataDisplay section 按归属接入有值通道组件演示（Textarea/InputSearch/日期四件套/CheckableTag/UploadDragger/RadioButton）
- [x] 5.2 结构子组件随父组件演示（SelectOption 入 Select 演示、TimelineItem 入 Timeline 演示、TableSummary 入 Table 演示等），不单独占位

## 6. 文档站（交付清单全项）

- [x] 6.1 按六组批量创建 `apps/docs/components/<kebab>.md` × 30（统一模板：说明/何时使用/示例引 demos 或父组件演示区/API 表；结构类标注「与原生写法等价」）
- [x] 6.2 `apps/docs/.vitepress/config.ts` sidebar 按分组登记 30 条（对齐既有条目格式）
- [x] 6.3 API 表标注设计限制：TreeSelectNode 模板写法以 ant 实际行为为准、Table 系列模板写法与 columns prop 的关系

## 7. 验证收口

- [x] 7.1 `pnpm --filter @trustmo/tm-ui test` 全绿（含新增 spec 与集成测试）；vue-tsc / vite:dts 双路径类型检查通过
- [x] 7.2 `pnpm check`（含 build:docs）通过；TmResolver 对 30 个新名字逐一解析冒烟（node 脚本断言 resolve 结果）
- [x] 7.3 demo 人工过一遍：kebab 写法（`<tm-select-option>` 等）在全量注册下可解析渲染

## 8. 文档案例补齐（2026-09-18 追加；用户要求「这些组件也需要详细的生成案例展示在 docs 中」）

- [x] 8.1 30 项组件各建**真实可运行 demo**（`packages/ui/src/components/<父目录>/demos/*.vue`，每项 2～3 个案例）；别名类子组件的 demo 落在父组件 demos 目录，随父组件语义演示
- [x] 8.2 30 个文档页由「inline 代码块」升级为 `<script setup>` import demo 源码 + `?raw` + `<DemoBlock>` 装配（与 input.md / textarea.md 范式一致），API 分节按真实 props 契约重列（Props / Events / Slots / Methods / Types）
- [x] 8.3 父组件页补「子组件映射」交叉指引 12 页（input / button / space / card / badge / timeline / form / auto-complete / tree-select / radio-group / upload / table）；skeleton 子组件清单补 `TmSkeletonTitle`；table.md 注明「模板列五件套仅对原生 `<a-table>` 有效，TmTable 为 vxe 封装，两者不混用」
- [x] 8.4 `select.md` 类型更名同步：`TmSelectOption` → `TmSelectOptionItem`（TmPropsTable 内 2 处签名 + Types 段），并加迁移说明
- [x] 8.5 实施期发现并修正的文档错误：① `tree.md` 过时警告（「不导出 TmTreeNode」的旧结论已被别名复用翻案）② WeekPicker 推荐格式 `YYYY-wo`（实际输出 `2026-36th`）改为 `YYYY-ww`（输出 `2026-36`）③ 删除「valueFormat 依赖未扩展的 dayjs 插件」错误限制（实测 ant 模块加载即已扩展）
- [x] 8.6 dayjs 插件依赖复核（实测证据）：未加载 ant 时 `dayjs('09:00','HH:mm')` 解析失败、`format('YYYY-wo')` / `format('YYYY-[Q]Q')` 退化为字面量；仅 `require('ant-design-vue')` 后分别变为有效与 `2026-36th` / `2026-Q3` → 结论写入 `useValueFormat.ts` 注释 + 三页新章节「valueFormat 与 dayjs 插件」，并记录真实边界：绑定串须与 valueFormat **严格匹配**（如 `HH:mm:ss` 的初值不能缺秒）
- [x] 8.7 单测加固：WeekPicker / QuarterPicker / TimeRangePicker 由「仅断言 `dayjs.isDayjs`」改为断言**真实解析值与回写值**（Invalid Date 同样是 Dayjs 对象，旧断言漏掉插件缺失类问题）
- [x] 8.8 机械校验：全部文档页 demo import 路径可解析（111 处，0 缺失）；30 页在 sidebar 全覆盖；`pnpm check` EXIT=0（lint + vue-tsc + build:ui + build:docs 全页 SSR 渲染）；文档改动后重建 build:docs 再次通过；单测 **774 通过**（含本轮新增的容错用例）；`openspec validate add-missing-subcomponents` → valid

## 9. 全库子组件演示补齐（2026-09-18 追加；用户要求「每个子组件都需要加上演示案例，而不只是描述」）

- [x] 9.1 盘点口径：以构建产物 `dist/index.cjs` 的权威导出面（139 个 `Tm*`）与**所有 demo 源码**做差集，找出从未被任何演示使用的组件——避免只按「文档里列过的名字」盘点而漏掉未被提及者
- [x] 9.2 盘点结论：仅 5 个子组件此前只有映射表条目/文字描述——`TmBreadcrumbSeparator`、`TmSubMenu`、`TmMenuItemGroup`、`TmMenuDivider`、`TmMentionsOption`；另 `app.md`（`TmApp`）整页无 demo（纯描述）。其余 4 个「无 demo」为误判：`TmMessage`/`TmNotification` 经 `TmMessage.success()` 方法调用已演示、`TmConfigProvider` 的 demo 位于 `src/config-provider/`、`TmResolver` 是工具非组件
- [x] 9.3 新增 4 个 demo：`breadcrumb/demos/separator.vue`（容器级 separator / `separator=""` + 显式 Separator 逐段自定义）、`menu/demos/children-mode.vue`（SubMenu 嵌套 / ItemGroup 分组 / Divider 分割线）、`mentions/demos/option-children.vue`（子组件写法 vs `options` 写法对照）、`app/demos/basic.vue`（TmApp 包裹下的命令式提示与确认框）
- [x] 9.4 四个文档页装配：`breadcrumb.md`（新增「分隔符自定义」节）、`menu.md`（新增「子组件写法」节）、`mentions.md`（新增「子组件写法（TmMentionsOption）」节，标注 ant 4.2.6 已废弃并给出推荐写法）、`app.md`（补 DemoBlock，从纯描述变为可交互）
- [x] 9.5 实测查明并写入文档的 ant 行为（均配单测锁定，防文档与实现漂移）：① Breadcrumb 的 **Item 级 `separator` 属性会被容器 `cloneVNode` 覆盖**（写 `>` 仍显示 `/`）② 单独放 `BreadcrumbSeparator` 会与子项自带分隔符**重复渲染**，正解是容器 `separator=""` ③ Menu 的 `items` 与模板子组件**二选一**（`itemsNodes || flattenChildren(slots.default)`，传了 items 后子组件静默不渲染）④ `Mentions.Option` 在 ant 4.2.6 已废弃（开发环境打印 deprecation 提示），新代码用 `:options`
- [x] 9.6 单测加固：breadcrumb 3 例（容器级生效 / Item 级被覆盖 / `separator=""` 不重复）、menu 2 例（子组件族真实渲染 / items 优先于子组件）、mentions 由「挂载不报错」升级为「转发给 ant 的是真实 TmMentionsOption vnode 且 value 透传」
- [x] 9.7 验证：`pnpm check` EXIT=0（lint + vue-tsc + build:ui + build:docs 全页 SSR 渲染，四个新装配页均渲染通过）；单测 **779 通过**（104 文件）；覆盖差集复核再无「零演示」的子组件
