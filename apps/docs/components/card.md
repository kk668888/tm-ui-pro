# Card 卡片

基于 [ant-design-vue](https://www.antdv.com/components/card-cn) Card 的薄封装。保留 ant 全部能力，公司默认 `bordered: true` / `size: 'default'` 统一业务卡片骨架。

## 何时使用

- 业务详情页、概览页的卡片布局骨架。
- 需要 title / extra / actions / cover 结构化内容区。

## 基础用法

<script setup>
import CardDemo from '../../../packages/ui/src/components/card/demos/basic.vue'
import CardDemoCode from '../../../packages/ui/src/components/card/demos/basic.vue?raw'

const props = [
  { prop: 'bordered', desc: '是否显示边框：公司默认 `true`，业务可覆盖', type: 'boolean', default: 'true' },
  { prop: 'size', desc: '卡片尺寸：公司默认 `default`，业务可覆盖', type: "'default' | 'small' | 'large'", default: "'default'" },
  { prop: 'title / extra / cover / actions', desc: '卡片结构 prop 与插槽（ant 原生）', type: 'CardProps', default: '-' },
  { prop: '其余属性', desc: '透传 ant Card 全部 props / events / slots', type: 'CardProps', default: '-' },
]
</script>

<DemoBlock :code="CardDemoCode">
  <CardDemo />
</DemoBlock>

## API

### TmCard Props

<TmPropsTable :data="props" />

### 插槽

业务可通过 `#title` / `#extra` / `#cover` / `#actions` / default 自定义卡片结构（透传 ant）。

### Methods

业务侧通过 `ref` 可访问内部 ant Card 实例（经 `useForwardRef` 透传）。
