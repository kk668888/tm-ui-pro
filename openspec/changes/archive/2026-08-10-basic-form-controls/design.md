## Context

现有 Button / Input / Select 已确立薄封装范式：扩展键剥离、`$attrs` 合并、slots 全透传、`useForwardRef` 方法透传、`withDefaults` Boolean 兜底、FormContext `??` 级联。本变更把这套骨架批量复用到 4 个最常用的基础表单控件。约束要点见 `proposal.md`，行为契约见 `specs/components/{radio-group,checkbox-group,switch,input-number}/spec.md`。

## Goals / Non-Goals

**Goals:**
- 4 个新组件与既有组件**同构**的封装骨架（同一套文件布局与机制）
- `disabled` 级联统一走 `??`；`readonly` 语义在 4 个控件上收敛一致
- 公司视觉默认（`size` / `bordered` / `allowClear`）落地，业务可覆盖

**Non-Goals:**
- 不做弹层只读锁（属 `picker-form-controls` 变更）
- 不做 `api` / `remote` 数据源扩展——Radio/CheckboxGroup 的 `options` 是 ant 原生 prop，直接透传即可
- 不做独立 `TmRadio` / `TmCheckbox` 单控件（业务场景多用 Group，缺时直接裸用 ant）

## Decisions

### 1. options 直接透传 ant 原生 prop

ant `Radio.Group` / `Checkbox.Group` 本就支持 `options` 数组渲染，无需公司扩展键。TmRadioGroup / TmCheckboxGroup 把 `options` 当作透传 prop 原样下发，**不新增**映射层。规格中的「options 数组驱动」由 ant 原生能力满足。

### 2. readonly → disabled 映射（无原生 readonly 的控件）

ant `Radio` / `Checkbox` / `Switch` 无原生 `readonly`。统一策略：`readonly` 为真时映射为 `disabled`，保持「只读展示、不可修改」语义，且与 Select 的「只读不可交互」体验一致。`TmInputNumber` 例外：其内部是原生 `<input>`，`readonly` 走原生只读透传（经 `$attrs` 落到 input 元素）；若 jsdom / ant 层实测不生效，降级为 disabled 映射（单测兜底）。

### 3. 不抽公共 SFC 模板

4 个组件脚本差异（值类型、剥离键、桥接事件）大于共性，且 SFC 模板不同。抽公共包装组件会引入跨组件参数化的复杂度，反而偏离「薄封装」哲学。决策：**复制骨架、独立实现**，仅共享 `useForwardRef` + `useFormContext` + defaults 惯例。每新增一个控件成本即为复制一份模板，与库的既有演进方式一致。

### 4. 值桥接语义按 ant 契约对齐

- `TmSwitch`：ant Switch 受控键是 `checked`（`v-model:checked`），桥接 `modelValue ↔ checked`；`checkedValue` / `unCheckedValue` 非布尔值时 modelValue 类型跟随 ant。
- `TmRadioGroup` / `TmCheckboxGroup` / `TmInputNumber`：ant 受控键是 `value`（`v-model:value`），桥接 `modelValue ↔ value`。
- 各组件 `inner` computed 的类型参数各自显式声明，沿用 Input / Select 的注释约定。

## Risks / Trade-offs

- [ant InputNumber 原生 readonly 是否生效不确定] → 单测验证；不生效则降级为 disabled 映射，行为仍符合规格
- [Boolean prop 默认值陷阱（ant 默认 true 的项）] → `withDefaults` 显式兜底（`bordered` / `allowClear` 等），沿用既有约定
- [Switch 自定义开合值导致 modelValue 类型扩散] → 类型跟随 `SwitchProps['checkedValue']`，不做额外约束，保证 ant 能力无损
