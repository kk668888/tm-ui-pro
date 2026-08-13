<!-- packages/ui/src/components/float-button/src/FloatButton.vue -->
<!--
  TmFloatButton 薄封装组件：ant FloatButton 浮动按钮
  核心机制：
  1. ant 原生透传：icon / description / shape / type / badge / tooltip / target / href 等原样下发
  2. 公司默认：无（ant 原生样式兜底）
  3. 动态插槽全透传（default / icon / description / badge 等）+ useForwardRef 方法透传
     —— 单按钮无可见性控制 prop，ant 原生默认常驻显示
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { FloatButton as AFloatButton } from 'ant-design-vue'
import type { TmFloatButtonProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant FloatButton 实例类型（用 InstanceType 推导） */
type FloatButtonInstance = InstanceType<typeof AFloatButton>

defineOptions({ name: 'TmFloatButton', inheritAttrs: false })

/** 组件 props：TmFloatButtonProps = FloatButtonProps（无公司默认） */
const props = defineProps<TmFloatButtonProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant FloatButton 实例 */
const { innerRef, exposed } = useForwardRef<FloatButtonInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AFloatButton ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFloatButton>
</template>
