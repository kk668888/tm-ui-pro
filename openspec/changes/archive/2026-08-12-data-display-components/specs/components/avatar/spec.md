## Purpose

定义 TmAvatar 头像及头像组的公开行为，为用户、组织和对象标识提供统一的图片、图标与文字展示方式。

## ADDED Requirements

### Requirement: 头像与头像组
TmAvatar SHALL 导出 TmAvatar 与 TmAvatarGroup，并支持图片、图标、文字以及头像组溢出展示。

#### Scenario: 图片加载失败回退
- **WHEN** 头像图片加载失败且业务监听错误事件
- **THEN** 组件触发原生错误事件并允许业务使用回退内容

### Requirement: 原生属性透传
TmAvatar SHALL 透传 Avatar 与 AvatarGroup 原生属性、事件和插槽，包括形状、尺寸、间距和最大展示数量。

#### Scenario: 头像组溢出
- **WHEN** 头像数量超过业务设置的最大展示数量
- **THEN** 头像组显示原生溢出汇总入口
