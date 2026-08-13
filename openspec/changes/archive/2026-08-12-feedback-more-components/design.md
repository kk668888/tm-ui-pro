## Context

@tm/ui 已形成稳定的 ant-design-vue 薄封装模式：类型沿用上游导出，`useForwardBindings` 只转发业务显式值和公司默认值，动态插槽完整透传，`useForwardRef` 暴露内部实例能力，多子组件模块分别 `withInstall` 后聚合导出；`TmTag` / `TmAlert` 已建立「业务 `status` 语义 → ant 语义色」的共享映射（`constants/status.ts`）。变更动机与组件范围见 `proposal.md`，对外行为见 `specs/components/*/spec.md`。

当前依赖为 ant-design-vue 4.2.6。已从本地安装包确认 4 个目标模块均存在：`Progress`（单组件，无子模块命名空间）、`Skeleton`（命名空间，含 `Avatar` / `Image` / `Input` / `Button` / `Title`）、`Tour`（单组件）、`FloatButton`（命名空间，含 `Group` / `BackTop`）。`BackTop` 独立组件在 ant 5 已移除，能力由 `FloatButton.BackTop` 承接。

## Goals / Non-Goals

**Goals:**
- 让 4 个组件遵循既有薄封装骨架，避免 Boolean 可选属性被 Vue 归一化为幻影 `false` 后覆盖上游默认值。
- `TmProgress` 提供与 `TmTag` 一致的业务 `status` 语义映射（`success` / `processing` / `failed` / `warning`），业务无需手写 ant 状态值。
- 多子组件能力（`TmSkeleton*`、`TmFloatButtonGroup` / `TmFloatButtonBackTop`）按既有模块模式独立注册和导出，全量安装与 resolver 自动解析均可工作。
- 通过聚焦测试锁定映射、受控状态、插槽与公开方法，再以包构建验证类型产物。

**Non-Goals:**
- 不重新实现 ant-design-vue 的进度动画、骨架占位、引导遮罩或滚动监听逻辑。
- 不在本批新增提案未列出的导出（如 `TmSkeletonTitle` / `TmSkeletonParagraph` / `TmFloatButtonContent`）；需要时另立变更扩展公开 API。
- 不为 ant 原生 `status` 值域（`success` / `exception` / `normal` / `active`）额外发明业务语义，业务态与原生态通过同一 `status` 键按映射表互转。

## Decisions

### 1. 统一使用薄封装骨架，不抽象共享 SFC

每个 SFC 使用 `defineOptions({ name, inheritAttrs: false })`、类型化 `defineProps`、`useForwardBindings`、动态 slots 透传与 `useForwardRef`，独立文件保留上游类型与公司默认的就地可读注释。

**备选方案：**建立通用高阶包装器。否决，理由同 data-display 批次——Vue SFC 的类型、插槽与实例推导在不同上游组件间差异明显，高阶抽象会降低声明文件可读性并偏离仓库既有模式。

### 2. TmProgress 的 status 语义映射

ant Progress 原生 `status` 值域为 `success` / `exception` / `normal` / `active`，与共享业务语义（`success` / `processing` / `failed` / `warning`）不一致。`TmProgress` 沿用 `TmTag` 的扩展键思路，但建立独立映射表 `src/status.ts`（`TmTag` 的预设色名对 Progress 无效，因 `strokeColor` 需 CSS 颜色值）：

| 业务 status | 映射到 ant |
| --- | --- |
| `success` | `status='success'` |
| `processing` | `status='active'`（活跃流动动画） |
| `failed` | `status='exception'` |
| `warning` | `status='normal'` + `strokeColor` 兜底为 ant 默认 warning 色 `#faad14` |

映射只在业务传入的 `status` 命中业务值域时生效；ant 原生值（`active` / `normal` 等）原样透传。显式 `strokeColor` 优先于映射兜底。映射表集中在 `src/status.ts` 便于单测锁定。

**备选方案：**仅透传 ant 原生 `status`，不提供业务语义映射。否决，因为 `TmTag` / `TmAlert` 已建立跨组件统一的业务状态语义，Progress 应保持一致，避免业务为进度条单独记一套 ant 值。

### 3. 多子组件模块按命名空间导出

`Skeleton` 与 `FloatButton` 按现有 form、menu 模块模式组织：主组件与子组件分别 `withInstall`，模块默认导出聚合对象。

| 模块 | 导出 |
| --- | --- |
| progress | `TmProgress` |
| skeleton | `TmSkeleton`、`TmSkeletonAvatar`、`TmSkeletonImage`、`TmSkeletonInput`、`TmSkeletonButton` |
| tour | `TmTour` |
| float-button | `TmFloatButton`、`TmFloatButtonGroup`、`TmFloatButtonBackTop` |

`TmSkeletonTitle` 等上游其余子组件不在本批导出（Non-Goals），需要时另立变更。

### 4. BackTop 能力由 FloatButton 承接

ant 5 移除独立 `BackTop`，`TmFloatButtonBackTop` 直接包装 ant `FloatButton.BackTop`，透传 `target` / `visibilityHeight` 等原生 props 与方法。文档标注其承接原 `TmBackTop`（若存在）的使用迁移路径。

**备选方案：**自行实现返回顶部组件。否决，会脱离上游主题令牌并重复滚动监听逻辑。

### 5. Tour 与受控 Boolean 陷阱

`TmTour` 透传 `open` / `current` / `steps` 等原生 props，`open` 缺省不形成受控幻影 `false`（走 `useForwardBindings` 跳过缺省值）。**关闭桥接**：ant Tour 4.2.6 关闭 / 完成只调用 `onClose` / `onFinish` 回调、不发射 `update:open` 事件（已读 vc-tour 源码确认），业务需手动置 `open=false` 才能闭合 v-model。因此 `TmTour` 将 ant `close` / `finish` 桥接为 `update:open=false`，`onClose` / `onFinish` 从透传对象剔除（避免与桥接合并成数组监听器），业务仅需 `v-model:open` 即可正常开合。Tour 依赖真实 DOM 锚点与 `getBoundingClientRect`，jsdom 不完整，单测聚焦 wrapper 透传、关闭桥接与 `useForwardRef`，交互路径以 docs demo 作浏览器验证面。

### 6. 注册、文档和验证作为同一交付单元

`packages/ui/src/index.ts` 负责全量安装与类型导出；resolver 继续依赖 `Tm` 前缀泛化规则，不增加白名单。每个组件提供最小可运行 demo 与独立文档页，侧边栏纳入「全局反馈」分组。测试以 wrapper 契约为重点，不重复验证 ant 内部算法。

## Risks / Trade-offs

- [`TmProgress` 的 status 映射与 ant 原生值域并存，边界易混] → 映射表独立文件 + 单测锁定 4 个业务值与 ant 原生值透传；文档列出映射表。
- [`warning` 无 ant 原生 status，需硬编码 `#faad14`] → 仅作为 `strokeColor` 兜底且显式值优先；注释标注色值来源，随主题迁移时集中替换。
- [Tour 的遮罩 / 锚点依赖浏览器 API，jsdom 不完整] → 单测聚焦 wrapper 透传，docs demo 作为浏览器级验证面。
- [Skeleton / FloatButton 多子组件增加单批改动量] → 按骨架、实现、注册、测试、文档拆分任务，每组完成后运行聚焦测试，最终全量门禁。

## Migration Plan

本变更仅新增公开组件，不修改既有组件 API，无数据迁移。发布时先完成包构建与文档构建，再由业务按需将 ant 直接导入替换为 Tm 组件；`FloatButton.BackTop` 承接原 `BackTop` 的使用者直接迁移到 `TmFloatButtonBackTop`。
