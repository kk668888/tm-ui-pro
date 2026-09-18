# QuarterPicker 季度选择器

基于 [ant-design-vue](https://www.antdv.com/components/date-picker-cn) DatePicker.QuarterPicker 的薄封装。契约与 `TmMonthPicker` 完全一致（`valueFormat` 字符串桥接、公司默认值、`TmForm` 级联与只读锁），面板语义固定为「季度」，因此没有 `picker` prop。

## 何时使用

- 以「季度」为粒度的业务字段（考核周期、财报期、季度预算等）。
- 希望业务侧拿到的是 `'2026-Q3'` 这类「年 + 季度」字符串。
- 需要只读展示或禁用的季度字段。

## 基础用法

`value-format` 用 `YYYY-[Q]Q`——方括号是 Dayjs 的转义语法，表示 `Q` 是**字面量字符**而不是日期 token，因此输出为 `2026-Q3` 而不是 `2026-33`。`format` 只影响面板与输入框的展示文案。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import QuarterPickerDemo from '../../../packages/ui/src/components/quarter-picker/demos/basic.vue'
import QuarterPickerDemoCode from '../../../packages/ui/src/components/quarter-picker/demos/basic.vue?raw'

// TmPropsTable 数据：TmQuarterPicker Props 表格（数据驱动渲染）
const quarterPickerProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；**未配置** `valueFormat` 时为 Dayjs 对象，**配置后**为按该格式的字符串（清空为 `null`）',
    type: 'Dayjs | string | null',
    default: '-',
  },
  {
    prop: 'valueFormat',
    desc: '绑定值格式，推荐 `YYYY-[Q]Q`（输出如 `2026-Q3`）；配置后内部完成 string ↔ Dayjs 双向转换',
    type: 'string',
    default: '-（绑定 Dayjs 对象）',
  },
  {
    prop: 'format',
    desc: '面板与输入框的**展示**格式（如 `YYYY 年第 Q 季度`），不影响绑定值',
    type: 'string',
    default: "ant 原生 'YYYY-[Q]Q'",
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
    desc: '透传 ant QuarterPicker 原生能力（受控面板开合 / 占位文案 / 禁选日期函数）',
    type: 'DatePickerProps',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant QuarterPicker 全部 props / events（如 `status` / `@change` / `@openChange`）',
    type: 'DatePickerProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="QuarterPickerDemoCode">
  <QuarterPickerDemo />
</DemoBlock>

## API

### TmQuarterPicker Props

<TmPropsTable :data="quarterPickerProps" />

### TmQuarterPicker Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件；配置 `valueFormat` 时携带字符串，否则携带 Dayjs，清空为 `null` | `(value: Dayjs \| string \| null) => void` |
| 其余事件 | 透传 ant QuarterPicker 全部 events（如 `@change` / `@openChange` / `@panelChange`） | `-` |

### TmQuarterPicker Methods

业务侧通过 `ref` 可调用以下 ant QuarterPicker 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` 等。

### TmQuarterPicker Types

```ts
import type { TmQuarterPickerProps, TmQuarterPickerExtProps, DatePickerProps } from '@trustmo/tm-ui'
```

## `value-format` 写法提醒

| 写法 | 实际输出 | 说明 |
| --- | --- | --- |
| `YYYY-[Q]Q` | `2026-Q3` | **推荐**：`[Q]` 转义为字面量，末尾 `Q` 才是季度数字 |
| `YYYY-QQ` | `2026-33` | 错误：`QQ` 也被当作日期 token 解析 |

## `valueFormat` 与 dayjs 插件

`Q` token 的解析与输出由 dayjs 插件提供（`customParseFormat` 负责解析、`advancedFormat` 负责 `Q` 的格式化）。

**本库不需业务侧额外配置**：`TmQuarterPicker` 从 `ant-design-vue` 导入，而 ant-design-vue 在模块加载时已经 `dayjs.extend` 了这些插件（实测：仅 `require('ant-design-vue')` 后 `dayjs('2026-Q3','YYYY-[Q]Q').isValid() === true`、`dayjs('2026-07-01').format('YYYY-[Q]Q') === '2026-Q3'`；不加载 ant 时前者为 `false`、后者退化成字面量 `2026-QQ`）。因此 **`value-format="YYYY-[Q]Q"` 的字符串初值可正常回显，选值后写出的也是 `'2026-Q3'`**——`QuarterPicker.spec.ts` 用真实往返值断言锁定了这一点。

> **解析的宽严口径**：dayjs 按格式解析是**宽松**的——按 token 扫描，多余字符会被忽略。真正会失败的是**缺少必需 token** 的值：用 `YYYY-[Q]Q` 却只给 `'2026-Q'`（没有季度数字）时解析失败，该值按空值处理——控件显示空白，不抛错、也不出现 `Invalid Date` 文案。
>
> 实践建议：**初值照组件写出的格式写**（先选一次值、把回写的串当模板）。想让季度以其他形态展示，交给 `format` 而不是改 `valueFormat`。
>
> 另有一种环境不适用本保障：在不加载 `ant-design-vue` 的纯 node 脚本里复用本库逻辑做数据处理——那种场景需自行 `dayjs.extend(customParseFormat)` 等。

## 同类组件

- 月粒度见 [MonthPicker](/components/month-picker)，周粒度见 [WeekPicker](/components/week-picker)。
