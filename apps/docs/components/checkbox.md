# Checkbox 复选框

基于 [ant-design-vue](https://www.antdv.com/components/checkbox-cn) Checkbox 的薄封装。**单复选框**，`checked` 值语义与既有 `TmCheckboxGroup` 对齐；组场景用 `TmCheckboxGroup`。

## 何时使用

- 单个选项勾选（协议、开关）。
- 组内多项选择用 `TmCheckboxGroup`（见既有文档）。

## 基础用法

单复选框 + 半选态 + 禁用。

<script setup>
import CheckboxDemo from '../../../packages/ui/src/components/checkbox/demos/basic.vue'
import CheckboxDemoCode from '../../../packages/ui/src/components/checkbox/demos/basic.vue?raw'

const props = [
  { prop: 'checked', desc: '勾选态（v-model:checked）', type: 'boolean', default: 'false' },
  { prop: 'value / indeterminate / disabled', desc: '值 / 半选 / 禁用（ant 原生）', type: 'CheckboxProps', default: '-' },
]
</script>

<DemoBlock :code="CheckboxDemoCode">
  <CheckboxDemo />
</DemoBlock>

## API

### TmCheckbox Props

<TmPropsTable :data="props" />

### TmCheckbox Events

| 事件 | 说明 |
| --- | --- |
| `change` | 勾选状态变化时触发（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Checkbox 实例（经 `useForwardRef` 透传）。
