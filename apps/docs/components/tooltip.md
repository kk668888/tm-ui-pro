# Tooltip 文字提示

基于 [ant-design-vue](https://www.antdv.com/components/tooltip-cn) Tooltip 的薄封装。统一公司提示气泡视觉（placement / 溢出调整 / 箭头），反哺 Popover / Popconfirm 弹层一致性。

## 何时使用

- 鼠标悬停展示简短说明 / 完整内容截断提示。
- 作为 Popover / Popconfirm 的同源底层，先统一它可反哺弹层一致性。

## 基础用法

<script setup>
import TooltipDemo from '../../../packages/ui/src/components/tooltip/demos/basic.vue'
import TooltipDemoCode from '../../../packages/ui/src/components/tooltip/demos/basic.vue?raw'

const props = [
  { prop: 'title', desc: '提示内容（prop 或 #title 插槽）', type: 'VueNode', default: '-' },
  { prop: 'placement', desc: '气泡位置：公司默认 `top`，业务可覆盖', type: "'top' | 'bottom' | 'left' | 'right' | ...", default: "'top'" },
  { prop: 'arrow', desc: '是否显示箭头：公司默认 `true`', type: 'boolean', default: 'true' },
  { prop: 'autoAdjustOverflow', desc: '溢出自动调整位置：公司默认 `true`', type: 'boolean', default: 'true' },
  { prop: 'open / defaultOpen', desc: '受控 / 非受控显隐（缺省不形成受控 false）', type: 'boolean', default: '-' },
  { prop: 'color / mouseEnterDelay / mouseLeaveDelay / trigger', desc: '其余 ant 原生（颜色 / 延迟 / 触发方式）', type: 'TooltipProps', default: '-' },
]
</script>

<DemoBlock :code="TooltipDemoCode">
  <TooltipDemo />
</DemoBlock>

> 注：TmTooltip 使用 render function 转发 default slot（ant cloneElement 注入 aria/class 到真实 trigger）；`open` 缺省幻影 false 被 `useForwardBindings` 跳过，不覆盖 ant 非受控默认。

## API

### TmTooltip Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Tooltip 实例（经 `useForwardRef` 透传）。
