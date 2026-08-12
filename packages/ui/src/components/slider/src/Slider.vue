<!-- packages/ui/src/components/slider/src/Slider.vue -->
<!--
  TmSlider 薄封装组件：ant Slider 滑块
  核心机制：
  1. ant 原生透传：min / max / step / range / marks / tipFormatter 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传（自定义滑块内容）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Slider as ASlider } from 'ant-design-vue'
import type { TmSliderProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Slider 实例类型（ant 未导出 SliderInstance，用 InstanceType 推导） */
type SliderInstance = InstanceType<typeof ASlider>

defineOptions({ name: 'TmSlider', inheritAttrs: false })

/** 组件 props：TmSliderProps = SliderProps（无公司默认） */
const props = defineProps<TmSliderProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Slider 实例 */
const { innerRef, exposed } = useForwardRef<SliderInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ASlider ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASlider>
</template>
