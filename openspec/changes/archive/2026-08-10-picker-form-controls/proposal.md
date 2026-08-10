## Why

日期选择、级联、树选择是业务表单刚需，但 ant 这三个弹层控件都没有原生 `readonly`——已确认的坑是必须用「受控 `open:false` + 关搜索 / 关清除」锁死交互（TmSelect 已内联实现）。三个弹层控件共用同一套只读锁逻辑，抽成公共 composable 消除复制；同时用「Dayjs + 可选 valueFormat」解决业务日期字符串诉求，避免裸用 ant 时处处手动 format / parse。

## What Changes

- 新增 `useReadonlyLock` 公共 composable：从 TmSelect 内联只读逻辑提炼，回填 TmSelect 保持行为一致，供所有弹层类控件复用（open:false + 关搜索 + 关清除）
- 新增 `TmDatePicker` / `TmRangePicker`：ant DatePicker / RangePicker 薄封装；`modelValue` 默认 **Dayjs**（ant 原生零摩擦），可选 `valueFormat` 提供 string↔Dayjs 双向桥接（业务传 `valueFormat` 即拿字符串，零 Dayjs 依赖）
- 新增 `TmCascader`：ant Cascader 薄封装 + `useReadonlyLock` + `disabled` 级联 + options 透传
- 新增 `TmTreeSelect`：ant TreeSelect 薄封装 + `useReadonlyLock` + `disabled` 级联 + treeData 透传
- 全部遵循既有封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef`、`withDefaults` Boolean 兜底
- 注册与导出：`index.ts` + `resolver.ts` 同步；文档：每个组件新增 `apps/docs/components/*.md` + `demos/`，侧边栏并入「表单 / 数据展示」分组

## Capabilities

### New Capabilities

- `components/date-picker`: TmDatePicker / TmRangePicker（Dayjs 默认 + 可选 valueFormat 字符串桥接 + 只读锁 + FormContext 级联）
- `components/cascader`: TmCascader（级联选择 + 只读锁 + FormContext 级联）
- `components/tree-select`: TmTreeSelect（树选择 + 只读锁 + FormContext 级联）

### Modified Capabilities

- （无）

## Impact

- `packages/ui/src/components/{date-picker,cascader,tree-select}/`（新增组件目录）
- `packages/ui/src/composables/useReadonlyLock.ts`（新增公共 composable）
- `packages/ui/src/components/select/src/Select.vue`（只读逻辑回填 useReadonlyLock，行为不变）
- `packages/ui/src/index.ts`（install 注册 + 组件/类型 export）
- `packages/ui/src/resolver.ts`（按需导入组件名映射）
- `apps/docs/.vitepress/config.ts`（侧边栏）+ `apps/docs/components/{date-picker,cascader,tree-select}.md`
- `openspec/specs/components/*`（新增 3 个能力规格）
