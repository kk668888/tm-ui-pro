## Purpose

Defines TmAffix, a thin ant-design-vue Affix wrapper for fixed positioning that stays anchored to a container scroll.

## ADDED Requirements

### Requirement: ant 原生透传

TmAffix SHALL 透传 ant Affix 原生 props / slots / events（`offsetTop` / `offsetBottom` / `target` / `onChange`）。

#### Scenario: 顶部固定

- **WHEN** 渲染 `<TmAffix :offset-top="80">内容</TmAffix>` 且页面滚动
- **THEN** 内容在滚动越过 80px 后固定于视口顶部

#### Scenario: 固定状态回调

- **WHEN** 传入 `@change`
- **THEN** 固定状态变化时触发 ant onChange 回调
