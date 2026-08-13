<!-- packages/ui/src/components/card/src/Card.vue -->
<!--
  TmCard 薄封装组件：ant Card 卡片（业务页骨架）
  核心机制：
  1. 公司默认 bordered: true / size: 'default'（withDefaults + companyDefaults 显式转发），业务覆盖
  2. ant 原生透传：title / extra / cover / actions / hoverable 等原样下发
  3. 动态插槽全透传（tabs / actions / cover / extra / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Card as ACard } from 'ant-design-vue'
import type { TmCardProps } from './props'
import { tmCardDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Card 实例类型（ant 未导出 CardInstance，用 InstanceType 推导） */
type CardInstance = InstanceType<typeof ACard>

defineOptions({ name: 'TmCard', inheritAttrs: false })

/** 组件 props：TmCardProps = CardProps；bordered / size 公司默认兜底 */
const props = withDefaults(defineProps<TmCardProps>(), {
  bordered: tmCardDefaults.bordered,
  size: tmCardDefaults.size,
})

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Card 实例 */
const { innerRef, exposed } = useForwardRef<CardInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 公司默认 bordered/size + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, ['bordered', 'size'])
</script>

<template>
  <ACard ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACard>
</template>
