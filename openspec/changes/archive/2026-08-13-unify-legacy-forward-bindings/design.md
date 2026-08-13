## Context

`useForwardBindings` 已成薄封装透传统一契约（见 forward-bindings 主 spec），但仅 Upload/Popover/Popconfirm 三个组件接入。**23 个早期薄封装组件仍用 `computed(() => ({...$attrs, ...props}))` 全量透传**：类型化 `defineProps<TmProps>()` 把业务未传的可选 Boolean 归一化为 `false`（幻影 false），随全量透传覆盖 ant 内部默认，此前靠各自 `withDefaults(..., {xxx: undefined/true})` 手工补丁规避。模式不统一、逐组件易漏、维护成本高，且 44 个新组件已用新契约，双模式并存。

## Goals / Non-Goals

**Goals:**
- 23 个遗留组件全部迁移到 `useForwardBindings(props, companyDefaults, excludedKeys)`，删除 `{...$attrs, ...props}` 全量透传。
- 行为零回归：缺省值继续由 ant 兜底，`withDefaults` 语义不变。
- 保持 `defineProps` 类型化声明方式（不改为运行时 props 对象）。

**Non-Goals:**
- 不改变各组件 props 声明与 `withDefaults` 兜底值（只改透传实现）。
- 不改 Form/Table 已有的自定义 `forwardBindings` 内部逻辑，仅统一透传来源。
- 不新增组件能力，纯重构。

## Decisions

**D1 迁移模式统一：`useForwardBindings(props, companyDefaults, excludedKeys)`**
- `companyDefaults`：逐组件把 `withDefaults` 兜底键 + 中间变换合成键（如 Button 的 confirm/debounce、Popconfirm 的 okButtonProps）列入，否则被当幻影值跳过（D4）。
- `excludedKeys`：模板显式绑定的监听器（如 `@update:file-list`）剔除，避免与 `$attrs` 合并成数组监听器导致内部 `.call()` 崩溃。
- 简单透传组件传 reactive `props` 直接迁移；中间变换组件（Button/Form/Table/Select 等）传 computed 中间源（如现有 `antProps`）并补 `companyDefaults`。

**D2 保留 withDefaults，仅改透传实现**
- `withDefaults(defineProps<TmProps>(), {...})` 声明方式不动（保持类型安全与公司默认语义），迁移只替换 `forwardBindings` 的构造方式。`withDefaults` 兜底键原样列入 `companyDefaults`，转发值不变。
- 备选：迁移时顺手重构 props 声明 → 扩大改动面、引入类型风险，否决。

**D3 分批迁移，每组件补回归断言**
- 按复杂度分批：先简单透传组件（16 个），后中间变换组件（7 个：button/checkbox-group/radio-group/form/form-item/select/table）。
- 每个受影响组件补一条「未传受影响可选 Boolean 时内部不收到幻影 false」断言，防迁移回归。

**D4 风险：withDefaults 兜底键漏列**
- 迁移时逐一核对组件 `withDefaults` 的所有键与 `??` 级联合成键，产出 `companyDefaults` 清单（见 tasks），漏列会导致公司默认失效。
- 缓解：全量测试覆盖公司默认行为；迁移后跑 3 组件 + 全量测试。

## Risks / Trade-offs

- **行为回归面**：23 个组件迁移后缺省透传路径变化 → 缓解：只改透传来源、保留 withDefaults 值；补回归断言；跑全量 536+ 测试。
- **中间变换组件错传源**：computed 源需 `.value` 适配（isRef 已处理）→ 缓解：对照现有 `antProps`/中间 computed 结构迁移。
- **excludedKeys 漏列监听器**：模板显式绑定事件会与 attrs 合并成数组 → 缓解：grep 各组件模板 `@` 绑定，全部列入。

## Migration Plan

1. ✅ 清点 23 个组件，产出 `companyDefaults`/`excludedKeys` 清单。
2. ✅ 批次 A（16 简单透传）：alert/badge/cascader/date-picker/range-picker/drawer/empty/input/input-number/modal/result/spin/switch/tag/time-picker/tree-select —— 全部迁移，`useForwardBindings` 透传，`useAttrs`/`$attrs` 清除（grep 确认无残留）。
3. ✅ 批次 B（7 中间变换）：button/checkbox-group/radio-group/form/form-item/select/table —— 全部迁移，computed 源 + 合成键列入 `companyDefaults`。
4. ✅ 补回归断言（tag bordered 新增；spin/empty/modal/drawer/switch/select 既有断言验证公司默认与幻影 false）+ 全量测试 **537 通过** + build ✓（零回归）。
5. 归档本 change。
5. 归档本 change。
