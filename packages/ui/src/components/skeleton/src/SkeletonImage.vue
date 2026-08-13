<!-- packages/ui/src/components/skeleton/src/SkeletonImage.vue -->
<!--
  TmSkeletonImage 薄封装组件：ant Skeleton.Image 骨架
  核心机制：ant 原生透传（size / shape / active 等）+ useForwardRef 方法透传；
  公司默认：无（ant 原生兜底）。
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { SkeletonImage as ASkeletonImage } from 'ant-design-vue'
import type { TmSkeletonImageProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Skeleton.Avatar 实例类型（用 InstanceType 推导） */
type SkeletonImageInstance = InstanceType<typeof ASkeletonImage>

defineOptions({ name: 'TmSkeletonImage', inheritAttrs: false })

/** 组件 props：TmSkeletonImageProps = SkeletonImageProps（无公司默认） */
const props = defineProps<TmSkeletonImageProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Skeleton.Avatar 实例 */
const { innerRef, exposed } = useForwardRef<SkeletonImageInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ASkeletonImage ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASkeletonImage>
</template>
