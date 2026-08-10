## Purpose

Defines the @tm/ui documentation site's top-level presentation behaviors: a home landing page introducing the component library, and site-wide local full-text search across component documentation.

## ADDED Requirements

### Requirement: 首页落地页

文档站首页 SHALL 以 VitePress home layout 呈现，包含组件库名称、定位描述与快速入口。首页 SHALL 展示组件库的核心特性，并 SHALL 提供跳转到组件文档的 CTA 按钮。

#### Scenario: 首页展示品牌信息

- **WHEN** 用户访问文档站根路径
- **THEN** 页面展示组件库名称（@tm/ui）、定位描述（基于 ant-design-vue + vxe-table 二次封装）与快速入口按钮

#### Scenario: 首页展示核心特性

- **WHEN** 用户访问首页
- **THEN** 页面展示至少一组特性卡片，概述组件库核心能力（如薄封装、主题联动、数据驱动表格）

### Requirement: 全站本地全文搜索

文档站 SHALL 启用 VitePress 本地全文搜索，用户 SHALL 能在导航栏搜索框输入关键词检索全部文档页面内容（含组件页标题、章节与代码块）。

#### Scenario: 搜索组件文档

- **WHEN** 用户在导航栏搜索框输入关键词（如组件名「Table」）
- **THEN** 搜索结果列出包含该关键词的文档页面与位置

#### Scenario: 无结果提示

- **WHEN** 用户输入的关键词无任何页面命中
- **THEN** 搜索面板展示无结果状态，不报错
