<!-- packages/ui/src/components/float-button/src/FloatButtonGroup.vue -->
<!--
  TmFloatButtonGroup 薄封装组件：ant FloatButton.Group 浮动按钮组
  核心机制：
  1. ant 原生透传：shape / open / 组内子按钮等原样下发
  2. 公司默认：无（ant 原生样式兜底）
  3. 动态插槽全透传（default 子按钮 / icon / description 等）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { FloatButtonGroup as AFloatButtonGroup } from 'ant-design-vue'
import type { TmFloatButtonGroupProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant FloatButton.Group 实例类型（用 InstanceType 推导） */
type FloatButtonGroupInstance = InstanceType<typeof AFloatButtonGroup>

defineOptions({ name: 'TmFloatButtonGroup', inheritAttrs: false })

/** 组件 props：TmFloatButtonGroupProps = FloatButtonGroupProps（无公司默认） */
const props = defineProps<TmFloatButtonGroupProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant FloatButton.Group 实例 */
const { innerRef, exposed } = useForwardRef<FloatButtonGroupInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，open 缺省不覆盖 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AFloatButtonGroup ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFloatButtonGroup>
</template>
