## Context

文档站 `apps/docs` 基于 VitePress 1.5，当前 `index.md` 仅两行纯文本，`config.ts` 的 `themeConfig` 无搜索配置。改动纯属 `apps/docs` 层，不涉及组件库源码。动机见 proposal.md，行为契约见 specs/docs/site。

## Goals / Non-Goals

**Goals:**
- 首页用 VitePress 官方 home layout（frontmatter 驱动，零自定义组件）
- 启用 VitePress 内置 local search

**Non-Goals:**
- 不自建首页组件 / 不引入自定义设计（跟随 VitePress 默认主题视觉）
- 不用 Algolia 远程搜索（需外部服务与 API key，组件库文档体量无此必要）

## Decisions

### D1. 首页用 VitePress home layout（frontmatter 驱动）

`index.md` 顶部声明 `layout: home` + `hero` + `features` frontmatter。VitePress 原生渲染品牌区（name/text/tagline/actions）与特性卡片网格，零自定义组件、自动跟随明暗主题、响应式免费。

- **备选**：自定义 `.vue` 首页组件 → 需自己处理响应式与主题，收益低，弃用。

### D2. 搜索用 VitePress 内置 local search

`themeConfig.search: { provider: 'local' }`。VitePress 用 pagefind/minisearch 在构建期索引全站，客户端零请求本地检索。

- **备选**：Algolia DocSearch → 需注册外部服务 + 填 `apiKey`/`appId`/`indexName`，内部组件库不宜依赖外部搜索服务，弃用。

### D3. 首页文案对齐组件库真实能力

hero 的 tagline 与 features 卡片内容取自组件库实际定位：薄封装（原生能力全透传 + 公司默认规范）、主题联动（ant token → vxe CSS 变量桥接）、数据驱动表格（TmTable + ant 分页/搜索）。避免夸大或编造能力。

## Risks / Trade-offs

- **home layout 的 features 固定三列网格** → VitePress 布局约束，仅展示精选 3 条核心特性，深度内容靠组件页。
- **local search 索引构建耗时** → 当前 6 个页面体量极小，无感；页面增多后仍为毫秒级。

## Migration Plan

1. `config.ts` 加 `search: { provider: 'local' }`
2. `index.md` 重构为 home layout frontmatter
3. `pnpm dev` 验证首页渲染与搜索框可用

## Open Questions

无。
