## Context

组件库 ~25 个薄封装组件统一采用 `forwardBindings = computed(() => ({...$attrs, ...props}))` 透传 ant/vxe props（见 proposal.md - Why）。根因：类型化 `defineProps<TmProps>()` 对业务未传的可选 Boolean prop 走 Vue 的 Boolean casting，归一化为 `false`；该值随 `...props` 全量透传，覆盖 ant 内部默认（Popover/Popconfirm 的 `open`、Upload 的 `openFileDialogOnClick`），导致触发交互失效。此前靠逐个 `withDefaults(..., {xxx: undefined})` 修补，已修 3 处，隐患仍在其余组件。

## Goals / Non-Goals

**Goals:**
- 用单一共享 composable 根治「幻影 false 透传」，取代逐组件手工补丁。
- 只透传三类值：`$attrs`、业务显式传入的 props、公司默认值；其余由内部组件默认兜底。
- 兼容两种来源：直接传 reactive `props`（多数组件），以及传 computed 中间变换（Popconfirm 的 `antProps`，剥离扩展键 + 合成 `okButtonProps`）。

**Non-Goals:**
- 本 change 不迁移全部 ~25 个组件，仅覆盖已受影响的 Upload/Popover/Popconfirm 及共享 composable 本身。
- 不改动 Form/Table 已有自定义 `forwardBindings` 逻辑。
- 不改变 `defineProps` 的声明方式（保持类型安全）。

## Decisions

**D1 过滤规则：只转发显式传入 + 公司默认，其余跳过**
逐 prop 判断：`key in 父组件 vnode.props`（含 kebab/camel 归一）→ 业务显式传入，转发；`key ∈ companyDefaults` → 公司默认，转发；否则跳过（幻影 false / 缺省 undefined 均被过滤，交内部组件默认兜底）。
- 备选：继续手工 `open: undefined` 补丁 → 逐组件易漏，无法覆盖未来组件，否决。
- 备选：把类型化 defineProps 改为运行时 props 对象（显式声明每个 Boolean 无默认）→ 丢失 TS 类型推导收益，改动面过大，否决。
- 备选：维护「Boolean 陷阱 key」黑名单 → 需随 ant 升级持续维护，非根因修复，否决。

**D2 显式值来源：读 `getCurrentInstance().vnode.props`**
该对象是父组件 vnode 上的**原始** props（未做 Boolean 归一化），是「业务到底传没传」的唯一可靠依据。`props` 本身已被归一化，无法区分「显式 false」与「幻影 false」。
- 备选：靠 `$attrs` 反推 → 非 props 的 key 在 attrs、props 的 key 不在 attrs，但已声明且显式传的值会进 props 而非 attrs，无法区分幻影 false，否决。

**D3 来源灵活：reactive props 或 ComputedRef**
签名 `useForwardBindings(source, companyDefaults)`，用 `isRef` 区分：传 `props`（reactive，非 ref）直接迭代；传 `antProps`（ComputedRef）取 `.value`。Popconfirm 的 `antProps` 剥离 `danger` 并合成 `okButtonProps`，后者须列入 `companyDefaults` 保证转发。
- 备选：只支持 reactive props，Popconfirm 先过滤再另存合成键 → 破坏「单一透传来源」约定，否决。

**D4 `companyDefaults` 显式传 key 列表**
调用方把 `withDefaults` 的兜底键（如 Upload 的 `showUploadList`、Popconfirm 的 `okText/cancelText/...`）传入。这些键即使业务未传也须转发，否则会被当成幻影值跳过。
- 备选：自动从 `withDefaults` 推断 → composable 拿不到 withDefaults 参数（defineProps 编译产物），需手动传入，故显式传参。

## Risks / Trade-offs

- **公司默认值为 `false` 会被跳过**（不在 rawProps 且值 false）→ Mitigation: 必须把这类键列入 `companyDefaults`；composable 单测覆盖「显式覆盖公司默认」场景兜底。
- **行为回归面**：接入后缺省值不再透传，依赖旧透传行为的组件可能受影响 → Mitigation: 只迁移已知坏掉的 3 个组件，跑全量测试；其余组件留在本 change 外。
- **`undefined` 值被 JSON/展开丢弃** → 无碍：Vue `v-bind` 遇 `undefined` 自动删除，ant 默认兜底，语义一致。

## Migration Plan

1. 新增 `useForwardBindings` composable + 单测（幻影 false 跳过 / 显式转发 / 公司默认 / 显式覆盖 / computed 源适配）。
2. Upload/Popover/Popconfirm 接入 composable，删除手工 `open: undefined` / `visible: undefined` / `openFileDialogOnClick: undefined` 补丁。
3. 新增 Upload 点击回归测试（触发区 / 内部按钮打开文件框）。
4. 跑 3 组件 + composable + 全量测试与 `vue-tsc`。
5. 后续（新 change）：其余 ~20 个薄封装组件按同一模式迁移；中间变换组件（Button/Form/Table）传 computed 源并补 `companyDefaults`。
