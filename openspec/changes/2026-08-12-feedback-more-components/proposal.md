## Why

@tm/ui 反馈层已覆盖 Alert / Drawer / Message / Modal / Notification / Popconfirm / Result / Spin，但 Progress（进度）、Skeleton（骨架屏）、Tour（引导）、FloatButton（浮动按钮）仍缺失。其中 Skeleton 是加载骨架、Progress 是状态展示的常用组件，FloatButton 是移动端 / 操作入口的补充。此批补齐反馈与其他组件，是「100% 覆盖」路线图的收官批。

## What Changes

- 新增 4 个 ant 薄封装组件：`TmProgress`、`TmSkeleton`、`TmTour`、`TmFloatButton`
- `TmProgress`：薄封装 ant Progress，公司状态色默认（`status` 语义色映射，参照 TmTag.status 模式）
- `TmSkeleton`：薄封装 ant Skeleton（含 `TmSkeletonAvatar` / `TmSkeletonImage` / `TmSkeletonInput` / `TmSkeletonButton`），统一加载骨架
- `TmTour`：薄封装 ant Tour，统一引导遮罩层
- `TmFloatButton`：薄封装 ant FloatButton（含 `TmFloatButtonGroup` / `TmFloatButtonBackTop`），`BackTop` 能力经其子组件承接（ant 5 已移除独立 BackTop）
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底
- 注册导出：`index.ts` 追加 install + export，resolver 泛化覆盖；文档页 + demos + 侧边栏

## Capabilities

### New Capabilities

- `components/progress`: TmProgress 进度条（状态色映射，参照 TmTag.status 模式）
- `components/skeleton`: TmSkeleton 骨架屏（含 TmSkeletonAvatar / TmSkeletonImage / TmSkeletonInput / TmSkeletonButton）
- `components/tour`: TmTour 引导（ant 原生透传 + 公司默认）
- `components/float-button`: TmFloatButton 浮动按钮（含 TmFloatButtonGroup / TmFloatButtonBackTop，承接 BackTop 能力）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{progress,skeleton,tour,float-button}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（泛化覆盖，无需改动，build 验证）
- `apps/docs/.vitepress/config.ts`（侧边栏「全局反馈」分组扩充）
- `apps/docs/components/{progress,skeleton,tour,float-button}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 4 个能力规格）
