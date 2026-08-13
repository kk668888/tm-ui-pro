<!-- packages/ui/src/components/carousel/src/Carousel.vue -->
<!--
  TmCarousel 薄封装组件：ant Carousel 轮播
  核心机制：
  1. ant 原生透传：autoplay / dots / effect / arrows / dotPosition 等原样下发
  2. 公司默认：无（ant 原生 autoplay 等兜底；autoplay 缺省幻影 false 被 useForwardBindings 跳过）
  3. 公开方法：next / prev / goTo（经 useForwardRef<CarouselRef>() 透传 ant 官方实例接口）
  4. 动态插槽全透传（default / prevArrow / nextArrow）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Carousel as ACarousel } from 'ant-design-vue'
import type { CarouselRef } from 'ant-design-vue/es/carousel'
import type { TmCarouselProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

defineOptions({ name: 'TmCarousel', inheritAttrs: false })

/** 组件 props：TmCarouselProps = CarouselProps（无公司默认） */
const props = defineProps<TmCarouselProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：Carousel 走 ant 官方公开接口 CarouselRef（next / prev / goTo） */
const { innerRef, exposed } = useForwardRef<CarouselRef>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（autoplay 幻影 false 跳过，不覆盖 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ACarousel ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACarousel>
</template>
