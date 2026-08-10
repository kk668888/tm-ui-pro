## Why

文档站 `apps/docs` 当前门面简陋：首页只有 2 行文本 + 一个跳转链接；5 个组件页缺少站内搜索能力。作为组件库对外展示的门户，首页 Landing 与搜索是低成本高感知的体验提升，直接降低使用者的上手成本。

## What Changes

- **首页 Landing**：`apps/docs/index.md` 从纯文本升级为 VitePress `layout: home` 首页（hero 区 + 特性卡片 + CTA 按钮），展示组件库定位、核心特性与快速入口。
- **本地搜索**：`apps/docs/.vitepress/config.ts` 启用 VitePress 内置 local search（`themeConfig.search`），全站全文检索组件文档。

## Capabilities

### New Capabilities

- `docs/site`: 文档站自身行为——首页落地页呈现与全站本地全文搜索。

### Modified Capabilities

无（不涉及组件库组件行为变更，纯 apps/docs 层改动）。

## Impact

- **代码**：`apps/docs/index.md`（首页重构）、`apps/docs/.vitepress/config.ts`（搜索配置）
- **依赖**：无新增（VitePress 内置 home layout 与 local search）
- **范围**：纯文档站层，不触碰 `packages/ui` 组件库源码
