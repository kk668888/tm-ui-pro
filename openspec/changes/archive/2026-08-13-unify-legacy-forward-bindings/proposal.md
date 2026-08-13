## Why

`useForwardBindings`（composable）已确立为薄封装组件向 ant/vxe 内部组件透传 props 的统一契约：只转发 `$attrs` + 业务显式传入 + 公司默认值，跳过缺省可选 Boolean 的「幻影 false」，根治触发交互失效。但该 composable 诞生时仅迁移了 Upload / Popover / Popconfirm 三个受影响组件，**早于它的 ~23 个薄封装组件仍用旧模式 `computed(() => ({...$attrs, ...props}))` 全量透传**，依赖各自 `withDefaults` 手工补丁规避 Boolean 陷阱，模式不统一、逐组件修补易漏、维护成本高。本 change 将遗留组件统一迁移到 `useForwardBindings`，达成全组件库透传契约一致。

## What Changes

- 将 23 个早期薄封装组件从 `{...$attrs, ...props}` 全量透传迁移为 `useForwardBindings(props, companyDefaults, excludedKeys)`
- 迁移时核对每个组件的 `withDefaults` 兜底键与中间变换合成键，全部列入 `companyDefaults` 保证转发（D4）
- 模板显式绑定的监听器（如 `@update:file-list`）列入 `excludedKeys`，避免数组监听器崩溃
- 对受影响组件补充「未传不收到幻影 false」回归断言，防止迁移后行为回归

## Capabilities

### New Capabilities

- （无）

### Modified Capabilities

- `composables/forward-bindings`: 扩展统一透传契约的适用范围——全部薄封装组件 SHALL 采用该契约，不再依赖逐组件手工补丁

## Impact

- `packages/ui/src/components/{alert,badge,button,cascader,checkbox-group,date-picker,range-picker,drawer,empty,form,form-item,input,input-number,modal,radio-group,result,select,spin,switch,table,tag,time-picker,tree-select}/src/*.vue`（23 个旧模式组件迁移，删除 `{...$attrs, ...props}` 全量透传）
- 相关 `__tests__/*.spec.ts`：补幻影 false 不透传回归断言
- 兼容性：行为保持（缺省值继续由 ant 兜底），`withDefaults` 语义不变，仅透传实现统一
