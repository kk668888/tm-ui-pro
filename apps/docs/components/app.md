# App 全局反馈桥接

`TmApp` 是全局反馈层的基础：业务**根组件**用 `<TmApp>` 包裹后，`TmMessage` / `TmNotification` / `TmModal.confirm()` 等命令式 API 自动绑定 `TmConfigProvider` 下发的 locale / token（主题跟随）。

## 为什么需要

ant 4.x 的全局反馈（message / notification / modal）是**命令式 API**——不走组件树，拿不到 ConfigProvider 上下文。`TmApp` 内部用 ant 的 `message.useMessage()` 等 hooks 在组件树内创建绑定上下文的实例，捕获到模块级 holder，供命令式 API 消费。

## 用法

业务根组件包裹（与 `TmConfigProvider` 同层，通常在其内）：

```vue
<template>
  <TmConfigProvider>
    <TmApp>
      <App />
    </TmApp>
  </TmConfigProvider>
</template>
```

## 行为

- **有 `<TmApp>`**：`TmMessage.success('...')` 等使用绑定 ConfigProvider 上下文的实例，主题 / locale 跟随
- **无 `<TmApp>`**：命令式 API 降级到 ant 全局（功能可用、主题不跟随、不抛错）

> `TmApp` 内部是 ant `<App>`。业务如需用 ant 自身的 `useApp()` 也可——但注意 `useApp()` 返回的是 ant `<App>` 内部的实例，与 `TmMessage` 等命令式 API 消费的 holder 是**两套独立的 contextHolder**（行为一致、绑定同一 ConfigProvider，但非同一实例）。

## API

### TmApp Props

透传 ant App 原生 props（`rootClassName` / `message` / `notification` 配置）。

### Slots

- `default`：业务子树（被包裹的应用内容）
