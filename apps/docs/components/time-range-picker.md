# TimeRangePicker 时间范围选择器

基于 [ant-design-vue](https://www.antdv.com/components/time-picker-cn) TimePicker.RangePicker 的薄封装。与单值选择器不同，这里处理的是**区间值**：`v-model` 绑定 `[起, 止]`，`valueFormat` 对两侧成对转换，业务侧同样不接触 Dayjs。

## 何时使用

- 起止时间区间字段（排班时段、统计时间窗、营业时间等）。
- 需要「同一行内左右两个时间输入框 + 一个面板」的联动区间交互。
- 希望绑定值是 `['09:00', '18:00']` 这样的字符串数组，便于直接提交给后端。

## 基础用法

`value-format` 配置后两侧均为字符串；`format` 只影响展示。`readonly` 会锁死面板并对起止两个输入框同时生效，`disabled` 是整体置灰。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import TimeRangePickerDemo from '../../../packages/ui/src/components/time-range-picker/demos/basic.vue'
import TimeRangePickerDemoCode from '../../../packages/ui/src/components/time-range-picker/demos/basic.vue?raw'

// TmPropsTable 数据：TmTimeRangePicker Props 表格（数据驱动渲染）
const timeRangePickerProps = [
  {
    prop: 'modelValue',
    desc: '区间值 `[起, 止]`；**未配置** `valueFormat` 时为 `[Dayjs, Dayjs]`，**配置后**为 `[string, string]`（清空为 `null`）',
    type: '[Dayjs, Dayjs] | [string, string] | null',
    default: '-',
  },
  {
    prop: 'valueFormat',
    desc: '绑定值格式（如 `HH:mm` / `HH:mm:ss`）；配置后内部对起止两侧**成对**做 string ↔ Dayjs 转换',
    type: 'string',
    default: '-（绑定 Dayjs 数组）',
  },
  {
    prop: 'format',
    desc: '面板与输入框的**展示**格式（如 `HH:mm:ss`），不影响绑定值',
    type: 'string',
    default: "ant 原生 'HH:mm:ss'",
  },
  {
    prop: 'allowClear',
    desc: '一键清空（公司默认）；`readonly` 时被强制关闭',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'size',
    desc: '控件尺寸（公司默认 middle）',
    type: "'small' | 'middle' | 'large'",
    default: "'middle'",
  },
  {
    prop: 'readonly',
    desc: '只读语义：`open:false` 锁死面板 + 关闭清空；与 `TmForm` 的 readonly 为「或」关系',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'disabled',
    desc: '整体禁用（起止两个输入框同时不可交互）；未显式传时级联祖先 `TmForm` 的 `disabled`',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'minuteStep / hourStep / secondStep / order',
    desc: '透传 ant RangePicker 原生能力（时间步进；`order:false` 关闭起止自动排序）',
    type: 'RangePickerProps',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant TimePicker.RangePicker 全部 props / events（如 `placeholder` / `status` / `@change` / `@calendarChange`）',
    type: 'RangePickerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="TimeRangePickerDemoCode">
  <TimeRangePickerDemo />
</DemoBlock>

## API

### TmTimeRangePicker Props

<TmPropsTable :data="timeRangePickerProps" />

### TmTimeRangePicker Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；配置 `valueFormat` 时携带字符串数组，否则携带 Dayjs 数组，清空为 `null` | `([Dayjs, Dayjs] \| [string, string] \| null) => void` |
| 其余事件 | 透传 ant RangePicker 全部 events（如 `@change` / `@calendarChange` / `@openChange` / `@ok`） | `-` |

### TmTimeRangePicker Methods

业务侧通过 `ref` 可调用以下 ant RangePicker 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` 等。

### TmTimeRangePicker Types

```ts
import type { TmTimeRangePickerProps, TmTimeRangePickerExtProps, RangePickerProps } from '@trustmo/tm-ui'
```

## 取值与清空语义

| 场景 | 绑定值 |
| --- | --- |
| 两侧都没选 | `null` |
| 只选了起或止 | ant 在未确认前不下发完整区间（`@calendarChange` 可拿到中间态） |
| 两侧都选好 | 配置 `valueFormat` 时为 `[string, string]`，否则为 `[Dayjs, Dayjs]` |
| 点击清空 | `null`（`readonly` 时清空按钮被关闭） |

## `valueFormat` 与 dayjs 插件

`valueFormat` 的解析方向（`dayjs(str, format)` → Dayjs）由 dayjs 的 `customParseFormat` 插件提供。

**本库不需业务侧额外配置**：`TmTimeRangePicker` 从 `ant-design-vue` 导入，而 ant-design-vue 在模块加载时已经 `dayjs.extend` 了该插件（实测：仅 `require('ant-design-vue')` 后 `dayjs('09:00','HH:mm').isValid() === true`；不加载 ant 时同一表达式为 `false`）。因此 **`value-format="HH:mm"` 的字符串初值可以正常回显，选值后写出的也是 `'09:00'`**——`TimeRangePicker.spec.ts` 用真实解析值与回写值断言锁定了这一点。

> **解析的宽严口径**：dayjs 按格式解析是**宽松**的——按 token 扫描，位数不足或夹带多余字符通常都能容忍（实测 `'9:00'`、`'09:0'` 都能匹配 `HH:mm`）。真正会失败的是**缺少必需 token** 的值：
>
> | valueFormat | 合法初值（宽松写法亦可） | 会失败的写法 |
> | --- | --- | --- |
> | `HH:mm` | `'09:00'` / `'9:00'` | 完全不含「数字:数字」形态的串 |
> | `HH:mm:ss` | `'09:30:00'` | `'18:00'`、`'09:30'`（缺秒位） |
>
> 失败时该侧按空值处理、显示空白，**另一侧不受影响**，且不抛错、不出现 `Invalid Date` 文案。
>
> 实践建议：**初值照组件写出的格式写**（先选一次值、把回写的串当模板）。
>
> 另有一种环境不适用本保障：在不加载 `ant-design-vue` 的纯 node 脚本里复用本库逻辑做数据处理——那种场景需自行 `dayjs.extend(customParseFormat)`。

## 相关组件

- 单值时间选择：`TmTimePicker`；日期区间：`TmRangePicker`。
