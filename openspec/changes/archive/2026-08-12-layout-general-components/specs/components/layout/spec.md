## Purpose

Defines TmLayout, thin ant-design-vue Layout wrappers (TmLayout/TmSider/TmHeader/TmContent/TmFooter) that unify company page scaffold structure.

## ADDED Requirements

### Requirement: 布局子组件族

TmLayout SHALL 导出五个子组件：`TmLayout` / `TmSider` / `TmHeader` / `TmContent` / `TmFooter`，分别薄封装 ant Layout 的 Layout / Sider / Header / Content / Footer。

#### Scenario: 标准页骨架

- **WHEN** 渲染 `<TmLayout><TmHeader>头部</TmHeader><TmContent>内容</TmContent><TmFooter>页脚</TmFooter></TmLayout>`
- **THEN** 按 ant Layout 标准骨架渲染

#### Scenario: 侧边栏布局

- **WHEN** 渲染 `<TmLayout><TmSider>菜单</TmSider><TmLayout><TmHeader>头部</TmHeader><TmContent>内容</TmContent></TmLayout></TmLayout>`
- **THEN** 侧边栏 + 主区布局正确渲染

### Requirement: ant 原生透传

TmLayout 家族 SHALL 透传 ant Layout 原生 props：TmLayout 的 `hasSider`；TmSider 的 `collapsible` / `collapsed` / `collapsedWidth` / `breakpoint` / `width` / `theme`；TmHeader 的 `theme`。slots 全透传。

#### Scenario: 可折叠侧边栏

- **WHEN** TmSider 传入 `collapsible` 且用户触发折叠
- **THEN** 侧边栏折叠/展开状态切换，触发 ant 回调

#### Scenario: 断点自动折叠

- **WHEN** TmSider 传入 `breakpoint="lg"` 且视口低于断点
- **THEN** 侧边栏按 ant 规则自动折叠

#### Scenario: 暗色侧边栏

- **WHEN** TmSider 传入 `theme="dark"`
- **THEN** 侧边栏呈现 ant 暗色主题
