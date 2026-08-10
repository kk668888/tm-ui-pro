# DatePicker / RangePicker 日期选择

基于 [ant-design-vue](https://www.antdv.com/components/date-picker-cn) DatePicker / RangePicker 的薄封装。保留全部 ant 原生 props / slots / events，新增 `modelValue` / `valueFormat` / `readonly` 扩展键，并自动接入 `TmForm` 的 `readonly` / `disabled` 级联与**只读锁**（readonly 时弹层不可打开）。

## 何时使用

- 需要选择日期或日期区间（含时间）。
- 希望业务层**零 Dayjs 依赖**：传 `valueFormat` 后 `v-model` 直接绑定格式化字符串，组件内部自动转换。

## 基础用法

Dayjs 直通与 `valueFormat` 字符串两种模式并存。

<script setup>
import DatePickerDemo from '../../../packages/ui/src/components/date-picker/demos/basic.vue'
import DatePickerDemoCode from '../../../packages/ui/src/components/date-picker/demos/basic.vue?raw'

const datePickerProps = [
  {
    prop: 'modelValue',
    desc: '业务 `v-model` 绑定值。默认 Dayjs（单）/ `[Dayjs,Dayjs]`（区间）；配置 valueFormat 后为 string（单）/ `[string,string]`（区间）',
    type: 'Dayjs | string | null',
    default: '-',
  },
  {
    prop: 'valueFormat',
    desc: '可选值格式（如 `YYYY-MM-DD`）。配置后业务拿字符串，组件内部 string↔Dayjs 双向转换；未配置则 Dayjs 直通',
    type: 'string',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读语义：为真时弹层面板不可打开、不可修改，当前值仍可见；未传时级联 TmForm readonly',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant DatePicker / RangePicker 全部 props / slots / events（如 `showTime` / `disabledDate` / `presets` / `format` / `disabled`）',
    type: 'DatePickerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="DatePickerDemoCode">
  <DatePickerDemo />
</DemoBlock>

## API

### TmDatePicker / TmRangePicker Props

<TmPropsTable :data="datePickerProps" />

### Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；valueFormat 配置时为字符串，否则为 Dayjs | `(value: Dayjs \| string \| null) => void` |
| 其余事件 | 透传 ant DatePicker / RangePicker 全部 events（如 `@change` / `@openChange`） | `-` |

### Methods

业务侧通过 `ref` 可调用内部 ant DatePicker / RangePicker 实例方法（经 `useForwardRef` 透传），如 `focus()` / `blur()`。

### Types

- `TmDatePickerProps = DatePickerProps & { modelValue?: Dayjs | string | null; valueFormat?: string; readonly?: boolean }`
- `TmRangePickerProps = RangePickerProps & { modelValue?: [Dayjs,Dayjs] | [string,string] | null; valueFormat?: string; readonly?: boolean }`
- `DatePickerProps` / `RangePickerProps`（ant 原生）可直接从 `@tm/ui` 导入。
