## Context

文档站 theme 已有自建 `DemoBlock`（预览容器，源码用 VitePress `<<<` 在容器外单独展示）；组件页 API 表格为手写 markdown；`TmConfigProvider`（主题桥接 + locale）无文档页。改动主要落在 `apps/docs/.vitepress/theme/`，ConfigProvider demo 落在组件库。动机见 proposal.md，行为见 specs/docs/site。

## Goals / Non-Goals

**Goals:**
- DemoBlock 支持源码折叠/展开 + 复制，替代常驻 `<<<` 代码块
- 新建 `TmPropsTable` 用 TmTable 渲染 API 表格，统一视觉 + 排序
- 新增 ConfigProvider 文档页 + demo，纳入导航

**Non-Goals:**
- 不做 Playground（调参实时预览，远期）
- 不自动从 TS 类型生成 API 文档（远期，先数据驱动）
- 不改组件库组件实现（TmPropsTable 是 docs 层呈现组件，非 @tm/ui 组件）

## Decisions

### D1. DemoBlock 折叠用 `code` prop + `?raw` import + hljs 高亮

md 中 `import Demo from '.../demos/basic.vue?raw'` 取源码字符串，传 `<DemoBlock :code="demo">`。组件内默认收起源码区，切换按钮控制显示，复制用 `navigator.clipboard.writeText`。Vite 原生支持 `?raw`，SSR 下字符串 import 无副作用。

**语法高亮**：`<<<` 指令（VitePress shiki 构建期高亮）被替换后，折叠区不能复用运行时 shiki。用 docs 已依赖的 `highlight.js`（`language: 'xml'` 对 .vue 输出 template 标签 + script sub-language 高亮），computed 生成高亮 HTML 经 `v-html` 渲染（hljs 已转义，源码受控安全）。token 配色非 scoped 样式定义，跟随 VitePress `.dark` class 明暗切换。

- **备选**：自定义 markdown-it container（`:::demo`，构建期复用 shiki）→ 需写插件 + 兼容 SSR，成本高；hljs 运行时高亮成本低且够用。

### D2. TmPropsTable 复用 TmTable 渲染静态数据

docs 层新建 `TmPropsTable.vue`：接收 `data: Array<{ prop, desc, type, default, required? }>`，内部 `<TmTable :data :columns>` 渲染，列固定为 属性/说明/类型/默认值。组件页 md 的 `<script setup>` 声明数据数组传入。TmTable 已在 docs 全量注册（vxe + ant），静态数据无 SSR 压力，排序由 vxe 内置支持。

- **备选**：各 md 手写 `<TmTable>` → 重复列配置，封装为 TmPropsTable 复用更优。

### D3. ConfigProvider demo 落组件库 demos 目录

`packages/ui/src/config-provider/demos/basic.vue`，与其他组件（button/input/...）demo 目录一致。docs 通过相对源码路径 import（与现有 5 个组件页同一模式），保证文档与组件库 demo 同步。demo 演示 TmConfigProvider 包裹 + 主题色联动。

### D4. 折叠初始态与 SSR

DemoBlock 折叠状态初始为「收起」（默认值），SSR 首渲染与客户端一致，无 hydration 闪烁。复制按钮在 SSR 阶段不触发（仅 click 时调用），无 SSR 兼容风险。

## Risks / Trade-offs

- **`?raw` import 的模块体积**：源码字符串打进 bundle → 文档站体积微增，可接受；VitePress 有代码块 chunk 拆分。
- **TmPropsTable 排序**：vxe 排序对静态数据在客户端生效 → 与 ant 表格排序体验一致。
- **API 表格迁移量**：5 个组件页 markdown 表格需逐个迁移到数据驱动 → 数据集中在各 md script setup，改 props 时更易维护。

## Migration Plan

1. DemoBlock 加 `code` prop + 折叠/复制 UI
2. 新建 TmPropsTable + 组件页 API 表格迁移（button 起，逐步全部）
3. ConfigProvider demo + 文档页 + 导航
4. `pnpm --filter @tm/docs build` 验证 SSR 与搜索无回归

## Open Questions

无。
