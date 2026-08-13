<!-- packages/ui/src/components/watermark/src/Watermark.vue -->
<!--
  TmWatermark 薄封装组件：ant Watermark 水印
  核心机制：
  1. ant 原生透传：content / image / font / gap / offset / rotate / zIndex / opacity 等原样下发
  2. 公司默认：无（ant 原生兜底）
  3. 动态插槽全透传（default 包裹内容）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Watermark as AWatermark } from 'ant-design-vue'
import type { TmWatermarkProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Watermark 实例类型（ant 未导出 WatermarkInstance，用 InstanceType 推导） */
type WatermarkInstance = InstanceType<typeof AWatermark>

defineOptions({ name: 'TmWatermark', inheritAttrs: false })

/** 组件 props：TmWatermarkProps = WatermarkProps（无公司默认） */
const props = defineProps<TmWatermarkProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Watermark 实例 */
const { innerRef, exposed } = useForwardRef<WatermarkInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AWatermark ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AWatermark>
</template>
