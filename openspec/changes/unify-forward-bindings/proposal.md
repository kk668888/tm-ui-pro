# Proposal: 统一解决 Boolean 幻影 false 透传（useForwardBindings）

## Why

薄封装组件（TmButton/TmUpload/TmPopover 等）用 `{...$attrs, ...props}` 全量透传 ant props，但类型化 `defineProps<TmProps>()` 会把业务**未传**的可选 Boolean prop 归一化为 `false`（幻影 false）。透传后覆盖 ant 内部默认，导致触发交互失效：Popover/Popconfirm 的 `open` 变受控 `false` 永不弹出、Upload 的 `openFileDialogOnClick` 变 `false` 点击无反应。此前靠逐组件手工 `withDefaults(..., { xxx: undefined })` 修补，易漏、难维护，且同类隐患仍潜伏在其余 ~20 个薄封装组件中。

## What Changes

- 新增共享 composable `useForwardBindings`：只转发三类值——`$attrs`、**业务显式传入的 props**、**公司默认值**；跳过被归一化的幻影 `false`，由 ant 内部默认兜底。
- 迁移已受影响的 Upload / Popover / Popconfirm 三个组件接入 composable，**删除**手工 `open: undefined` / `visible: undefined` / `openFileDialogOnClick: undefined` 补丁。
- 新增 composable 单测（幻影 false 跳过、显式 props 转发、公司默认转发、computed 源适配）及 Upload 点击回归测试。
- 后续（本 change 不实施）：其余 ~20 个薄封装组件按同一模式迁移，含中间变换组件（Button/Form/Table 等）传 computed 源 + 补 `companyDefaults`。

## Capabilities

### New Capabilities

- `composables/forward-bindings`: `useForwardBindings` 的透传契约——薄封装只转发业务显式传入的 props 与公司默认值，缺省可选 Boolean 的幻影 false 不透传，由内部 ant/vxe 默认兜底。

### Modified Capabilities

- （无）本 change 不改动任何现有 spec 的既有需求，仅修正薄封装的透传实现。

## Impact

- 新增：`packages/ui/src/composables/useForwardBindings.ts` 及单测 `useForwardBindings.spec.ts`
- 修改：`packages/ui/src/components/{upload,popover,popconfirm}/src/*.vue`（接入 composable、删手工补丁）、`packages/ui/src/components/upload/__tests__/Upload.spec.ts`（回归测试）
- 依赖：Vue（`getCurrentInstance` / `useAttrs` / `isRef`），无新增第三方依赖
- 破坏性：无。行为回归到 ant 原生默认（打开文件框 / 弹出气泡），对显式传值的业务无影响
