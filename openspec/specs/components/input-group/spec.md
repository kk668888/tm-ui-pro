## Purpose

定义 TmInputGroup 输入框组合容器的公开行为：将多个输入控件以共享边框的紧凑组合渲染（ant Input.Group 薄封装）。

## Requirements

### Requirement: 组合渲染契约

TmInputGroup SHALL 将插槽内的多个输入控件渲染为视觉紧凑的组合体（控件间共享边框、无间隙），组合内部各控件保持独立可用。

#### Scenario: 紧凑组合
- **WHEN** 插槽内并排放置两个 TmInput
- **THEN** 两者以共享边框的组合形态渲染，各自可聚焦输入

### Requirement: 原生能力透传

TmInputGroup SHALL 透传 ant Input.Group 原生属性（`compact` 紧凑模式、`size` 尺寸等）与事件，业务显式传入生效。

#### Scenario: 尺寸透传
- **WHEN** 业务传 `size: small`
- **THEN** 组合体内全部控件按 small 尺寸渲染
