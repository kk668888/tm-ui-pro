# InputNumber 数字输入框

基于 [ant-design-vue](https://www.antdv.com/components/input-number-cn) InputNumber 的薄封装。保留全部 ant 原生 props / slots / events，仅新增 `modelValue` 一个扩展键：业务侧用标准 `v-model` 绑定数值；同时自动接入 `TmForm` 的 `readonly` / `disabled` 级联（InputNumber 有原生 `readonly`，直接透传）。

## 何时使用

- 需要输入数字并受 `min` / `max` / `precision` 约束的字段。
- 需要步进调节、或带 `formatter` / `parser` 格式化的数值输入。

## 基础用法

标准 `v-model` 受控用法，`min` / `max` / `precision` 原生透传。

<script setup>
import InputNumberDemo from '../../../packages/ui/src/components/input-number/demos/basic.vue'
import InputNumberDemoCode from '../../../packages/ui/src/components/input-number/demos/basic.vue?raw'

const inputNumberProps = [
  {
    prop: 'modelValue',
    desc: '业务侧 `v-model` 绑定值；内部 computed 桥接到 ant InputNumber 的 `value`（清空时置为 `null`）',
    type: 'number | null',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant InputNumber 全部 props / slots / events（如 `min` / `max` / `precision` / `step` / `formatter` / `parser` / `readonly` / `disabled`）',
    type: 'InputNumberProps',
    default: '-',
  },
  {
    prop: '公司默认',
    desc: '`size: "middle"`、`bordered: true`、`controls: true`、`keyboard: true`（Boolean 陷阱显式兜底，业务可覆盖）',
    type: '-',
    default: '见 desc',
  },
]
</script>

<DemoBlock :code="InputNumberDemoCode">
  <InputNumberDemo />
</DemoBlock>

## API

### TmInputNumber Props

<TmPropsTable :data="inputNumberProps" />

### TmInputNumber Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: number \| null) => void` |
| 其余事件 | 透传 ant InputNumber 全部 events（如 `@change` / `@input` / `@pressEnter`） | `-` |

### TmInputNumber Methods

业务侧通过 `ref` 可调用内部 ant InputNumber 实例方法（经 `useForwardRef` 透传），如 `focus()` / `blur()`。

### TmInputNumber Types

- `TmInputNumberProps = InputNumberProps & { modelValue?: InputNumberProps['value'] }`
- `InputNumberProps`（ant 原生）可直接从 `@kibus/tm-ui-plus` 导入。
