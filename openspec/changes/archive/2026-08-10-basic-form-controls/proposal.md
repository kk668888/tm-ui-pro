## Why

@tm/ui 目前仅 5 个薄封装组件，业务表单里最常用的单选 / 复选 / 开关 / 数字输入仍在裸用 ant，既丢失公司默认视觉，也无法消费 `TmForm` 的 `readonly` / `disabled` 级联通道。路径 A 第一步：以最低成本批量补齐这批零设计风险的基础表单控件，整体复用 Button / Input / Select 已确立的薄封装模式，为后续弹层类控件铺路。

## What Changes

- 新增 4 个 ant 薄封装组件：`TmRadioGroup`、`TmCheckboxGroup`、`TmSwitch`、`TmInputNumber`
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 兜底
- 接入 FormContext：`disabled` 用 `??` 级联（业务显式传优先，未传落空到 context）；`readonly` 语义为「只读展示不可改」，ant 无原生 readonly 的控件（Radio/Checkbox/Switch）映射为 disabled，`TmInputNumber` 若 ant 支持原生 readonly 则透传
- 公司默认值：沿用现有组件的 `size` / `bordered` / `allowClear` 视觉默认，`TmInputNumber` 提供 `min` / `max` / `precision` / `step` 兜底（业务可覆盖）
- 注册与导出：`index.ts` 追加 `app.use` + 组件/类型导出，`resolver.ts` 同步按需导入映射
- 文档：每个组件新增 `apps/docs/components/*.md` + `demos/`，侧边栏并入「基础组件 / 表单」分组

## Capabilities

### New Capabilities

- `components/radio-group`: TmRadioGroup 单选组（options 数组驱动 + FormContext 级联）
- `components/checkbox-group`: TmCheckboxGroup 复选组（options 数组驱动 + FormContext 级联）
- `components/switch`: TmSwitch 开关（boolean 值桥接 + FormContext 级联）
- `components/input-number`: TmInputNumber 数字输入（number 值桥接 + 边界默认 + FormContext 级联）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{radio-group,checkbox-group,switch,input-number}/`（新增组件目录）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（unplugin 按需导入组件名映射）
- `apps/docs/.vitepress/config.ts`（侧边栏新增条目）
- `apps/docs/components/{radio-group,checkbox-group,switch,input-number}.md`（文档页 + demos）
- `openspec/specs/components/*`（新增 4 个能力规格）
