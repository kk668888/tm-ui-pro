## Context

TmForm / TmFormItem 当前是 ant Form 的纯薄封装（`forwardBindings` 单一 v-bind 透传 + `useForwardRef` 方法透传），`useFormContext.ts` 预留了一个空接口的 provide/inject 通道（`FormContext` 为空占位，FormItem 里 `void useFormContext()` 吃掉返回值）。动机见 proposal.md。本 change 把这条预留通道升级为真实联动管道，并叠加变更追踪。

## Goals / Non-Goals

**Goals:**
- FormContext 承载 `submitting` / `readonly` / `disabled`，TmFormItem slot props + TmInput/TmSelect 直接 inject 消费
- 变更追踪：`onMounted` 自动快照 + `isDirty` / `getDirtyFields` / `resetToInitial` / `markInitial` 四方法
- 保留薄封装原则：3 个扩展键均为可选，未传完全退回当前行为

**Non-Goals:**
- 不做内置 submitBar（提交触发点可能在弹窗/抽屉 footer，不在表单内——业务自行消费 `submitting`）
- 不做多列栅格布局 / 响应式（独立后续评估）
- 不改 ant Form 内部联动（本通道与 ant 自身 provide/inject 互不干扰）

## Decisions

### D1. FormContext 用 ComputedRef 下发

`provideForm` 接收 `ComputedRef<FormContext>`，TmForm 用 `computed(() => ({ submitting, readonly, disabled }))` 提供，consuming 侧 `inject(FORM_KEY, undefined)` 后读 `.value`。响应式追踪 props 最新值。

- **备选**：provide 普通 reactive 对象 → 需手动同步，不如 computed 声明式。

### D2. Boolean prop 默认值坑：withDefaults 设 undefined 区分「未传」

ant 的 `disabled`/`readonly` 是 Boolean prop，类型化 `defineProps` 会把它们生成默认 `false` 的运行时 prop。`props.readonly` 未传时是 `false` 而非 `undefined`，导致级联合并 `false ?? contextValue` 永远不落空、context 失效。

**修复**：`withDefaults` 显式置 `readonly: undefined, disabled: undefined`，使「未传」→ `undefined`，`undefined ?? context` 正确落空到上下文。已用临时测试验证 Vue 的 Boolean 默认覆盖行为（显式传 false 仍为 false、传 true 仍为 true）。

### D3. disabled 双通道：透传 ant 原生 + 级联

ant Form 原生就有 `disabled` prop（整表禁用，经 `DisabledContext` provide 到 AInput/ASelect）。TmForm 的 `disabled` 扩展键必须**透传给 AForm**（保留原生整表禁用），同时经 FormContext 级联到 TmInput/TmSelect 做兜底。

- **注意**：若剥离 disabled 不透传，ant 原生链路断裂（之前实现踩过此坑）。

### D4. readonly 对 TmSelect：受控 open 锁死下拉

ant Select 运行时**完全没有 readonly 概念**（源码无 readonly 处理），仅透传 attr 无效。利用 BaseSelect 的 `open` 受控语义（`innerOpen = props.open !== undefined ? props.open : val`）：readonly 时给 ASelect 传 `open: false`，内部 open 恒等于 false，用户点击无法打开下拉；同时 `allowClear: false` 禁止清空值。

- **备选**：CSS `pointer-events: none` → 失去 hover 视觉且文字不可选中，弃用。
- **备选**：`disabled` 模拟 readonly → 灰底，视觉与只读语义不符，弃用。

### D5. 变更追踪：onMounted 快照 + markInitial 手动

`onMounted` 时 `JSON.parse(JSON.stringify(model))` 深拷贝作为初始快照。`isDirty`/`getDirtyFields` 做浅比较（对象级 `!==`），适用于绝大多数扁平表单字段。`resetToInitial` 用 `Object.assign(model, initial)` 回填 + 删多余 key + `clearValidate`。`markInitial` 重新快照当前 model（编辑场景异步加载完数据后调用）。

- **边界**：model 含 File/Date 等不可序列化值时深拷贝降级为空对象，业务应调 `markInitial`。

### D6. 变更追踪方法经 Proxy 合并暴露

`useForwardRef` 返回的 `exposed` 是 Proxy（get 转发到内部 AForm 实例）。变更追踪四方法是组件自身方法，不在 AForm 上。用外层 Proxy 包装：get 先查 `customMethods`（isDirty 等），未命中再 `Reflect.get` 转发到 `exposed`。保持 `has` 拦截器同步，保证 `defineExpose` 生效。

### D7. TmFormExtProps 抽到 props.ts

Form 首次引入扩展键，若在 Form.vue 内定义私有 `interface TmFormExtProps`，vite:dts 生成声明时无法命名该类型（TS4023/TS4082）。按 Button/Input/Select 惯例抽到 `form/src/props.ts` 导出 `TmFormExtProps` / `TmFormProps`。

## Risks / Trade-offs

- **Boolean 默认值语义变更**：TmInput/TmSelect 的 `readonly`/`disabled` 未传时从 `false` 变 `undefined` → 对 AInput/ASelect 透传 `undefined` 无操作，不影响渲染；唯一可观察差异是 `props()` 读值为 undefined，属预期。
- **Select 只读锁定的键盘可达性**：受控 `open:false` 下键盘也无法打开 → 与只读语义一致（不可操作）。→ 业务需要可操作时显式传 `readonly: false` 覆盖。
- **变更追踪的浅比较**：嵌套对象字段变化可能被漏判 → 文档标注业务可调 `markInitial` 自行管理快照。
- **readonly 透传 attr 冗余**：Select 仍透传 readonly attr（未来 ant 支持时自动生效），当前无效果但无害。

## Migration Plan

1. FormContext 升级（useFormContext.ts）+ TmForm 扩展键与变更追踪（Form.vue）+ props.ts
2. TmFormItem slot props 暴露 + TmInput/TmSelect 级联
3. 新增 3 个 demo + docs 更新
4. 全量测试（Form 13 + Select 3 新增用例）+ vue-tsc + build

## Open Questions

无（设计已定，无延迟可答的未知项）。
