# Space 间距

基于 [ant-design-vue](https://www.antdv.com/components/space-cn) Space 的薄封装。保留全部 ant 原生 props / slots / events，公司默认间距 `middle` 兜底，业务可覆盖。

## 何时使用

- 需要统一组件间距规范的横向 / 纵向布局。
- 希望团队避免手写间距值，遵循公司间距规范（未来改默认只动一处）。

## 基础用法

公司默认 `size=middle` + 业务覆盖 + `split` 分隔符。

<script setup>
import SpaceDemo from '../../../packages/ui/src/components/space/demos/basic.vue'
import SpaceDemoCode from '../../../packages/ui/src/components/space/demos/basic.vue?raw'

const spaceProps = [
  {
    prop: 'size',
    desc: '间距：公司默认 `middle`，业务传 `small` / `large` / 具体数值覆盖',
    type: 'number | small | middle | large',
    default: 'middle',
  },
  {
    prop: 'direction',
    desc: '排列方向（ant 原生）',
    type: 'horizontal | vertical',
    default: 'horizontal',
  },
  {
    prop: 'split',
    desc: '分隔符（公司扩展键）：ant Space 的 `split` 是具名插槽，`split="|"` 属性形式会被 ant 静默忽略；本扩展支持 prop 形式传入自动转插槽。显式传 `#split` 插槽时以插槽为准',
    type: 'string',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Space 全部 props / slots / events（如 `align` / `wrap`）',
    type: 'SpaceProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="SpaceDemoCode">
  <SpaceDemo />
</DemoBlock>

> 注：ant Space 的 `split` 原本是**具名插槽**（`spaceProps` 未声明 `split` prop）。
> TmSpace 提供 `split` 扩展键，`<TmSpace split="|">` prop 形式可直接用（自动转插槽）；
> 需要节点型分隔符时仍可用 `<template #split>|</template>`（插槽形式优先）。

## API

### TmSpace Props

<TmPropsTable :data="spaceProps" />

### TmSpace Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 子元素（透传 ant） |
| `split` | 分隔符节点：`<template #split>|</template>`（ant 原生 slot） |

### TmSpace Methods

业务侧通过 `ref` 可访问内部 ant Space 实例（经 `useForwardRef` 透传）。
