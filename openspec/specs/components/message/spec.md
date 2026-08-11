## Purpose

Defines TmMessage, an imperative global message API that prefers the ConfigProvider-bound instance captured by TmApp and falls back to ant's global message when no TmApp ancestor exists.

## Requirements

### Requirement: 静态方法显示全局提示

TmMessage SHALL 导出静态方法 `success` / `info` / `warning` / `error` / `loading`，在任意位置（组件内外）调用即显示全局消息提示，与业务是否处于组件树无关。

#### Scenario: 调用 success 显示提示

- **WHEN** 业务调用 `TmMessage.success('保存成功')`
- **THEN** 屏幕出现成功类型消息「保存成功」

### Requirement: App 上下文优先

有 TmApp 包裹（holder 非空）时，TmMessage SHALL 使用 holder 中绑定了 ConfigProvider 上下文的 message 实例，主题 / locale 自动跟随。

#### Scenario: 包裹 TmApp 用上下文实例

- **WHEN** 根组件用 TmApp 包裹后调用 TmMessage.success
- **THEN** 消息使用 ConfigProvider 上下文渲染（中文 locale / 主题 token 生效）

### Requirement: 无 TmApp 降级

holder 为空（未包裹 TmApp）时，TmMessage SHALL 降级到 ant 全局 message，功能可用、不抛错。

#### Scenario: 未包裹降级全局

- **WHEN** 未包裹 TmApp 且调用 TmMessage.success
- **THEN** 消息仍显示（使用 ant 全局默认主题），不抛异常

### Requirement: 返回销毁句柄与时长

TmMessage 各方法 SHALL 返回销毁句柄（可手动关闭）并支持 ant 的 `duration` 自动关闭时长。

#### Scenario: 手动关闭

- **WHEN** 调用 `const h = TmMessage.success('...')` 后执行 `h()` 或 `h.close()`
- **THEN** 对应消息关闭
