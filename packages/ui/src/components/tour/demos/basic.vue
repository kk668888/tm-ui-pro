<!-- packages/ui/src/components/tour/demos/basic.vue -->
<!-- TmTour 基础演示：步骤锚定按钮 + 受控打开 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTour } from '../index'
import { TmButton } from '../../button'

const open = ref(true)
const steps = [
  {
    title: '第一步',
    description: '这里是功能说明一',
    target: () => document.querySelector('.tour-step-1') as HTMLElement,
  },
  {
    title: '第二步',
    description: '这里是功能说明二',
    target: () => document.querySelector('.tour-step-2') as HTMLElement,
  },
]
</script>

<template>
  <div style="width: 100%">
    <p>引导（Tour 步骤锚定下方按钮，点击「重新引导」再次打开，点击右上角 X 或「完成」关闭）</p>
    <div style="display: flex; gap: 12px; margin-bottom: 8px">
      <TmButton class="tour-step-1">功能入口一</TmButton>
      <TmButton class="tour-step-2">功能入口二</TmButton>
    </div>
    <TmButton type="primary" @click="open = true">重新引导</TmButton>
    <TmTour v-model:open="open" :steps="steps" />
  </div>
</template>
