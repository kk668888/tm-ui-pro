# add-input-password — Design

## Context

- `@trustmo/tm-ui` 是 ant-design-vue 4.2.6 的薄封装库，`TmInput`（`packages/ui/src/components/input/`）是输入类薄封装的范本，已确立六项机制：v-model 桥接、扩展属性剥离、`$attrs` 透传、slots 透传、ref 方法透传、公司默认值 + FormContext 级联。
- ant-design-vue 原生 `Input.Password` 存在且以命名导出 `InputPassword` 暴露（已核实 `es/input/index.d.ts`：`export { Password as InputPassword }`），库内从未封装。
- 关键 API 事实（均在 ant-design-vue 4.2.6 源码中核实，spec 据此编写；**两条在实现期被单测修正**）：
  - **类型**：`es/input/index.d.ts` 只导出 `InputProps` / `TextAreaProps`，**没有 `PasswordProps`** —— props 类型需自行声明。
  - **iconRender**：`Password.js` 中 `iconRender(visible.value)` —— 插槽/函数只收到 `visible` **裸 boolean**，不提供 onChange；点击切换行为由 ant 经 `cloneElement` 注入到图标元素（默认 `action: 'click'`）。**实现期修正**：裸 boolean 无法经模板 `v-bind` 转发（`renderSlot` 读 `props.key` 崩溃），且转发插槽的 Fragment 返回值会让 ant 跳过自身 span 包装导致 onClick 不落 DOM——见 D6。
  - **expose**：Password 只 `expose({ focus, blur })`，**无 `select`**。
  - **suffix 不可用（实现期单测证实，比预估更严格）**：`renderPassword` 中 `omit(restProps, ['suffix', ...])` 后**恒**设置 `suffix: suffixIcon`（眼睛图标或 `false`），而内层 Input 的解构 `suffix = props.suffix ?? slots.suffix?.()` —— `??` 对 `false` 不触发默认值，故 **`suffix` 插槽在任何可见性配置下都不渲染**；`prefix` / `addon` 插槽不受影响。

## Goals / Non-Goals

**Goals:**

- `TmInputPassword` 与 `TmInput` 在封装机制、类型体验、默认值、FormContext 级联上完全一致，业务方零学习成本迁移（`<TmInput>` → `<TmInputPassword>`）。
- TmResolver / 全量注册两条消费路径都能解析：主出口导出后，resolver 的 fail-fast 误报自然消失，无需改 resolver 代码。

**Non-Goals:**

- 不做密码强度计、确认密码联动、内置校验规则（校验归 TmFormItem rules / validation 体系）。
- 不伪造 ant 未暴露的能力（如 `select()`）；不在本组件内吞掉 ant 原生行为（suffix 互斥）做二次封装。

## Decisions

### D1：纯薄封装，复制 TmInput 范本六机制（而非抽公共基类）

`InputPassword.vue` 按 `Input.vue` 逐机制对应实现：`inheritAttrs: false` + `useForwardBindings` 透传、`useForwardRef` 方法透传、`slotNames` v-for 插槽转发、computed get/set 桥接 `v-model` ↔ `v-model:value`。
**为什么不抽基类**：两组件的差异点（剥离开关值、默认值键、ant 实例）多于共同点，抽 `useAntInputBridge` 之类抽象会把「范本可读性」换成「跳转阅读成本」，违背库内「薄封装范本优先」的既有取向（参考 unify-forward-bindings 变更的收敛方向）。三行相似胜过过早抽象。

### D2：props 类型自声明（ant 无 PasswordProps 可复用）

```ts
// props.ts
interface TmInputPasswordExtProps {
  modelValue?: string | number
  visibilityToggle?: boolean
  visible?: boolean
}
type TmInputPasswordProps = InputProps & TmInputPasswordExtProps
export type { InputProps } from 'ant-design-vue'
```
`iconRender` / `action` / `onUpdate:visible` 不进接口：它们经 `$attrs` 透传即可工作，接口里重复声明只会增加维护面；`visibilityToggle` 必须声明（要参与默认值兜底，见 D3）。备选方案「用 `ExtractPropTypes<typeof AInputPassword>` 推断」被否：推断出的是复杂运行时类型，IDE 提示与 ant 文档脱节。

### D3：默认值兜底沿用「幻影 false 教训」清单

`withDefaults` 显式兜底：`allowClear` / `size` / `bordered`（复用 `input/src/defaults.ts` 的 `tmInputDefaults`，同一公司规范不复制值）、`visibilityToggle: true`（ant 语义默认 true，但 Boolean prop 未传时 Vue 推断为 false，会把 ant 默认关掉——与 `bordered` 2026-08-06 修复同根因）；`readonly` / `disabled` 显式置 `undefined` 落空到 FormContext 级联（TmInput v2 模式）。`visible` 同理置 `undefined`：未传时 ant 走内部非受控状态，传了即受控显隐，透传原样转发。

### D4：值通道剥离开关比 TmInput 多「无」，透传范围一致

剥离 `modelValue` / `value` / `defaultValue` / `onUpdate:value` 四个值通道键（与 TmInput 相同）；`visible` / `onUpdate:visible` 不剥离——TmInputPassword 不代理该状态，业务显式传参经 `forwardBindings` 原样到达 ant。`onChange` / `onInput` 沿 TmInput 结论保留透传（通知事件非写入通道）。

### D5：iconRender 插槽转发适配（实现期确立）

`iconRender` 有三层坑，均由单测驱动修复：
1. **裸 boolean 不能过 `v-bind`**：ant 以 `iconRender(visible.value)` 调用插槽，模板 `<slot v-bind>` 编译为 `renderSlot($slots, name, props)`，props 必须是对象——直接转发裸 boolean 在 `renderSlot` 读 `props.key` 处崩溃。→ 包装为 `{ visible }` 对象转发，业务 `#iconRender="{ visible }"`（对业务比 ant 原生裸 boolean 更解构友好）。
2. **同名槽冲突**：`#iconRender` 静态模板与动态 v-for 模板在编译产物中生成两个同名槽（`createSlots`），动态项的 v-if 空注释分支覆盖静态转发分支，自定义图标静默丢失。→ v-for 列表**过滤掉** iconRender（`forwardSlotNames`），只保留静态项。
3. **Fragment 载体丢点击**：转发插槽返回 Fragment，ant 的 `isValidElement` 判真后跳过自身的 span 包装，`cloneElement` 注入的 onClick 落在 Fragment 上不落 DOM，点击切换静默失效。→ 转发内容外包一层真实 `<span class="tm-input-password-icon-trigger">` 作稳定点击载体。

## Risks / Trade-offs

- [suffix 插槽完全不可用（ant 原生限制，任何配置下不渲染）] → spec 已如实记录；文档站示例不展示 suffix 组合，并在 API 表标注该限制，避免业务误判为库缺陷。
- [iconRender 裸 boolean 与模板转发的三层冲突] → 已由 D5 的适配方案解决（对象包装 + v-for 过滤 + span 载体），三条均有单测锁定回归。
- [全量注册场景 `<tm-input-password>` 历史上有 kebab 解析需求] → 主出口导出后 `TmInputPassword` 全局注册，Vue 的 camelize+capitalize 查找自动命中 `<tm-input-password>`，无需额外注册逻辑。
- [复制范本导致两文件未来漂移] → 接受。漂移风险低于过早抽象；若后续第三个 input 变体出现再评估收敛（届时是三处重复，符合「规则-of-three」再抽象的门槛）。

## Migration Plan

纯新增，无迁移。回滚 = revert 导出登记与新目录，无消费方受影响。

## Open Questions

（无——API 契约均已对照 ant-design-vue 4.2.6 源码核实）
