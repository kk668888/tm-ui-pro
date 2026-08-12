## Why

@tm/ui 数据展示层仅覆盖 Table / Tag / Badge / Empty 四个高频组件，Card（业务页骨架）、Tooltip（剪裁性隐形依赖，Popover/Popconfirm 同源）、Collapse / Descriptions / Statistic 等均缺失，业务详情页、概览页、卡片布局只能裸用 ant。此批补齐数据展示补充组件，是「100% 覆盖」路线图的第四批，也是最大的一批（15 个）。

## What Changes

- 新增 15 个 ant 薄封装组件：`TmCard`、`TmCollapse`、`TmDescriptions`、`TmTimeline`、`TmAvatar`、`TmImage`、`TmList`、`TmSegmented`、`TmStatistic`、`TmCalendar`、`TmCarousel`、`TmQRCode`、`TmTooltip`、`TmComment`、`TmWatermark`
- `TmTooltip`：薄封装 ant Tooltip，统一公司提示气泡视觉；作为 Popover / Popconfirm 的同源底层，先统一它可反哺弹层一致性
- `TmCard`：薄封装 ant Card，业务页骨架，统一卡片视觉（`bordered` / `title` 默认兜底）
- `TmCollapse`：薄封装 ant Collapse（含 `TmCollapsePanel`），统一折叠面板
- `TmDescriptions`：薄封装 ant Descriptions（含 `TmDescriptionsItem`），统一详情描述
- `TmTimeline`：薄封装 ant Timeline，统一时间轴
- `TmAvatar`：薄封装 ant Avatar（含 `TmAvatarGroup`），统一头像
- `TmImage`：薄封装 ant Image（含 `TmImagePreviewGroup`），统一图片预览
- `TmList`：薄封装 ant List（含 `TmListItem` / `TmListItemMeta`），统一列表
- `TmSegmented`：薄封装 ant Segmented，统一分段控制器
- `TmStatistic`：薄封装 ant Statistic（含 `TmCountdown`），统一统计数值
- `TmCalendar`：薄封装 ant Calendar，统一日历
- `TmCarousel`：薄封装 ant Carousel，统一轮播
- `TmQRCode`：薄封装 ant QRCode，统一二维码
- `TmComment`：薄封装 ant Comment（ant 已标记废弃，保留封装以满足全覆盖，文档注明推荐替代）
- `TmWatermark`：薄封装 ant Watermark，统一水印
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底
- 注册导出：`index.ts` 追加 install + export，resolver 泛化覆盖；文档页 + demos + 侧边栏

## Capabilities

### New Capabilities

- `components/card`: TmCard 卡片（业务页骨架，公司视觉默认）
- `components/collapse`: TmCollapse 折叠面板（含 TmCollapsePanel）
- `components/descriptions`: TmDescriptions 描述列表（含 TmDescriptionsItem）
- `components/timeline`: TmTimeline 时间轴（ant 原生透传）
- `components/avatar`: TmAvatar 头像（含 TmAvatarGroup）
- `components/image`: TmImage 图片（含 TmImagePreviewGroup）
- `components/list`: TmList 列表（含 TmListItem / TmListItemMeta）
- `components/segmented`: TmSegmented 分段控制器（ant 原生透传）
- `components/statistic`: TmStatistic 统计数值（含 TmCountdown）
- `components/calendar`: TmCalendar 日历（ant 原生透传）
- `components/carousel`: TmCarousel 轮播（ant 原生透传）
- `components/qrcode`: TmQRCode 二维码（ant 原生透传）
- `components/tooltip`: TmTooltip 文字提示（统一气泡视觉，反哺弹层一致性）
- `components/comment`: TmComment 评论（ant 废弃标记，全覆盖保留）
- `components/watermark`: TmWatermark 水印（ant 原生透传）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{card,collapse,descriptions,timeline,avatar,image,list,segmented,statistic,calendar,carousel,qrcode,tooltip,comment,watermark}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（泛化覆盖，无需改动，build 验证）
- `apps/docs/.vitepress/config.ts`（侧边栏「数据展示」分组扩充）
- `apps/docs/components/{card,collapse,descriptions,timeline,avatar,image,list,segmented,statistic,calendar,carousel,qrcode,tooltip,comment,watermark}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 15 个能力规格）
