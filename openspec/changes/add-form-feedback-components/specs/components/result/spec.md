## Purpose

Defines TmResult, a result-page component that transparently passes through ant Result props, slots, and events for status-page (403/404/500/success) scenarios.

## ADDED Requirements

### Requirement: ant 属性 / 插槽 / 事件透传

TmResult SHALL 透传 ant Result 全部原生 props / slots / events（如 `status` / `title` / `subTitle` / `extra` / `icon` / `title` 插槽 / `subTitle` 插槽 / `extra` 插槽 / `icon` 插槽）。

#### Scenario: 状态页渲染

- **WHEN** 业务传 `status="404"`、`title="页面不存在"` 与 `extra` 返回按钮
- **THEN** 渲染对应状态图标、标题与操作区

#### Scenario: 自定义插槽透传

- **WHEN** 业务提供 `icon` / `subTitle` 插槽
- **THEN** 自定义内容替代默认图标与副标题
