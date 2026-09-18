## Purpose

定义 TmButtonGroup 按钮组的公开行为：将多个按钮以组合形态渲染（ant Button.Group 薄封装）。

## ADDED Requirements

### Requirement: 组合渲染契约

TmButtonGroup SHALL 将插槽内的多个按钮渲染为相连的按钮组（相邻按钮边框合并、无间隙），各按钮独立可点。

#### Scenario: 相连按钮组
- **WHEN** 插槽内并排放置三个按钮
- **THEN** 三者以共享边框的组合形态渲染，点击互不影响

### Requirement: 尺寸透传

TmButtonGroup SHALL 透传 `size` 等原生属性：组级尺寸作用于全部子按钮。

#### Scenario: 组级尺寸
- **WHEN** 业务传 `size: small`
- **THEN** 组内全部按钮按 small 尺寸渲染
