<!-- packages/ui/src/components/image/demos/basic.vue -->
<!-- TmImage 基础演示：图片 + 预览组（provide/inject 上下文） -->
<script setup lang="ts">
import { TmImage, TmImagePreviewGroup } from '../index'

const imgs = ['1', '2', '3']
</script>

<template>
  <div style="width: 100%">
    <p>基础图片（可预览）</p>
    <TmImage width="200" :src="`https://picsum.photos/200/200?random=${imgs[0]}`" />
    <p style="margin-top: 16px">预览组（点击任一可左右切换）</p>
    <TmImagePreviewGroup>
      <TmImage v-for="i in imgs" :key="i" width="100" :src="`https://picsum.photos/200/200?random=${i}`" style="margin-right: 8px" />
    </TmImagePreviewGroup>
  </div>
</template>
