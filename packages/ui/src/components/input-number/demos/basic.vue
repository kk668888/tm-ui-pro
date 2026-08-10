<!-- packages/ui/src/components/input-number/demos/basic.vue -->
<!-- TmInputNumber 基础演示：v-model 数值受控 + 边界/精度透传 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInputNumber } from '../index'

const value = ref(5)
</script>

<template>
  <TmInputNumber v-model="value" :min="0" :max="100" :precision="2" />
  <p>当前值：{{ value }}</p>
</template>
