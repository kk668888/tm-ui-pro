## Purpose

Extends the @tm/ui documentation site behaviors: demo source code collapsible within the demo block, API tables rendered by the component library's TmTable for consistent visuals and sorting, and a dedicated ConfigProvider documentation page.

## ADDED Requirements

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
