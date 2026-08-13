<!-- packages/ui/src/components/segmented/src/Segmented.vue -->
<!--
  TmSegmented 薄封装组件：ant Segmented 分段控制器
  核心机制：
  1. ant 原生透传：options / value / block / disabled / size / onChange 等原样下发
  2. 公司默认：无（ant 原生 size 等兜底）
  3. 动态插槽全透传（label 带 { value, title, disabled } / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Segmented as ASegmented } from 'ant-design-vue'
import type { TmSegmentedProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Segmented 实例类型（ant 未导出 SegmentedInstance，用 InstanceType 推导） */
type SegmentedInstance = InstanceType<typeof ASegmented>

defineOptions({ name: 'TmSegmented', inheritAttrs: false })

/** 组件 props：TmSegmentedProps = SegmentedProps（无公司默认） */
const props = defineProps<TmSegmentedProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Segmented 实例 */
const { innerRef, exposed } = useForwardRef<SegmentedInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，block/disabled 缺省不覆盖 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ASegmented ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASegmented>
</template>
