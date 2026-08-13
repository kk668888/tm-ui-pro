<!-- packages/ui/src/components/carousel/demos/basic.vue -->
<!-- TmCarousel 基础演示：轮播 + 公开方法（next/prev/goTo） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmCarousel } from '../index'
import type { CarouselRef } from '../index'

const carouselRef = ref<CarouselRef>()

const goNext = () => carouselRef.value?.next()
const goPrev = () => carouselRef.value?.prev()
</script>

<template>
  <div style="width: 100%">
    <p>基础轮播（autoplay + 切换按钮）</p>
    <TmCarousel ref="carouselRef" autoplay style="width: 100%; max-width: 600px">
      <div v-for="i in 3" :key="i" style="height: 160px; line-height: 160px; text-align: center; background: #1677ff; color: #fff">
        轮播 {{ i }}
      </div>
    </TmCarousel>
    <div style="margin-top: 12px">
      <button @click="goPrev">上一张</button>
      <button style="margin-left: 8px" @click="goNext">下一张</button>
    </div>
  </div>
</template>
