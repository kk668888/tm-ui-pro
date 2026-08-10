<!-- packages/ui/src/components/radio-group/demos/basic.vue -->
<!-- TmRadioGroup 基础演示：options 数组驱动 + v-model 受控 + disabled 级联 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmRadioGroup } from '../index'

const value = ref('apple')

const options = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange', disabled: true },
]
</script>

<template>
  <TmRadioGroup v-model="value" :options="options" />
  <p>当前值：{{ value }}</p>
</template>
