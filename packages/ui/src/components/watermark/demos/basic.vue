<!-- packages/ui/src/components/watermark/demos/basic.vue -->
<!-- TmWatermark 基础演示：水印（文字水印包裹内容） -->
<script setup lang="ts">
import { TmWatermark } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础水印（文字水印）</p>
    <TmWatermark content="tm-ui 内部水印" style="width: 100%">
      <div style="height: 200px; border: 1px dashed #d9d9d9; display: flex; align-items: center; justify-content: center">
        受水印保护的内容区域
      </div>
    </TmWatermark>
  </div>
</template>
