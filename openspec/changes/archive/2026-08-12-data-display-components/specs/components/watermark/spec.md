## Purpose

定义 TmWatermark 水印容器的公开行为，为敏感页面和导出预览提供可配置文本或图片水印及防篡改展示能力。

## ADDED Requirements

### Requirement: 水印内容
TmWatermark SHALL 支持文本数组或图片水印，并支持字体、旋转、间距、偏移、尺寸和层级配置。

#### Scenario: 渲染文本水印
- **WHEN** 业务提供水印文本和容器内容
- **THEN** 水印覆盖在容器内容区域且不替换正文内容

### Requirement: 原生能力透传
TmWatermark SHALL 透传 Watermark 原生属性和默认插槽，并保留上游防篡改行为。

#### Scenario: 更新水印配置
- **WHEN** 业务响应式修改水印文本或样式配置
- **THEN** 容器中的水印同步更新
