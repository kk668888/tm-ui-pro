## Why

@tm/ui 已达成 100% 组件覆盖（67 个导出组件），但 apps/demo 的 tm-components 页仅陈列 32 个组件，40 个批次新增组件（Affix/Anchor/Avatar/Breadcrumb/Card/Descriptions/List/Progress/Skeleton/Tour 等）在 demo 中无演示；且核心组件（Table/Form/Tour）缺真实交互示例，页面自称「集中陈列全部组件」与现状不符，难以作为业务选型与回归演示的入口。

## What Changes

- 将 tm-components 页按 5 类 section（通用 / 表单 / 数据展示 / 反馈 / 全局配置）**补全全部 ~67 个组件陈列**：缺失的 40 个组件各补基础用法演示（关键 props + 最小可用形态）。
- **关键组件带交互示例**：
  - `Table`：远程分页 / 搜索 / 密度切换（复用 mock 数据源）
  - `Form`：校验 / 字段联动 / 提交反馈
  - `Tour`：步骤引导可重放
  - `Select`（远程搜索）、`DatePicker`（valueFormat）、`Progress`（status 映射）等新批次能力示例
- 遵循现有 section 结构（`*.section.vue` + 对应 `*.spec.ts` + `views/Components.view.vue` 组装），不新增路由。

## Capabilities

### New Capabilities

- `demo/tm-components`: apps/demo 的 TM 组件集中陈列页，覆盖 @tm/ui 全部组件，核心组件带交互示例

### Modified Capabilities

- （无）

## Impact

- `apps/demo/src/pages/tm-components/features/components/`：5 个 section 文件扩充（General/Form/DataDisplay/Feedback/Config），补 40 个缺失组件 + 增强交互示例
- 对应 `*.section.spec.ts`：新增/扩充断言覆盖新演示块
- 无路由 / 菜单变更（复用现有 `tm-components.routes.ts`）
- 依赖：`@tm/ui` 已全量导出（100% 覆盖达成），demo 直接 import 即可，无需改 @tm/ui
