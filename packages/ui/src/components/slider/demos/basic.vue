<!-- packages/ui/src/components/slider/demos/basic.vue -->
<!-- TmSlider 基础演示：单滑块 + 范围滑块 + 标记 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSlider } from '../index'

const value = ref(30)
const range = ref<[number, number]>([20, 80])
</script>

<template>
  <div style="width: 100%">
    <p>基础滑块（v-model）</p>
    <TmSlider v-model:value="value" style="max-width: 400px" />
    <p>范围滑块 range</p>
    <TmSlider v-model:value="range" range :min="0" :max="100" style="max-width: 400px" />
    <p>步长 + 标记</p>
    <TmSlider :default-value="50" :step="10" :marks="{ 0: '0', 50: '50', 100: '100' }" style="max-width: 400px" />
  </div>
</template>
