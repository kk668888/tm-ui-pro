# Descriptions 描述列表

基于 [ant-design-vue](https://www.antdv.com/components/descriptions-cn) Descriptions 的薄封装。保留 ant 全部能力（含 `TmDescriptionsItem` 子组件），无公司默认。

## 何时使用

- 详情页展示信息（只读字段列表）。
- 需要按列排布、跨行/跨列（span / filled）。

## 基础用法

<script setup>
import DescriptionsDemo from '../../../packages/ui/src/components/descriptions/demos/basic.vue'
import DescriptionsDemoCode from '../../../packages/ui/src/components/descriptions/demos/basic.vue?raw'

const props = [
  { prop: 'column', desc: '每行列数（数字或响应式对象）', type: 'number | Partial<Record<Breakpoint, number>>', default: '3' },
  { prop: 'layout', desc: '布局：horizontal / vertical', type: "'horizontal' | 'vertical'", default: "'horizontal'" },
  { prop: 'bordered', desc: '是否显示边框', type: 'boolean', default: 'false' },
  { prop: 'title / extra', desc: '描述列表标题 / 右上角内容', type: 'VueNode', default: '-' },
  { prop: 'TmDescriptionsItem', desc: '子组件：`label` / `span` / `labelStyle` / `contentStyle`', type: 'DescriptionsItemProps', default: '-' },
]
</script>

<DemoBlock :code="DescriptionsDemoCode">
  <DescriptionsDemo />
</DemoBlock>

> 注：TmDescriptions 使用 render function 转发 default slot，ant 能正确读取 `TmDescriptionsItem` 的 label / span 等 props 按行排版。

## API

### TmDescriptions Props

<TmPropsTable :data="props" />

### TmDescriptionsItem Props

| 属性 | 说明 | 类型 |
| --- | --- | --- |
| `label` | 条目标题 | `string \| number \| VNode` |
| `span` | 跨列数，`'filled'` 占满整行 | `number \| 'filled'` |
| `labelStyle` / `contentStyle` | label / 内容内联样式 | `CSSProperties` |

### Methods

业务侧通过 `ref` 可访问内部 ant Descriptions 实例（经 `useForwardRef` 透传）。
