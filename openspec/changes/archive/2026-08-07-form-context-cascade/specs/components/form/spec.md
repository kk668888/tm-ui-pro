## Purpose

Defines TmForm's company-level form behaviors layered on top of the ant Form thin wrapper: a provide/inject cascade channel for submitting / readonly / disabled states, and change tracking over the form model with an automatic initial snapshot.

## ADDED Requirements

### Requirement: FormContext 联动通道下发

TmForm SHALL 经 provide/inject 向后代组件下发一个联动上下文，包含 `submitting` / `readonly` / `disabled` 三个可选状态。后代组件（TmFormItem、TmInput、TmSelect）SHALL 能注入该上下文；当组件不在任何 TmForm 祖先内时 SHALL 返回 undefined 且不影响渲染。

#### Scenario: 后代组件注入上下文

- **WHEN** 组件挂载在 TmForm 内
- **THEN** 后代组件能注入 TmForm 下发的上下文并读取 submitting / readonly / disabled 状态

#### Scenario: 无 TmForm 祖先时容错

- **WHEN** TmInput / TmSelect / TmFormItem 独立使用（无 TmForm 祖先）
- **THEN** 注入上下文返回 undefined，组件正常渲染且不报错

### Requirement: submitting 提交 loading 态

TmForm SHALL 将 `submitting` 值经联动上下文下发。TmFormItem 的 default slot SHALL 通过 slot props 暴露 `submitting`，供按钮区在提交期间消费（如 loading + 禁用防止重复提交）。

#### Scenario: slot props 暴露 submitting

- **WHEN** TmForm 传入 `submitting: true`
- **THEN** 内部 TmFormItem 的 default slot 收到 `submitting: true`

#### Scenario: 未传 submitting 不生效

- **WHEN** TmForm 未传 `submitting`
- **THEN** slot props 的 submitting 为 undefined，按钮区不受影响

### Requirement: readonly 全局只读级联

TmForm SHALL 将 `readonly` 值经联动上下文下发，并级联到表单控件。TmInput SHALL 在只读模式下不可编辑但保留文字与视觉（ant 原生只读）。TmSelect 因 ant 无只读能力，SHALL 锁死下拉使其不可选择，且 SHALL 不显示清除按钮。

#### Scenario: TmInput 只读不可编辑

- **WHEN** TmForm 传入 `readonly: true` 且内部有 TmInput
- **THEN** TmInput 处于只读状态：可选中文字但不可编辑

#### Scenario: TmSelect 只读不可下拉

- **WHEN** TmForm 传入 `readonly: true` 且内部有 TmSelect
- **THEN** TmSelect 下拉无法打开、无法选择新值，且无清除按钮

#### Scenario: 业务显式传值优先于 context

- **WHEN** TmForm 传入 `readonly: true`，但业务对某个 TmInput 显式传 `readonly: false`
- **THEN** 该 TmInput 保持可编辑（业务显式传值优先）

### Requirement: disabled 全局禁用级联

TmForm SHALL 将 `disabled` 值透传 ant Form 原生 prop（保留 ant 整表禁用能力），并经联动上下文级联到 TmInput / TmSelect，使其灰底不可操作。业务显式传同名 prop SHALL 优先于上下文。

#### Scenario: 整表禁用 Input 与 Select

- **WHEN** TmForm 传入 `disabled: true`
- **THEN** 内部 TmInput 与 TmSelect 均为禁用态（灰底、不可交互）

#### Scenario: 业务显式传值优先于 context

- **WHEN** TmForm 传入 `disabled: true`，但业务对某个 TmSelect 显式传 `disabled: false`
- **THEN** 该 TmSelect 保持可操作

### Requirement: readonly 与 disabled 可共存

TmForm 同时传入 `readonly` 与 `disabled` 时，SHALL 对控件同时生效：TmSelect 既锁死下拉又灰底禁用。

#### Scenario: 同时只读与禁用

- **WHEN** TmForm 传入 `readonly: true` 且 `disabled: true`
- **THEN** 内部 TmSelect 下拉锁死且处于禁用态

### Requirement: 变更追踪

TmForm SHALL 在挂载时自动快照 `model` 作为初始值，并暴露 `isDirty()` / `getDirtyFields()` / `resetToInitial()` / `markInitial()` 四个方法。`isDirty()` SHALL 返回当前 model 是否有字段与初始快照不同（浅比较）；`getDirtyFields()` SHALL 返回所有值已变更的字段名；`resetToInitial()` SHALL 将 model 全部字段恢复到初始快照并清除校验状态；`markInitial()` SHALL 将当前 model 重新标记为初始快照。

#### Scenario: 未修改时非脏

- **WHEN** TmForm 挂载后业务未修改任何字段
- **THEN** `isDirty()` 返回 false，`getDirtyFields()` 返回空数组

#### Scenario: 修改后判定脏

- **WHEN** 业务修改了 model 中的某个字段值
- **THEN** `isDirty()` 返回 true，`getDirtyFields()` 包含该字段名

#### Scenario: 重置到初始值

- **WHEN** 业务修改字段后调用 `resetToInitial()`
- **THEN** model 全部字段恢复到初始快照值，且 `isDirty()` 返回 false

#### Scenario: 手动重新标记初始

- **WHEN** 业务修改字段后调用 `markInitial()`
- **THEN** 当前 model 成为新的初始快照，`isDirty()` 返回 false
