## Purpose

定义 TmCheckableTag 可选中标签的公开行为：ant Tag.CheckableTag 的库内薄封装，提供受检选中契约。

## Requirements

### Requirement: 选中契约

TmCheckableTag SHALL 以 `v-model:checked` 双向绑定选中态（映射 ant `checked` 与 `update:checked`），并同时触发 `change` 事件携带新选中值；选中态呈高亮语义样式。

#### Scenario: 点击切换
- **WHEN** 业务 `v-model:checked="on"` 且标签当前未选中，用户点击
- **THEN** `on` 更新为 `true`，`change` 事件携带 `true`，标签呈选中样式

### Requirement: 内容与透传

默认插槽为标签文本；其余原生属性与事件透传，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于标签节点
