# Segmented 分段控制器

基于 [ant-design-vue](https://www.antdv.com/components/segmented-cn) Segmented 的薄封装。保留 ant 全部能力，无公司默认。

## 何时使用

- 提供一组互斥选项，快速切换视图 / 筛选条件。
- 比 Radio.Group 更紧凑、比 Tabs 更轻量的分段选择。

## 基础用法

<script setup>
import SegmentedDemo from '../../../packages/ui/src/components/segmented/demos/basic.vue'
import SegmentedDemoCode from '../../../packages/ui/src/components/segmented/demos/basic.vue?raw'

const props = [
  { prop: 'options', desc: '选项：字符串数组或 { label, value, disabled } 对象数组', type: 'Array<string | number | { label, value, disabled }>', default: '-' },
  { prop: 'value', desc: '受控值（v-model:value）', type: 'string | number', default: '-' },
  { prop: 'block / disabled / size', desc: '占满整行 / 禁用 / 尺寸（ant 原生）', type: 'boolean | string', default: '-' },
  { prop: 'onChange', desc: '切换回调', type: '(value) => void', default: '-' },
]
</script>

<DemoBlock :code="SegmentedDemoCode">
  <SegmentedDemo />
</DemoBlock>

## API

### TmSegmented Props

<TmPropsTable :data="props" />

### Events

| 事件 | 说明 |
| --- | --- |
| `change` | 切换选项时触发（透传 ant，参数为选中值） |

### Methods

业务侧通过 `ref` 可访问内部 ant Segmented 实例（经 `useForwardRef` 透传）。
