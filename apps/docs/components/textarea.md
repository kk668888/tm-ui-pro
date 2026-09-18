# Textarea 多行文本域

基于 [ant-design-vue](https://www.antdv.com/components/input-cn) Input.TextArea 的薄封装。保留全部 ant 原生 props / slots / events，与 `TmInput` 共用同一套公司默认值（`allowClear` / `bordered`）与 `TmForm` 禁用/只读级联；仅新增 `modelValue`，让业务侧用标准 `v-model`（而非 ant 原生的 `v-model:value`）。

## 何时使用

- 多行内容输入（简介、备注、日志、地址等）。
- 希望与 `TmInput` 行为完全一致（公司默认值、TmForm 级联），两个控件可零成本互换。
- 需要自适应高度（`autosize`）或字数统计（`showCount` + `maxlength`）。

## 基础用法

标准 `v-model` 受控用法；`autosize` 让高度随内容在 2～6 行间伸缩，`showCount` 在右下角实时显示已输入/上限字数。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import TextareaDemo from '../../../packages/ui/src/components/textarea/demos/basic.vue'
import TextareaDemoCode from '../../../packages/ui/src/components/textarea/demos/basic.vue?raw'

// TmPropsTable 数据：TmTextarea Props 表格（数据驱动渲染）
const textareaProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；内部 computed 桥接到 ant TextArea 的 `value`；清空时 emit 空字符串 `\'\'`（不 emit `undefined`）',
    type: 'string',
    default: "''",
  },
  {
    prop: 'allowClear',
    desc: '一键清空按钮（公司默认，与 TmInput 同源）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'bordered',
    desc: '是否有边框（公司默认；显式传 `:bordered="false"` 得到无边框样式）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'autosize',
    desc: '自适应高度：`true` 或 `{ minRows, maxRows }`',
    type: 'boolean | { minRows?: number; maxRows?: number }',
    default: '-',
  },
  {
    prop: 'showCount / maxlength',
    desc: '字数统计与输入上限（ant 原生能力，二者常配合使用）',
    type: 'boolean / number',
    default: '-',
  },
  {
    prop: 'disabled / readonly',
    desc: '未显式传时级联祖先 `TmForm` 的同名状态（显式传值优先级更高）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant TextArea 全部 props / slots / events（如 `rows` / `placeholder` / `status` / `@change` / `@pressEnter`）',
    type: 'TextAreaProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="TextareaDemoCode">
  <TextareaDemo />
</DemoBlock>

## API

### TmTextarea Props

<TmPropsTable :data="textareaProps" />

### TmTextarea Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: string) => void` |
| 其余事件 | 透传 ant TextArea 全部 events（如 `@change` / `@focus` / `@blur` / `@pressEnter`） | `-` |

### TmTextarea Methods

业务侧通过 `ref` 可调用以下 ant TextArea 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` / `resizableTextarea`（ant 内部的自适应文本域实例）等。

### TmTextarea Types

```ts
import type { TmTextareaProps, TmTextareaExtProps, TextAreaProps } from '@trustmo/tm-ui'
```

## 与 TmInput 的差异

| 维度 | TmInput | TmTextarea |
| --- | --- | --- |
| 底层 ant 组件 | Input | Input.TextArea |
| `modelValue` 清空语义 | emit 空字符串 | emit 空字符串（一致） |
| 公司默认值 | `allowClear` / `size` / `bordered` | `allowClear` / `bordered`（ant TextArea 无尺寸概念，故无 `size` 默认） |
| 独有能力 | `addonBefore` / `addonAfter` | `autosize` / `showCount` |
