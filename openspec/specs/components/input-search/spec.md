## Purpose

定义 TmInputSearch 带搜索按钮输入框的公开行为：ant Input.Search 的库内薄封装，提供 v-model 契约、search 事件与公司默认值。

## Requirements

### Requirement: v-model 值契约

TmInputSearch SHALL 以 `modelValue: string` 双向绑定；清空时 SHALL emit `''`。

#### Scenario: 双向绑定
- **WHEN** 业务 `v-model="kw"` 并键入 `tm`
- **THEN** `kw` 更新为 `tm`

### Requirement: search 事件触发

业务点击搜索按钮、按下回车或点击清除后的搜索 SHALL 触发 `search` 事件，事件 SHALL 携带当前输入值与原始事件对象。

#### Scenario: 回车触发搜索
- **WHEN** 输入框值为 `tm` 时按下回车
- **THEN** `search` 事件触发且首个参数为 `tm`

### Requirement: 搜索按钮形态

`enterButton` SHALL 控制触发控件形态：不传时渲染搜索图标后缀；传 boolean 时渲染按钮；传自定义内容或使用 `enterButton` 插槽时按业务内容渲染。

#### Scenario: enterButton 渲染按钮
- **WHEN** 业务传 `enterButton: true`
- **THEN** 触发控件渲染为「搜索」按钮而非图标

### Requirement: 公司默认值与 FormContext 级联

公司默认值（`allowClear` / `size` / `bordered`）与 TmInput 一致；未显式传 `disabled` / `readonly` 时级联祖先 TmForm。

#### Scenario: 级联禁用
- **WHEN** 祖先 TmForm `disabled` 为真且业务未传 disabled
- **THEN** 输入框与搜索按钮均不可交互
