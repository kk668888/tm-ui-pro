<!-- packages/ui/src/components/image/src/Image.vue -->
<!--
  TmImage 薄封装组件：ant Image 图片（含预览能力）
  核心机制：
  1. ant 原生透传：src / width / height / preview / placeholder / fallback / alt 等原样下发
  2. 公司默认：无（ant 原生 preview 默认开启等兜底）
  3. 动态插槽全透传（default / previewMask / placeholder）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Image as AImage } from 'ant-design-vue'
import type { TmImageProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Image 实例类型（ant 未导出 ImageInstance，用 InstanceType 推导） */
type ImageInstance = InstanceType<typeof AImage>

defineOptions({ name: 'TmImage', inheritAttrs: false })

/** 组件 props：TmImageProps = ImageProps（无公司默认） */
const props = defineProps<TmImageProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Image 实例 */
const { innerRef, exposed } = useForwardRef<ImageInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，preview 受控不影响 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AImage ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AImage>
</template>
