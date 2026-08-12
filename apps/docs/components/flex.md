# Flex 弹性布局

基于 [ant-design-vue](https://www.antdv.com/components/flex-cn) Flex 的薄封装。保留全部 ant 原生 props / slots / events，公司默认 `gap=middle`（与 TmSpace 间距规范对齐）。

## 何时使用

- 需要弹性布局且与公司间距规范保持一致的场景。
- 简单的一维布局（横向 / 纵向）替代手工 flex 样式。

## 基础用法

公司默认 `gap=middle` + `vertical` / `justify` 覆盖。

<script setup>
import FlexDemo from '../../../packages/ui/src/components/flex/demos/basic.vue'
import FlexDemoCode from '../../../packages/ui/src/components/flex/demos/basic.vue?raw'

const flexProps = [
  {
    prop: 'gap',
    desc: '间距：公司默认 `middle`（与 TmSpace 对齐），业务传 `small` / `large` / 数值覆盖',
    type: 'number | string | small | middle | large',
    default: 'middle',
  },
  {
    prop: 'vertical',
    desc: '纵向排列（ant 原生）',
    type: 'boolean',
    default: 'false',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Flex 全部 props / slots / events（如 `justify` / `align` / `wrap` / `flex`）',
    type: 'FlexProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="FlexDemoCode">
  <FlexDemo />
</DemoBlock>

## API

### TmFlex Props

<TmPropsTable :data="flexProps" />

### TmFlex Methods

业务侧通过 `ref` 可访问内部 ant Flex 实例（经 `useForwardRef` 透传）。
