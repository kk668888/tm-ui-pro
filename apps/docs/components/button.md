# Button 按钮

基于 [ant-design-vue](https://www.antdv.com/components/button) Button 的薄封装，在保留全部 ant 原生 props / slots / events 的基础上，新增 `debounce`（点击防抖）与 `confirm`（点击前二次确认）两个公司级扩展，覆盖表单提交、删除等高频业务场景。

## 何时使用

- 同一按钮可能在短时间内被多次点击（如「提交」「保存」），需要防抖避免重复请求。
- 危险操作（删除、清空）需要二次确认，但不想每次都手写 `Modal.confirm`。

## 基础用法

包含三种典型用法：默认按钮、点击防抖、二次确认。点击「删除」会弹出二次确认气泡。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import ButtonDemo from '../../../packages/ui/src/components/button/demos/basic.vue'
</script>

<DemoBlock>
  <ButtonDemo />
</DemoBlock>

<<< ../../../packages/ui/src/components/button/demos/basic.vue

## API

### TmButton Props

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| debounce | 点击防抖间隔（ms），`>0` 启用；未设置或 `0` 表示零开销透传 | `number` | `0` |
| confirm | 点击前二次确认文案，传入则用 `Popconfirm` 包裹内部按钮 | `string` | `-` |
| 其余属性 | 透传 ant Button 全部 props / slots / events（如 `type` / `danger` / `loading` / `disabled` / `@click`） | `ButtonProps` | `-` |

### TmButton Types

```ts
import type { TmButtonProps, TmButtonExtProps } from '@tm/ui'
```

## 扩展机制

- **debounce**：内部用 timer 守卫包裹 `click` handler，间隔内的重复点击被丢弃，避免业务侧手写防抖。
- **confirm**：内部用 ant `Popconfirm` 包裹 `<AButton>`，将「点击 → 弹确认框 → 确认后触发业务 click」三步收口到组件内，业务侧只需提供文案。
- **透传**：未消费的 `$attrs` 全量透传给内部 ant Button，所有 ant 原生能力（icon、loading、ghost、href 等）零损耗。
