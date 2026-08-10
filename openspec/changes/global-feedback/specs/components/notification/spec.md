## Purpose

Defines TmNotification, an imperative global notification API that prefers the ConfigProvider-bound instance captured by TmApp and falls back to ant's global notification when no TmApp ancestor exists.

## ADDED Requirements

### Requirement: 静态方法显示通知

TmNotification SHALL 导出静态方法 `success` / `info` / `warning` / `error`，在任意位置调用即显示全局通知（右上角卡片），与业务是否处于组件树无关。

#### Scenario: 调用 success 显示通知

- **WHEN** 业务调用 `TmNotification.success({ message: '任务完成', description: '...' })`
- **THEN** 右上角出现成功类型通知卡片

### Requirement: App 上下文优先

有 TmApp 包裹时，TmNotification SHALL 使用 holder 中绑定了 ConfigProvider 上下文的 notification 实例。

#### Scenario: 包裹 TmApp 用上下文实例

- **WHEN** 根组件用 TmApp 包裹后调用 TmNotification.success
- **THEN** 通知使用 ConfigProvider 上下文渲染

### Requirement: 无 TmApp 降级

holder 为空时，TmNotification SHALL 降级到 ant 全局 notification，功能可用、不抛错。

#### Scenario: 未包裹降级全局

- **WHEN** 未包裹 TmApp 且调用 TmNotification.success
- **THEN** 通知仍显示（ant 全局默认主题），不抛异常

### Requirement: 返回销毁句柄

TmNotification 各方法 SHALL 返回销毁句柄（可手动关闭通知）。

#### Scenario: 手动关闭

- **WHEN** 调用返回的销毁句柄
- **THEN** 对应通知关闭
