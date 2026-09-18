## Purpose

定义 TmCompact 紧凑排布容器的公开行为：ant Space.Compact 的库内薄封装，使块内表单控件以无间隙的紧凑块排布。

## Requirements

### Requirement: 紧凑排布契约

TmCompact SHALL 将插槽内的表单控件渲染为无间隙紧凑块（相邻控件边框合并、圆角只在块两端），控件各自功能不受影响；`block` 使块占满整行，`direction` 控制水平/垂直排布。

#### Scenario: 紧凑块排布
- **WHEN** 插槽内放置 TmInput 与 TmButton
- **THEN** 两者以无间隙紧凑块渲染，连接处圆角取消

#### Scenario: 垂直排布
- **WHEN** 业务传 `direction: vertical`
- **THEN** 控件自上而下紧凑堆叠

### Requirement: 原生属性透传

TmCompact SHALL 透传原生属性与事件，业务显式传入生效。

#### Scenario: 整行占满
- **WHEN** 业务传 `block`
- **THEN** 紧凑块宽度占满父容器
