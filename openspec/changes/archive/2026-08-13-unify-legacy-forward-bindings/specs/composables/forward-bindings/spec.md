## MODIFIED Requirements

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
