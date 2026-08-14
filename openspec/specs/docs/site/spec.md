# docs/site Specification

## Purpose
Defines the @kibus/tm-ui-plus documentation site's top-level presentation behaviors: a home landing page introducing the component library, and site-wide local full-text search across component documentation.
## Requirements
### Requirement: 首页落地页

文档站首页 SHALL 以 VitePress home layout 呈现，包含组件库名称、定位描述与快速入口。首页 SHALL 展示组件库的核心特性，并 SHALL 提供跳转到组件文档的 CTA 按钮。

#### Scenario: 首页展示品牌信息

- **WHEN** 用户访问文档站根路径
- **THEN** 页面展示组件库名称（@kibus/tm-ui-plus）、定位描述（基于 ant-design-vue + vxe-table 二次封装）与快速入口按钮

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

### Requirement: demo 代码折叠展示

文档站的 demo 容器 SHALL 支持源码折叠：默认只展示渲染区，提供「显示代码 / 收起」切换；展开时 SHALL 展示该 demo 的完整源码，并 SHALL 提供一键复制源码按钮。

#### Scenario: 默认收起源码

- **WHEN** 用户访问任一含 demo 的组件页
- **THEN** demo 容器默认只显示预览区，源码折叠隐藏

#### Scenario: 展开与收起源码

- **WHEN** 用户点击「显示代码」切换
- **THEN** demo 容器展开展示完整源码；再次点击「收起」则折叠回预览区

#### Scenario: 一键复制源码

- **WHEN** 用户在源码展开状态下点击复制按钮
- **THEN** 源码文本被复制到剪贴板，并有成功反馈

### Requirement: API 表格数据驱动渲染

文档站的组件 API 表格 SHALL 由组件库的 `TmTable` 渲染（数据驱动），替代手写 markdown 表格。表格 SHALL 至少展示 `prop / 说明 / 类型 / 默认值` 四列，视觉与组件库 ant 主题一致，并 SHALL 支持列排序。

#### Scenario: API 表格统一视觉渲染

- **WHEN** 用户查看任一组件页的 API 表格
- **THEN** 表格由 TmTable 渲染，样式与组件库 ant 主题一致（边框 / 斑马纹 / 表头对齐）

#### Scenario: 列排序

- **WHEN** 用户点击 API 表格的表头
- **THEN** 表格按该列排序（如按属性名升序/降序）

### Requirement: ConfigProvider 文档页

文档站 SHALL 提供 ConfigProvider 组件页，说明其主题桥接与 locale 能力，并展示可运行 demo。ConfigProvider 页 SHALL 纳入组件导航。

#### Scenario: 访问 ConfigProvider 页

- **WHEN** 用户通过侧边栏进入 ConfigProvider 页
- **THEN** 页面展示组件说明、可运行 demo 与 API 说明

#### Scenario: 主题桥接 demo 可运行

- **WHEN** 用户查看 ConfigProvider 页的 demo
- **THEN** demo 中 `TmConfigProvider` 包裹的组件可正常交互渲染

