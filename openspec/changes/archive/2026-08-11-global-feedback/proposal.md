## Why

ant 4.x 的全局反馈 API（`message.success` / `modal.confirm`）是命令式的——不走组件树，因此拿不到 `TmConfigProvider` 下发的 locale / token，业务全局提示与配置主题漂移。本变更补齐全局反馈层，通过 `TmApp` 桥接 ant 的 `<App>` + `useApp()`，让命令式 API 也能吃到公司上下文；同时补组件式的 Modal / Drawer 薄封装。

## What Changes

- 新增 `TmApp`：内部 ant `<App>` + setup 捕获 `useApp()` 实例到模块级 holder；业务根组件用 `<TmApp>` 包裹后，全局反馈自动绑定 ConfigProvider 上下文（locale / token）
- 新增 `TmMessage` / `TmNotification`：**函数式 API**（非组件）——`success/info/warning/error/loading`，读 holder 实例；holder 为空（未包 TmApp）时回退 ant 全局 API（功能可用、主题不跟随）
- 新增 `TmModal`：**命令式** `confirm/info/success/error/warning`（读 holder.modal）+ **组件式** `<TmModal v-model>`（薄封装，v-model 桥接 + 扩展键剥离）
- 新增 `TmDrawer`：组件式薄封装 `<TmDrawer v-model>`（ant 原生透传）
- 新增类型导出：message / notification / modal 相关类型
- 注册导出：`index.ts` 追加；文档页 + demos + 侧边栏
- 本变更为库引入首个「函数式导出 + 模块级 holder」形态（非组件），设计复杂度高于前批

## Capabilities

### New Capabilities

- `components/app`: TmApp 桥接（ant App + useApp 捕获到 holder，供命令式 API 消费）
- `components/message`: TmMessage 命令式 API（success/info/warning/error/loading + App 上下文 + 无 App 降级）
- `components/notification`: TmNotification 命令式 API（success/info/warning/error + App 上下文 + 无 App 降级）
- `components/modal`: TmModal（命令式 confirm/info/success/error/warning + 组件式薄封装）
- `components/drawer`: TmDrawer 组件式薄封装

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{app,message,notification,modal,drawer}/`（新增，message/notification 为函数式导出）
- `packages/ui/src/utils/feedbackHolder.ts`（模块级 holder，跨 TmApp 与命令式 API 共享）
- `packages/ui/src/index.ts`（install 注册组件 + 函数式 API export + 类型 export）
- `packages/ui/src/resolver.ts`（组件式走泛化；函数式 API 非组件不走 resolver）
- `apps/docs/.vitepress/config.ts`（侧边栏「全局反馈」分组）
- `apps/docs/components/{app,message,notification,modal,drawer}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 5 个能力规格）
