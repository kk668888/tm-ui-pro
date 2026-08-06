# Input 输入框

基于 [ant-design-vue](https://www.antdv.com/components/input) Input 的薄封装。保留全部 ant 原生 props / slots / events，仅新增 `modelValue` 一个扩展键，让业务侧能用标准 `v-model`（而非 ant 原生的 `v-model:value`），与 Vue 3 官方约定一致。

## 何时使用

- 表单字段、搜索框、过滤器等需要双向绑定文本值的场景。
- 希望团队代码统一使用 `v-model`（不带 `:value` 修饰符），降低 ant 与原生 Vue 表单约定的认知负担。

## 基础用法

标准 `v-model` 受控用法，输入实时回显。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import InputDemo from '../../../packages/ui/src/components/input/demos/basic.vue'
</script>

<DemoBlock>
  <InputDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/input/demos/basic.vue

## API

### TmInput Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue | 业务侧 `v-model` 绑定值；内部 computed 桥接到 ant Input 的 `value` | `string \| number` | `-` |
| 其余属性 | 透传 ant Input 全部 props / slots / events（如 `placeholder` / `size` / `allowClear` / `disabled` / `maxlength`） | `InputProps` | `-` |

### TmInput Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: string \| number) => void` |
| 其余事件 | 透传 ant Input 全部 events（如 `@change` / `@pressEnter` / `@focus`） | `-` |

### TmInput Methods

业务侧通过 `ref` 可调用以下 ant Input 实例方法（经 `useForwardRef` 透传）：

- `focus()` / `blur()` / `select()` / `setSelectionRange()` 等方法，以及 `input` 属性（原生 DOM input 元素引用）等。

### TmInput Types

```ts
import type { TmInputProps, TmInputExtProps, InputProps } from '@tm/ui'
```

## 扩展机制

- **v-model 桥接**：内部 `computed({ get: () => props.modelValue, set: (v) => emit('update:modelValue', v) })` 写入 ant Input 的 `:value` 与 `@update:value`，业务侧零感知。
- **方法透传**：`useForwardRef` 把内部 ant Input 实例的 `focus` / `blur` 等方法逐个 `defineExpose`，业务侧 `tmInputRef.value?.focus()` 等价 `inputRef.value?.focus()`。
- **透传**：未消费的 `$attrs` 全量透传给内部 ant Input。
