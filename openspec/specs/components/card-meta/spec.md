## Purpose

定义 TmCardMeta 卡片元信息的公开行为：作为 TmCard 的头像/标题/描述区块（ant Card.Meta 薄封装）。

## Requirements

### Requirement: 元信息区块契约

TmCardMeta SHALL 渲染头像、标题、描述三段元信息：`avatar` / `title` / `description` 既支持 prop 也支持同名插槽，插槽优先；未提供的段落不渲染占位。

#### Scenario: 三段渲染
- **WHEN** 业务同时传 `avatar` 与 `title` prop、使用 `description` 插槽
- **THEN** 三段按 ant Card.Meta 版式渲染，描述取插槽内容

### Requirement: 原生属性透传

TmCardMeta SHALL 透传原生属性与事件，业务显式传入生效。

#### Scenario: 透传生效
- **WHEN** 业务传入原生支持的属性
- **THEN** 属性原样作用于元信息容器
