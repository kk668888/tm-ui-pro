<!-- packages/ui/src/components/skeleton/src/Skeleton.vue -->
<!--
  TmSkeleton 薄封装组件：ant Skeleton 骨架屏
  核心机制：
  1. ant 原生透传：loading / active / avatar / title / paragraph / round 等原样下发
  2. 公司默认：无（ant 原生骨架占位兜底）
  3. 动态插槽全透传（default / title / paragraph / avatar / extra）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Skeleton as ASkeleton } from 'ant-design-vue'
import type { TmSkeletonProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Skeleton 实例类型（用 InstanceType 推导） */
type SkeletonInstance = InstanceType<typeof ASkeleton>

defineOptions({ name: 'TmSkeleton', inheritAttrs: false })

/** 组件 props：TmSkeletonProps = SkeletonProps（无公司默认） */
const props = defineProps<TmSkeletonProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Skeleton 实例 */
const { innerRef, exposed } = useForwardRef<SkeletonInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，loading 缺省不覆盖 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ASkeleton ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASkeleton>
</template>
