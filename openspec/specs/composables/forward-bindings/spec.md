## Purpose

定义薄封装组件向内部 ant/vxe 组件透传 props 的统一契约：只透传业务显式传入的值与公司默认值，缺省可选 Boolean 的幻影 false 不透传，避免覆盖内部组件默认行为导致触发交互失效。

## Requirements

### Requirement: 业务未传的可选 Boolean 不透传幻影 false

薄封装组件 SHALL 对业务**未显式传入**且被框架归一化为 `false` 的可选 Boolean prop 不透传给内部组件，由内部组件的默认行为兜底。该契约 SHALL 适用于**全部**薄封装组件（含早期遗留组件），统一经 `useForwardBindings` 实现，不依赖逐组件手工补丁。

#### Scenario: 缺省 open 保持非受控可弹出

- **WHEN** 业务使用 TmPopover / TmPopconfirm 且未传 `open`
- **THEN** 内部组件未收到被强转的 `open=false`，保持非受控，点击触发区弹出气泡/确认框

#### Scenario: 缺省 openFileDialogOnClick 触发区可打开文件框

- **WHEN** 业务使用 TmUpload 且未传 `openFileDialogOnClick`
- **THEN** 内部组件未收到被强转的 `false`，沿用默认行为，点击触发区打开文件选择框

#### Scenario: 遗留组件迁移后缺省透传语义不变

- **WHEN** 业务使用早期遗留组件（如 TmButton / TmSelect / TmModal）且未传受影响的可选 Boolean
- **THEN** 组件经 `useForwardBindings` 透传，缺省值继续由内部 ant 组件兜底，行为与迁移前一致

### Requirement: 业务显式传入的 props 原样透传

薄封装组件 SHALL 将业务**显式传入**的 props（含显式 `false` / `undefined` / 字符串等）原样透传给内部组件。

#### Scenario: 显式传 open=false 受控关闭

- **WHEN** 业务显式传 `:open="false"`
- **THEN** 内部组件收到 `open=false`，气泡/确认框处于关闭状态

#### Scenario: 显式传普通 prop 透传

- **WHEN** 业务显式传 `action` / `before-upload` 等任意 prop
- **THEN** 内部组件收到业务值，行为与直接使用 ant 一致

### Requirement: 公司默认值始终透传

薄封装组件 SHALL 将公司默认值（`withDefaults` 或中间变换合成的键）透传给内部组件，业务未传时生效，业务显式传值时覆盖。

#### Scenario: 公司默认生效

- **WHEN** 业务未传公司默认键（如 `showUploadList`）
- **THEN** 内部组件收到公司默认值（`true`）

#### Scenario: 业务显式覆盖公司默认

- **WHEN** 业务显式传 `:show-upload-list="false"`
- **THEN** 内部组件收到业务值 `false`，覆盖公司默认

### Requirement: 非 props 透传与事件监听透传

薄封装组件 SHALL 透传非 props 的属性（`class` / `style` / 自定义属性）与事件监听器（`@change` / `@click` 等）到内部组件，行为与直接使用 ant 一致。

#### Scenario: 事件监听器透传

- **WHEN** 业务在薄封装上绑定 `@change`
- **THEN** 内部组件触发 change 时业务监听器被调用
