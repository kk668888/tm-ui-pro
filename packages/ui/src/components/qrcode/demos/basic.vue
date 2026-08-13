<!-- packages/ui/src/components/qrcode/demos/basic.vue -->
<!-- TmQRCode 基础演示：二维码（value / size / 状态） -->
<script setup lang="ts">
import { TmQRCode } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础二维码</p>
    <TmQRCode value="https://example.com" :size="160" />
  </div>
</template>
