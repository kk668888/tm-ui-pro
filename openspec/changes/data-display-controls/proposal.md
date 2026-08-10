## Why

@tm/ui 已完成基础控件与弹层控件两批，但数据展示层的常用组件（标签 / 空态 / 徽标）仍裸用 ant，缺失公司统一的视觉规范。其中表格状态列是最高频场景——业务每次都要手写颜色值，公司无法统一状态色。方向 1 以最低成本补齐数据展示层基础组件，复用既有薄封装模式，其中 TmTag 的 `status` 状态映射还能直接反哺 TmTable 列渲染。

## What Changes

- 新增 3 个 ant 薄封装组件：`TmTag`、`TmEmpty`、`TmBadge`
- `TmTag`：在 ant Tag 之上新增公司扩展键 `status`，把业务枚举（success / processing / failed / warning）自动映射为语义色，业务不再手写颜色；`color` 等 ant 原生能力仍透传、显式 `color` 优先于 `status` 映射
- `TmEmpty`：薄封装 ant Empty，公司默认 `description: '暂无数据'`（业务可覆盖）
- `TmBadge`：薄封装 ant Badge（count / status / dot），公司视觉默认兜底
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底
- 注册导出：`index.ts` 追加 install + export，resolver 泛化覆盖；文档页 + demos + 侧边栏

## Capabilities

### New Capabilities

- `components/tag`: TmTag 标签（status 状态→语义色映射 + ant 原生透传）
- `components/empty`: TmEmpty 空状态（公司默认文案 + ant 原生透传）
- `components/badge`: TmBadge 徽标（ant 原生透传 + 公司默认）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{tag,empty,badge}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（泛化覆盖，无需改动，build 验证）
- `apps/docs/.vitepress/config.ts`（侧边栏「数据展示」分组）
- `apps/docs/components/{tag,empty,badge}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 3 个能力规格）
