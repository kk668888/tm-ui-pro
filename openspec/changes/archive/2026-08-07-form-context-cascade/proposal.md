## Why

TmForm 目前是 ant Form 的纯薄封装（透传 + `useForwardRef` 方法透传），不具备公司级表单能力。业务在弹窗 / 抽屉 footer 触发提交、查看态只读、离开前未保存提示等高频场景需要「提交 loading 态、整表只读 / 禁用、变更追踪」的统一能力，而这些能力目前要业务自己写一遍。

## What Changes

- **FormContext 从空占位升级为真实联动通道**：`TmForm` 经 `provide/inject` 下发 `submitting` / `readonly` / `disabled` 三个计算属性。
- **TmForm 新增 3 个公司扩展键**：`submitting`（提交 loading）、`readonly`（全局只读）、`disabled`（全局禁用，透传 ant Form 原生 prop 保留整表禁用能力）。
- **TmForm 新增变更追踪**：`onMounted` 自动快照 `model`，暴露 `isDirty()` / `getDirtyFields()` / `resetToInitial()` / `markInitial()`（经 `useForwardRef` Proxy 合并暴露）。
- **TmFormItem 消费 FormContext**：default slot props 暴露 `{ submitting, readonly, disabled }`，供第三方控件消费。
- **TmInput / TmSelect 适配级联**：inject FormContext，`readonly` / `disabled` 自动合并到自身 prop（业务显式传优先）。`TmSelect` 因 ant 原生无 readonly，用受控 `open:false` 锁死下拉 + 关闭清除按钮实现只读。
- **新增 3 个 demo**：`readonly.vue`（三态切换）/ `submitting.vue`（提交 loading）/ `dirty.vue`（变更追踪），docs 同步更新。

## Capabilities

### New Capabilities

- `components/form`: TmForm / TmFormItem 的联动上下文（submitting / readonly / disabled 级联）与变更追踪行为。

### Modified Capabilities

无（`components/select` 的 api/remote 数据加载行为未变，级联是 form 侧新增能力）。

## Impact

- **代码**：`packages/ui/src/components/form/`（Form.vue / FormItem.vue / useFormContext.ts / 新增 props.ts）、`packages/ui/src/components/input/src/Input.vue`、`packages/ui/src/components/select/src/Select.vue`
- **类型**：新增 `TmFormProps` / `TmFormExtProps`（form/index.ts 透传）
- **API**：`TmForm` 新增 props 与方法（非破坏，未传不影响现有行为）；`TmFormItem` default slot 新增 props（追加，不破坏）
- **文档 / demo**：`apps/docs/components/form.md` + 3 个新 demo
