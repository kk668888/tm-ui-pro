# InputSearch 搜索输入框

基于 [ant-design-vue](https://www.antdv.com/components/input-cn) Input.Search 的薄封装。与 `TmInput` 共用同一套 v-model 契约、公司默认值（`allowClear` / `size` / `bordered`）与 `TmForm` 禁用/只读级联，并在原生输入框上多出一个「搜索」触发动作。

## 何时使用

- 搜索框、过滤输入等需要「输入完再触发一次动作」的场景。
- 需要自定义触发控件形态（`enterButton`：图标后缀 / 按钮 / 自定义文案或插槽）。
- 希望搜索框与 `TmInput` 视觉、默认行为一致，两个控件可零成本互换。

## 基础用法

`v-model` 绑定输入值；不传 `enterButton` 时是图标后缀形态，传 `true` 得到按钮，传字符串得到自定义按钮文案。`@search` 在**回车**或**点击搜索按钮**时触发，回调参数为当前输入值。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import InputSearchDemo from '../../../packages/ui/src/components/input-search/demos/basic.vue'
import InputSearchDemoCode from '../../../packages/ui/src/components/input-search/demos/basic.vue?raw'

// TmPropsTable 数据：TmInputSearch Props 表格（数据驱动渲染）
const inputSearchProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；内部 computed 桥接到 ant InputSearch 的 `value`；清空时 emit 空字符串 `\'\'`（不 emit `undefined`）',
    type: 'string | number',
    default: '-',
  },
  {
    prop: 'enterButton',
    desc: '触发控件形态：不传为图标后缀；`true` 为「搜索」按钮；字符串为自定义按钮文案；也可用同名插槽自定义按钮内容',
    type: "boolean | string | slot",
    default: '-',
  },
  {
    prop: 'allowClear',
    desc: '一键清空按钮（公司默认，与 TmInput 同源）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'size',
    desc: '控件尺寸（公司默认 middle，与 TmInput 同源）',
    type: "'small' | 'middle' | 'large'",
    default: "'middle'",
  },
  {
    prop: 'bordered',
    desc: '是否有边框（公司默认，与 TmInput 同源）',
    type: 'boolean',
    default: 'true',
  },
  {
    prop: 'disabled / readonly',
    desc: '未显式传时级联祖先 `TmForm` 的同名状态（显式传值优先级更高）',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Input.Search 全部 props / events（如 `placeholder` / `maxlength` / `status` / `@change` / `@pressEnter`）',
    type: 'InputProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="InputSearchDemoCode">
  <InputSearchDemo />
</DemoBlock>

## API

### TmInputSearch Props

<TmPropsTable :data="inputSearchProps" />

### TmInputSearch Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value`；清空归一化为空字符串 | `(value: string \| number) => void` |
| `search` | 回车或点击搜索按钮时触发（透传 ant） | `(value, event, info) => void` |
| 其余事件 | 透传 ant Input.Search 全部 events（如 `@change` / `@focus` / `@blur` / `@pressEnter`） | `-` |

> `@search` 属于「通知事件」而非值通道，因此原样透传，业务直接绑定即可。

### TmInputSearch Slots

| 插槽 | 说明 |
| --- | --- |
| `enterButton` | 自定义搜索按钮内容（ant 原生） |
| 其余插槽 | 透传 ant Input.Search 原生插槽 |

### TmInputSearch Methods

业务侧通过 `ref` 可调用以下 ant Input.Search 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` / `select()` 及 `input`（原生 DOM input 元素引用）等。

### TmInputSearch Types

```ts
import type { TmInputSearchProps, TmInputSearchExtProps, InputProps } from '@trustmo/tm-ui'
```

## 与 TmInput 的差异

| 维度 | TmInput | TmInputSearch |
| --- | --- | --- |
| 底层 ant 组件 | Input | Input.Search |
| 公司默认值 | `allowClear` / `size` / `bordered` | 同源（一致） |
| 独有能力 | `addonBefore` / `addonAfter`、`showCount` | `enterButton`、`@search` |
