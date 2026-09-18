# MonthPicker 月份选择器

基于 [ant-design-vue](https://www.antdv.com/components/date-picker-cn) DatePicker.MonthPicker 的薄封装。与 `TmDatePicker` 同契约：`valueFormat` 字符串桥接、公司默认值（`allowClear` / `size`）、`TmForm` 禁用级联与只读锁一应俱全，面板语义固定为「月」，因此没有 `picker` prop。

## 何时使用

- 只精确到月的业务字段（账期、生效月、盘点月等）。
- 希望业务侧拿到的直接是 `'2026-09'` 这类字符串，而不是 Dayjs 对象。
- 需要只读展示（`readonly`）或禁用（`disabled`）的月份字段。

## 基础用法

配置 `value-format` 后，`v-model` 两侧都是字符串；`format` 只影响**面板与输入框的展示**，不影响绑定值。`readonly` 会锁死面板（不可打开、禁止清空），而 `disabled` 是整体置灰。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import MonthPickerDemo from '../../../packages/ui/src/components/month-picker/demos/basic.vue'
import MonthPickerDemoCode from '../../../packages/ui/src/components/month-picker/demos/basic.vue?raw'

// TmPropsTable 数据：TmMonthPicker Props 表格（数据驱动渲染）
const monthPickerProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；**未配置** `valueFormat` 时为 Dayjs 对象，**配置后**为按该格式的字符串（清空为 `null`）',
    type: 'Dayjs | string | null',
    default: '-',
  },
  {
    prop: 'valueFormat',
    desc: '绑定值格式（如 `YYYY-MM`）；配置后内部完成 string ↔ Dayjs 双向转换，业务侧完全不接触 Dayjs',
    type: 'string',
    default: '-（绑定 Dayjs 对象）',
  },
  {
    prop: 'format',
    desc: '面板与输入框的**展示**格式（如 `YYYY 年 MM 月`），不影响绑定值',
    type: 'string',
    default: "ant 原生 'YYYY-MM'",
  },
  {
    prop: 'allowClear',
    desc: '一键清空（公司默认，与 TmDatePicker 同源）；`readonly` 时被强制关闭',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'size',
    desc: '控件尺寸（公司默认 middle，与 TmDatePicker 同源）',
    type: "'small' | 'middle' | 'large'",
    default: "'middle'",
  },
  {
    prop: 'readonly',
    desc: '只读语义：`open:false` 锁死面板 + 关闭清空；与 `TmForm` 的 readonly 为「或」关系（任一为真即只读，显式传 false 不能解除表单级只读）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'disabled',
    desc: '整体禁用；未显式传时级联祖先 `TmForm` 的 `disabled`（显式传值优先级更高）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'open / placeholder / disabledDate',
    desc: '透传 ant MonthPicker 原生能力（受控面板开合 / 占位文案 / 禁选日期函数）',
    type: 'DatePickerProps',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant MonthPicker 全部 props / events（如 `status` / `@change` / `@openChange`）',
    type: 'DatePickerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="MonthPickerDemoCode">
  <MonthPickerDemo />
</DemoBlock>

## API

### TmMonthPicker Props

<TmPropsTable :data="monthPickerProps" />

### TmMonthPicker Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；配置 `valueFormat` 时携带字符串，否则携带 Dayjs，清空为 `null` | `(value: Dayjs \| string \| null) => void` |
| 其余事件 | 透传 ant MonthPicker 全部 events（如 `@change` / `@openChange` / `@panelChange`） | `-` |

### TmMonthPicker Methods

业务侧通过 `ref` 可调用以下 ant MonthPicker 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` 等。

### TmMonthPicker Types

```ts
import type { TmMonthPickerProps, TmMonthPickerExtProps, DatePickerProps } from '@trustmo/tm-ui'
```

## 批次内同类组件

| 组件 | 面板语义 | 推荐 `value-format` |
| --- | --- | --- |
| `TmDatePicker` | 日 | `YYYY-MM-DD` |
| `TmMonthPicker` | 月 | `YYYY-MM` |
| [TmWeekPicker](/components/week-picker) | 周 | `YYYY-wo` |
| [TmQuarterPicker](/components/quarter-picker) | 季度 | `YYYY-[Q]Q` |
| `TmRangePicker` | 日区间 | `YYYY-MM-DD` |
