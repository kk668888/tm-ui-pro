## Why

@tm/ui 已覆盖基础控件、弹层控件、数据展示与全局反馈，但通用与布局层仍裸用 ant，业务写页面布局时无法复用公司统一的间距 / 栅格 / 排版规范。此批补齐通用与布局组件，是「100% 覆盖」路线图的第一批，让 resolver fail-fast 不再有盲区。

## What Changes

- 新增 6 个 ant 薄封装组件：`TmSpace`、`TmDivider`、`TmTypography`、`TmFlex`、`TmGrid`、`TmLayout`
- `TmSpace`：薄封装 ant Space，公司默认间距规范（`size` 默认值 + `vertical` 对齐兜底）
- `TmDivider`：薄封装 ant Divider，公司视觉默认（`type` / `orientation` 默认兜底）
- `TmTypography`：薄封装 ant Typography（Title / Paragraph / Text / Link 四子组件），统一排版层级与行高
- `TmFlex`：薄封装 ant Flex，`gap` 默认与 TmSpace 间距规范对齐
- `TmGrid`：薄封装 ant Row / Col 栅格体系，导出 `TmRow` / `TmCol`
- `TmLayout`：薄封装 ant Layout 体系，导出 `TmLayout` / `TmSider` / `TmHeader` / `TmContent` / `TmFooter`
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 陷阱兜底
- 注册导出：`index.ts` 追加 install + export，resolver 泛化覆盖（`grid`、`layout` 多子组件一并注册）；文档页 + demos + 侧边栏

## Capabilities

### New Capabilities

- `components/space`: TmSpace 间距（公司默认间距规范 + ant 原生透传）
- `components/divider`: TmDivider 分割线（公司视觉默认 + ant 原生透传）
- `components/typography`: TmTypography 排版（Title / Paragraph / Text / Link，统一排版层级）
- `components/flex`: TmFlex 弹性布局（ant 原生透传 + 间距对齐 TmSpace）
- `components/grid`: TmGrid 栅格（TmRow / TmCol，ant 原生透传）
- `components/layout`: TmLayout 布局（TmLayout / TmSider / TmHeader / TmContent / TmFooter）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{space,divider,typography,flex,grid,layout}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（泛化覆盖，无需改动，build 验证）
- `apps/docs/.vitepress/config.ts`（侧边栏「通用与布局」分组）
- `apps/docs/components/{space,divider,typography,flex,grid,layout}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 6 个能力规格）
