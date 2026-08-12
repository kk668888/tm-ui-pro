# Radio 单选框

基于 [ant-design-vue](https://www.antdv.com/components/radio-cn) Radio 的薄封装。**单选框**，`checked` 值语义与既有 `TmRadioGroup` 对齐；组场景用 `TmRadioGroup`。

## 何时使用

- 单个互斥选项（受控选中）。
- 组内单选用 `TmRadioGroup`（见既有文档）。

## 基础用法

单选框（受控选中）+ 禁用。

<script setup>
import RadioDemo from '../../../packages/ui/src/components/radio/demos/basic.vue'
import RadioDemoCode from '../../../packages/ui/src/components/radio/demos/basic.vue?raw'

const props = [
  { prop: 'checked', desc: '选中态', type: 'boolean', default: 'false' },
  { prop: 'value / disabled', desc: '值 / 禁用（ant 原生）', type: 'RadioProps', default: '-' },
]
</script>

<DemoBlock :code="RadioDemoCode">
  <RadioDemo />
</DemoBlock>

## API

### TmRadio Props

<TmPropsTable :data="props" />

### TmRadio Events

| 事件 | 说明 |
| --- | --- |
| `change` | 选中状态变化时触发（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Radio 实例（经 `useForwardRef` 透传）。
