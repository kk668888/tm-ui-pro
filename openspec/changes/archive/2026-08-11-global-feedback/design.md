## Context

本库此前全部为组件式薄封装（组件树内吃到 TmConfigProvider 上下文）。ant 4.x 的全局反馈是命令式 API，不走组件树，拿不到 locale/token，导致业务全局提示主题漂移。本变更引入**首个函数式形态**：通过 TmApp 桥接 ant 的 `<App>` + `useApp()` 到模块级 holder，让命令式 API 也能吃上下文。行为契约见 `specs/components/{app,message,notification,modal,drawer}/spec.md`。

## Goals / Non-Goals

**Goals:**
- 命令式 API（TmMessage/TmNotification/TmModal.confirm）绑定 ConfigProvider 上下文
- 组件式 Modal/Drawer 薄封装（v-model 桥接）
- 无 TmApp 时优雅降级（功能可用、不抛错）

**Non-Goals:**
- 不做 Message/Modal 的主题 token 定制（交给 ConfigProvider）
- 不要求业务必须用 TmApp（降级兜底保证可用性，但主题跟随需 TmApp）

## Decisions

### 1. feedbackHolder：模块级单例持有 useAppProps

```
packages/ui/src/utils/feedbackHolder.ts
  let holder: useAppProps | undefined
  setHolder(h)      // 仅 TmApp 调用
  getHolder()       // TmMessage 等读取
```

`useAppProps = { message, notification, modal }`（ant 类型）。模块级单例、不可变更新（每次 set 覆盖引用），与 withInstall 的不可变约定一致。**useApp() 只能在组件 setup 里调用**——所以由 TmApp 捕获，命令式 API 读 holder。

### 2. TmApp 桥接组件

```
TmApp.vue:
  <App v-bind="$attrs">   ← ant App
    <slot />              ← 业务子树
  </App>
  setup: onMounted? 不——直接 setup 里 const app = useApp(); setHolder(app)
```

注意：`useApp()` 在 setup 同步调用即可（ant 内部用 inject AppContextKey）。TmApp 同时透传 ant App 的 `message`/`notification` 配置 prop。

### 3. 降级策略：holder 空 → ant 全局

```
TmMessage.success = (content, opts) =>
  (getHolder()?.message ?? antMessage).success(content, opts)
```

`antMessage` = `import { message as antMessage } from 'ant-design-vue'`（全局命令式）。holder 空时用 ant 全局——功能可用、主题不跟随。每处调用做 `?.` 容错，杜绝未包裹 TmApp 时的崩溃。

### 4. TmModal 双形态

- **命令式**：`TmModal.confirm/info/success/error/warning` → `(getHolder()?.modal ?? antModal).confirm(config)`（antModal 为 `Modal` 的静态方法）
- **组件式** `<TmModal v-model="open">`：薄封装，`modelValue ↔ open` 桥接（ant Modal 受控键是 `open` + `onUpdate:open`），剥离 modelValue/open/onUpdate:open，其余透传
- 命令式静态方法挂在**同一个**导出对象上：`export const TmModal = Object.assign(TmModalComponent, { confirm, info, success, error, warning })`

### 5. 函数式 API 不走 resolver，组件式走泛化

TmMessage/TmNotification/TmModal 静态方法 / TmApp 是 named export（`index.ts` 导出）。组件式（TmModal 组件 / TmDrawer / TmApp）走 resolver 泛化（Tm 前缀 → @tm/ui）；函数式 API 不是组件，无需 resolver。

### 6. TmDrawer 纯组件式薄封装

`modelValue ↔ open` 桥接 + ant 原生透传 + useForwardRef。最简，套 Modal 组件式骨架。

## Risks / Trade-offs

- [业务必须包裹 TmApp 才有主题跟随] → 降级保证可用；文档明确 TmApp 是主题跟随的前提（与 ConfigProvider 同层包裹）
- [降级时主题漂移（已知）] → 设计取舍：优先「功能可用」，主题跟随是 TmApp 的增量价值
- [模块级 holder 是全局可变状态] → 不可变引用更新 + 单例，测试可用 setHolder 注入/复位
- [命令式 API 难单测（真实弹出）] → 单测聚焦 holder 选择逻辑（mock holder / 降级分支），不测真实 DOM 弹出
