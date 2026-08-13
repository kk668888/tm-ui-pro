<!-- packages/ui/src/components/descriptions/src/DescriptionsItem.vue -->
<!--
  TmDescriptionsItem 薄封装组件：ant DescriptionsItem 描述列表子项
  核心机制：
  1. ant Descriptions 通过 vnode.props 读取 label / span / labelStyle / contentStyle（见 Descriptions.vue 头注释）
     —— defineProps<TmDescriptionsItemProps>() 完整声明这些 props，保证 vnode.props 携带条目信息
  2. 动态插槽全透传（label / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { DescriptionsItem as ADescriptionsItem } from 'ant-design-vue'
import type { TmDescriptionsItemProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant DescriptionsItem 实例类型（用 InstanceType 推导） */
type DescriptionsItemInstance = InstanceType<typeof ADescriptionsItem>

defineOptions({ name: 'TmDescriptionsItem', inheritAttrs: false })

/** 组件 props：TmDescriptionsItemProps = DescriptionsItemProps（无公司默认） */
const props = defineProps<TmDescriptionsItemProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant DescriptionsItem 实例 */
const { innerRef, exposed } = useForwardRef<DescriptionsItemInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ADescriptionsItem ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ADescriptionsItem>
</template>
