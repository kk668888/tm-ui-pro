## Purpose

定义 TmImage 图片及预览组的公开行为，为业务图片展示、失败回退和多图预览提供一致的交互入口。

## ADDED Requirements

### Requirement: 图片展示与预览
TmImage SHALL 导出 TmImage 与 TmImagePreviewGroup，并支持单图预览、预览组切换、占位和失败回退。

#### Scenario: 打开图片预览
- **WHEN** 图片启用预览且用户点击图片
- **THEN** 打开原生预览层并展示对应图片

### Requirement: 原生能力透传
TmImage SHALL 透传 Image 与 PreviewGroup 原生属性、事件和插槽，包括尺寸、来源、预览配置与可见状态。

#### Scenario: 受控关闭预览
- **WHEN** 业务受控设置预览可见状态为 false
- **THEN** 预览层关闭并保持业务状态一致
