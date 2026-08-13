## Purpose

定义 TmQRCode 二维码的公开行为，为链接、凭证和业务标识提供可配置、可纠错且具备失效反馈的编码展示。

## Requirements

### Requirement: 二维码生成与状态
TmQRCode SHALL 根据业务值生成二维码，并支持尺寸、颜色、纠错等级、图标以及正常、加载和失效状态。

#### Scenario: 渲染有效二维码
- **WHEN** 业务传入非空二维码值
- **THEN** 组件生成可展示该值的二维码图形

### Requirement: 原生属性与插槽透传
TmQRCode SHALL 透传 QRCode 原生属性、事件和插槽，包括失效刷新入口。

#### Scenario: 刷新失效二维码
- **WHEN** 二维码处于失效状态且用户点击刷新入口
- **THEN** 组件触发原生刷新事件
