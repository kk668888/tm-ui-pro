## Context

TmSelect 已内联「只读锁」：`readonly` 时 `open:false` + `allowClear:false` + `showSearch:false`，`disabled` 用 `??` 级联 FormContext。DatePicker / RangePicker / Cascader / TreeSelect 四个弹层控件需要同一套逻辑，达到「三次重复」抽象阈值。DatePicker 值类型分叉已定（用户确认）：**Dayjs 默认 + 可选 valueFormat 字符串桥接**。行为契约见 `specs/components/{date-picker,cascader,tree-select}/spec.md`。

## Goals / Non-Goals

**Goals:**
- 抽取 `useReadonlyLock` 公共 composable，回填 TmSelect（行为零变化）
- DatePicker / RangePicker / Cascader / TreeSelect 消费同一锁，弹层只读行为统一
- `valueFormat` 可选字符串桥接：Dayjs 默认零摩擦，传 `valueFormat` 即字符串

**Non-Goals:**
- 不改动 batch 1（Radio/Checkbox/Switch/InputNumber，无弹层不需要锁）
- 不做日期 `presets` / 快捷项公司默认（透传 ant）
- 不引入新日期库（沿用 ant 生态的 dayjs）
- 不把 Select 的 `api` / `remote` 数据源扩展到这些控件

## Decisions

### 1. useReadonlyLock 组合式 API

```
useReadonlyLock(
  props,                       // 组件 props（含 open/allowClear/showSearch/disabled/readonly）
  formContext,                 // useFormContext() 返回值（可能 undefined）
  options?: { searchable?: boolean }  // 是否含搜索输入框（Select/DatePicker 有，Cascader/TreeSelect 无）
)
→ { isReadonly, antProps }
```

`antProps` 返回锁调整后的字段，直接并入 forwardBindings：`disabled`（`??` 级联）、`open`（readonly→false）、`allowClear`（readonly→false）、`showSearch`（readonly→false，仅 searchable）、`readonly`（context 值透传）。`isReadonly` 供需要额外分支的组件使用。TmSelect 回填后删除内联只读块，单测（Select.spec.ts）保证回归为零。

**备选**：把「disabled 级联」拆成独立 `useFormFieldState`。否决——disabled/readonly 在 antProps 计算中天然交织，拆开反而多一次组合，保持单一 composable 职责。

### 2. valueFormat 字符串桥接

组件 props 扩展 `valueFormat?: string`：
- 未传：`modelValue` 为 Dayjs（单）/ `[Dayjs, Dayjs]`（区间），纯透传零转换。
- 已传：业务 `modelValue` 为 string（单）/ `[string, string]`（区间）；`inner` computed get 用 `dayjs(v, valueFormat)` 转 Dayjs 交给 ant，set 用 `dayjs(v).format(valueFormat)` 转回字符串 emit。
- RangePicker 对起止日期**成对**转换；任一端为空时返回空对，不抛错。

**备选**：强制字符串（Element Plus 风格）。否决——与库「ant 生态零摩擦」哲学冲突，且用户已选定「Dayjs + 可选 valueFormat」。

### 3. dayjs 直接依赖

TmDatePicker 源码将直接 `import dayjs`。ant-design-vue 仅把 dayjs 作为内部依赖，@tm/ui 不能隐式借用，须在 `packages/ui/package.json` **显式声明 `dayjs` 依赖**（版本对齐 ant 所用版本）。

### 4. modelValue 类型的联合妥协

`valueFormat` 有无改变 `modelValue` 运行时类型，TypeScript 无法条件收敛。采用联合类型：Ext props 声明 `modelValue?: Dayjs | string`，运行时契约由 `valueFormat` 决定（有→string，无→Dayjs），测试双模式覆盖。这是薄封装对类型严谨性的一处已知让步，在 props.ts 注释中明确。

### 5. readonly 锁是根因，native readonly 不够

ant DatePicker / Cascader / TreeSelect 的 `readonly` 仅影响输入框可编辑性，**面板仍会响应点击打开**。必须 `open:false` 受控锁死——这正是 useReadonlyLock 存在的根因，不能只透传 readonly attr。

## Risks / Trade-offs

- [dayjs 直接依赖] → package.json deps 显式声明，版本与 ant 对齐，不随版本漂移
- [valueFormat 联合类型宽松] → props.ts 注释明确运行时契约 + 单测覆盖有无 valueFormat 两种模式
- [Select 回填回归] → Select.spec.ts 全绿验证；回填为纯逻辑抽取，行为 diff 为零
- [RangePicker 半清空边界] → 转换函数对空端容错，返回空对，不抛错

## Migration Plan

- 单变更一次合入：useReadonlyLock + 四控件 + Select 回填同批
- Select 只读行为由既有单测保障，无灰度需求
- 发布语义：新增组件为 minor 增量，Select 回填为内部重构无外部可见变化
