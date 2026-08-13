## Purpose

Defines TmApp, the bridge component that captures ant's useApp() instance (message/notification/modal bound to ConfigProvider context) into a module-level holder, so TmMessage/TmNotification/TmModal imperative APIs can consume the company theme.

## Requirements

### Requirement: 捕获 useApp 到模块级 holder

TmApp SHALL 渲染 ant `<App>` 并在 setup 中调用 `useApp()` 捕获其 message / notification / modal 实例到模块级 holder，供全局命令式 API（TmMessage 等）读取。业务根组件用 `<TmApp>` 包裹后，全局反馈自动绑定 ConfigProvider 下发的 locale / token。

#### Scenario: 包裹后命令式 API 拿到上下文实例

- **WHEN** 业务根组件用 `<TmApp>` 包裹，且之后调用 `TmMessage.success(...)`
- **THEN** 提示使用绑定 ConfigProvider 上下文的实例渲染（主题 / locale 跟随）

### Requirement: ant App 原生能力透传

TmApp SHALL 透传 ant App 原生 props（`rootClassName` / `message` / `notification` 配置），业务对 ant App 的用法不变。

#### Scenario: 消息配置透传

- **WHEN** 传入 `message: { maxCount: 3 }`
- **THEN** ant App 按配置约束消息数量

### Requirement: holder 空时容错

holder 为空（业务未包裹 TmApp）时，TmApp SHALL 不抛错；命令式 API 由各组件自行降级到 ant 全局 API（见 message/modal spec）。

#### Scenario: 未包裹 TmApp 不报错

- **WHEN** 业务未使用 TmApp 且调用全局命令式 API
- **THEN** 不抛出未捕获异常，反馈降级到 ant 全局（功能可用、主题不跟随）
