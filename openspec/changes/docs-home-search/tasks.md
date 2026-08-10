## 1. 本地搜索

- [x] 1.1 `config.ts` 的 `themeConfig` 启用 `search: { provider: 'local' }`

## 2. 首页 Landing

- [x] 2.1 `index.md` 重构为 `layout: home`：hero 区（name / text / tagline / 两个 actions）
- [x] 2.2 `index.md` 补充 `features` 特性卡片（薄封装 / 主题联动 / 数据驱动表格）

## 3. 验证

- [x] 3.1 `pnpm --filter @tm/docs build` 成功，首页 hero 与特性卡片渲染进 SSR HTML
- [x] 3.2 构建产物生成 local search 索引 chunk（components_*.md.*.js）
