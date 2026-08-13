## Context

apps/demo 的 tm-components 页（`apps/demo/src/pages/tm-components/`）现有 5 个 section（General/Form/DataDisplay/Feedback/Config），仅覆盖 32 个组件。@tm/ui 100% 覆盖后共 67 个导出组件，**40 个缺口组件无演示**；核心组件（Table/Form/Tour）缺交互示例。demo 已有 `src/mock/handlers`（含 auth 等接口）、`core/http` 请求层，可复用做远程数据源。

## Goals / Non-Goals

**Goals:**
- 按 5 类 section 补全 40 个缺口组件的基础用法演示，使页面覆盖全部 ~67 个组件。
- 核心组件（Table/Form/Tour/Select/DatePicker/Progress）带真实交互示例。
- 各 section 配套单元测试，防回归。

**Non-Goals:**
- 不改路由 / 菜单（复用现有 `tm-components.routes.ts` 与 `menu.config.ts`）。
- 不改 `@tm/ui` 组件实现（100% 覆盖已达成，demo 只消费）。
- 不引入新的演示框架（沿用 `a-card` + section 结构）。

## Decisions

**D1 结构沿用：每 section 一个 `.section.vue` + `.spec.ts`**
- 新增演示块直接追加到对应 section 文件，保持 `views/Components.view.vue` 组装不变。
- 每个组件演示块：`a-card`（标题 = 组件名）+ 简短说明 + 实际 Tm 组件渲染。
- 缺口组件按 ant 官方分类归位：General 14（Affix/Anchor/Breadcrumb/Divider/Dropdown/Flex/Layout/Menu/PageHeader/Pagination/Row/Space/Steps/Tabs）、Form 8（AutoComplete/Checkbox/Mentions/Radio/Rate/Slider/Transfer/Tree）、DataDisplay 14（Avatar/Calendar/Card/Carousel/Collapse/Comment/Descriptions/Image/List/QRCode/Segmented/Statistic/Timeline/Tooltip）、Feedback 3（Progress/Skeleton/Tour）。`TmResolver` 为工具非组件，跳过。

**D2 交互示例用 mock 数据源**
- Table 远程分页/搜索：新增 mock handler（`src/mock/handlers/table.ts`），复用 `core/http` 请求 `/mock/table` 拉取分页数据；密度切换走 `density` 扩展键（TmTable 已支持）。
- Select 远程搜索 / api 模式：用 TmSelect 的 `remote` + `api` 扩展能力（组件库已实现）。
- 数据源复用现有 mock 注册机制（`mock/handlers` 聚合），不引入真实后端。

**D3 Form 交互示例**
- 校验：`rules` 必填/格式校验；联动：一个字段值影响另一字段 `disabled`/`readonly`（TmForm 的 FormContext 级联能力）。
- 提交：`@finish` 处理，成功 `TmMessage.success` 反馈（FormContext 的 submitting 状态）。

**D4 Tour 交互示例**
- 步骤锚定页面内元素（如 Table 搜索区 / 特定卡片），`v-model:open` 自闭合（组件已桥接关闭），「重新引导」按钮重放。

**D5 测试策略**
- 每 section 新增块的 `*.spec.ts` 断言：演示块可挂载、关键 props 生效（如 Progress status 映射、Table 渲染行、Form 校验触发错误）。
- 交互类（Table 翻页/搜索、Tour 步骤）用 jsdom 可测路径断言（组件事件 + 状态变化），复杂浏览器交互（锚定定位）以挂载稳定性为主。

## Risks / Trade-offs

- **section 文件膨胀**：补全 40 组件后单个 section 可达 200-400 行 → 缓解：按组件分组用 `<a-space>`/子组件组织；必要时抽独立演示子组件（`demos/`），section 只做聚合。
- **mock 数据源维护**：新增 table mock handler 与现有 handler 聚合 → 缓解：遵循现有 mock 注册模式（`mock/handlers/index`）。
- **交互示例不稳定**：Tour 依赖真实 DOM 锚点，jsdom 不完整 → 缓解：单测聚焦挂载稳定性 + v-model 闭合，真实交互留浏览器查看。

## Migration Plan

1. 清点缺口清单（40 组件分类归位），确认 demo mock/请求层可复用。
2. 按 section 分批补全基础陈列：General → DataDisplay → Form → Feedback → Config。
3. 关键交互示例：Table（mock 分页/搜索/密度）、Form（校验/联动/提交）、Tour（可重放）。
4. 补 section 测试断言（挂载 + 关键 props + 交互状态）。
5. 运行 demo 测试 + 类型检查 + build，确认页面渲染无回归。
6. 归档本 change。
