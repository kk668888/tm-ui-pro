# WeekPicker 周选择器

基于 [ant-design-vue](https://www.antdv.com/components/date-picker-cn) DatePicker.WeekPicker 的薄封装。契约与 `TmMonthPicker` 完全一致（`valueFormat` 字符串桥接、公司默认值、`TmForm` 级联与只读锁），面板语义固定为「周」，因此没有 `picker` prop。

## 何时使用

- 以「周」为粒度的业务字段（排期、周报周期、巡检周期等）。
- 希望业务侧拿到的是 `'2026-36'` 这类「年 + 周序号」字符串。
- 需要只读展示或禁用的周字段。

## 基础用法

`value-format` 用 `YYYY-ww`（`ww` 为两位周序号，输出如 `2026-36`）；`format` 决定面板与输入框的**展示**文案，不影响绑定值。`readonly` 锁死面板（不可打开、禁止清空）。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import WeekPickerDemo from '../../../packages/ui/src/components/week-picker/demos/basic.vue'
import WeekPickerDemoCode from '../../../packages/ui/src/components/week-picker/demos/basic.vue?raw'

// TmPropsTable 数据：TmWeekPicker Props 表格（数据驱动渲染）
const weekPickerProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；**未配置** `valueFormat` 时为 Dayjs 对象，**配置后**为按该格式的字符串（清空为 `null`）',
    type: 'Dayjs | string | null',
    default: '-',
  },
  {
    prop: 'valueFormat',
    desc: '绑定值格式，推荐 `YYYY-ww`（年 + 两位周序号，输出如 `2026-36`）；配置后内部完成 string ↔ Dayjs 双向转换',
    type: 'string',
    default: '-（绑定 Dayjs 对象）',
  },
  {
    prop: 'format',
    desc: '面板与输入框的**展示**格式（如 `YYYY 第 wo 周`），不影响绑定值',
    type: 'string',
    default: "ant 原生 'YYYY-wo'",
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
    desc: '只读语义：`open:false` 锁死面板 + 关闭清空；与 `TmForm` 的 readonly 为「或」关系',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'disabled',
    desc: '整体禁用；未显式传时级联祖先 `TmForm` 的 `disabled`',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'open / placeholder / disabledDate',
    desc: '透传 ant WeekPicker 原生能力（受控面板开合 / 占位文案 / 禁选日期函数）',
    type: 'DatePickerProps',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant WeekPicker 全部 props / events（如 `status` / `@change` / `@openChange`）',
    type: 'DatePickerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="WeekPickerDemoCode">
  <WeekPickerDemo />
</DemoBlock>

## API

### TmWeekPicker Props

<TmPropsTable :data="weekPickerProps" />

### TmWeekPicker Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；配置 `valueFormat` 时携带字符串，否则携带 Dayjs，清空为 `null` | `(value: Dayjs \| string \| null) => void` |
| 其余事件 | 透传 ant WeekPicker 全部 events（如 `@change` / `@openChange` / `@panelChange`） | `-` |

### TmWeekPicker Methods

业务侧通过 `ref` 可调用以下 ant WeekPicker 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` 等。

### TmWeekPicker Types

```ts
import type { TmWeekPickerProps, TmWeekPickerExtProps, DatePickerProps } from '@trustmo/tm-ui'
```

## 周序号的取值口径

`ww` 遵循 Dayjs 的 week-of-year 规则（受 `weekStart` 与 locale 影响）。若业务的「周」定义与 Dayjs 默认不同（例如必须按 ISO 周），应在应用入口用 `dayjs.extend(isoWeek)` 并统一 locale，组件侧无需额外配置——`valueFormat` 只把 Dayjs 的格式化结果原样交给业务。

| 写法 | 输出 | 说明 |
| --- | --- | --- |
| `YYYY-ww` | `2026-36` | **推荐**：两位周序号，纯数字、便于入库与比较 |
| `YYYY-w` | `2026-36` | 同上，但不补零（第 3 周为 `2026-3`） |
| `YYYY-wo` | `2026-36th` | 带序数后缀（advancedFormat 的 ordinal 语义），一般不是业务想要的形态 |

## `valueFormat` 与 dayjs 插件

`valueFormat` 的双向桥接用到 dayjs 的「按格式解析 / 按格式输出」，其中 `ww`、`Q` 等 token 由插件提供（`customParseFormat` / `advancedFormat` / `weekOfYear`）。

**本库不需业务侧额外配置**：`TmWeekPicker` 从 `ant-design-vue` 导入，而 ant-design-vue 在模块加载时已经 `dayjs.extend` 了这些插件（实测：仅 `require('ant-design-vue')` 后 `dayjs('2026-09-01').format('YYYY-ww')` 即得 `2026-36`；不加载 ant 时同一表达式返回字面量 `2026-ww`）。因此 **`valueFormat="YYYY-ww"` 的字符串初值可以正常回显，选值后写出的也是 `'2026-36'`**——`WeekPicker.spec.ts` 用真实往返值断言锁定了这一点。

> **解析的宽严口径**：dayjs 按格式解析是**宽松**的——按 token 扫描，多余字符会被忽略（实测 `'2026年36周'`、`'2026/36'` 都能解析成第 36 周，都等价于 `'2026-36'`）。真正会失败的是**缺少必需 token** 的值：用 `YYYY-ww` 却只给 `'第二周'`（没有年份）时解析失败，该值按空值处理——控件显示空白，不抛错、也不出现 `Invalid Date` 文案。
>
> 实践建议：**初值照组件写出的格式写**（先选一次值、把回写的串当模板），不要手拼半成品。想让「周」以其他形态展示，交给 `format` 而不是改 `valueFormat`。
>
> 另有一种环境不适用本保障：在不加载 `ant-design-vue` 的纯 node 脚本里直接复用本库的格式化逻辑做数据处理——那种场景需自行 `dayjs.extend(customParseFormat)` 等。

## 同类组件

- 月粒度见 [MonthPicker](/components/month-picker)，季度粒度见 [QuarterPicker](/components/quarter-picker)。
