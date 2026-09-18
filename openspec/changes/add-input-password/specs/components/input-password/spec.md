## Purpose

定义 TmInputPassword：密码输入组件。对 ant-design-vue `Input.Password` 的库内薄封装，使业务侧可以 `<TmInputPassword>` 直接使用密码输入（含可见性切换），并与库内其它表单控件保持一致的 v-model 契约、公司默认值与 TmForm 级联行为。

## ADDED Requirements

### Requirement: v-model 值契约

TmInputPassword SHALL 以 `modelValue: string` 对外双向绑定：业务侧使用标准 `v-model`，组件内部与 ant 的受控值通道单向映射。输入或清除导致值为空时，SHALL emit 空字符串 `''`（不 emit `undefined`），保持业务侧类型契约稳定。

#### Scenario: 正常双向绑定

- **WHEN** 业务侧 `v-model="pwd"` 且用户键入 `abc123`
- **THEN** `pwd` 更新为 `abc123`

#### Scenario: 清空后 emit 空串

- **WHEN** 值为 `abc123` 时用户清空输入框
- **THEN** modelValue 更新为 `''`，类型仍为 string

### Requirement: 密码可见性切换

TmInputPassword SHALL 默认以密文显示输入内容，并在输入框内提供可见性切换控件（默认开启）：点击后在密文与明文之间切换，SHALL NOT 丢失已输入内容与焦点外的状态。业务侧 SHALL 可通过 `visibilityToggle: false` 关闭切换控件，此时输入恒为密文。

#### Scenario: 默认密文且可切换明文

- **WHEN** 用户在组件内键入 `abc123` 并点击切换控件
- **THEN** 输入内容以明文显示，再次点击恢复密文，值保持 `abc123` 不变

#### Scenario: 关闭可见性切换

- **WHEN** 业务传入 `visibilityToggle: false`
- **THEN** 输入框内不渲染切换控件，输入恒为密文

### Requirement: 自定义切换图标

TmInputPassword SHALL 支持 `iconRender` 插槽：业务通过该插槽自定义可见性切换控件的图标内容，插槽作用域 SHALL 提供对象形态的可见状态 `{ visible }`（与 ant 原生裸 boolean 不同，库内统一包装为对象以支持模板解构）。点击切换行为 SHALL 由组件注入——业务自定义的图标元素被点击时触发密文/明文切换，业务无需自行处理点击回调；业务不提供插槽时使用库默认眼睛图标。

#### Scenario: 业务自定义眼睛图标

- **WHEN** 业务通过 `#iconRender="{ visible }"` 插槽渲染自定义图标
- **THEN** 切换控件展示该自定义内容，点击即切换密文/明文状态，无需业务绑定点击事件

### Requirement: ant Input 能力透传

TmInputPassword SHALL 透传 ant Input.Password 的既有能力：`size` 三档、`allowClear`、`bordered`、`placeholder`、`maxlength`、`status` 校验态及 `prefix` / `suffix` / `addonBefore` / `addonAfter` 等插槽原样可用，并支持 `visible` 受控显隐（配合 `update:visible`）。业务显式传入的同名属性 SHALL 覆盖库默认值。公司默认值（`allowClear` / `size` / `bordered`）与 TmInput 保持一致。

> ant 原生限制（如实记录）：`suffix` 插槽不可用——ant Password 内部恒以自身 suffix（眼睛图标或 false）覆盖，业务 suffix 插槽在任何可见性配置下都不渲染；`prefix` / `addonBefore` / `addonAfter` 插槽不受影响。

#### Scenario: 前后插槽可用性

- **WHEN** 业务同时使用 `prefix` 与 `suffix` 插槽
- **THEN** `prefix` 内容正常渲染在输入框内侧前方；`suffix` 内容不渲染（ant 原生限制）

#### Scenario: 切换控件占用 suffix 位

- **WHEN** 业务在默认可见性切换开启下观察输入框后缀
- **THEN** suffix 位由切换控件占用（ant 原生行为），不视为缺陷

#### Scenario: 业务覆盖公司默认值

- **WHEN** 库默认 `size` 为 middle，业务显式传入 `size: small`
- **THEN** 组件按 small 尺寸渲染

### Requirement: FormContext 级联

TmInputPassword SHALL 注入祖先 TmForm 联动上下文：业务显式传入的 `disabled` / `readonly` 优先；未传时 SHALL 级联 TmForm 的同名状态；两者皆无时保持默认可编辑。级联生效时，可见性切换控件 SHALL 同步不可交互。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且祖先 TmForm 的 disabled 为真
- **THEN** 输入框禁用不可编辑，可见性切换控件不可点击

#### Scenario: 业务显式覆盖级联

- **WHEN** 祖先 TmForm 的 readonly 为真但业务显式传 `readonly: false`
- **THEN** 组件保持可编辑

### Requirement: ref 方法透传

TmInputPassword SHALL 通过组件 ref 暴露 ant Input.Password 实例方法：`focus()` 聚焦输入框，`blur()` 使其失焦。

> ant 原生限制（如实记录）：ant Input.Password 仅暴露 `focus` / `blur`，不提供 `select`，本组件不额外伪造。

#### Scenario: focus 聚焦

- **WHEN** 业务调用组件 ref 的 `focus()`
- **THEN** 密码输入框获得焦点

#### Scenario: blur 失焦

- **WHEN** 输入框处于聚焦状态，业务调用组件 ref 的 `blur()`
- **THEN** 输入框失去焦点
