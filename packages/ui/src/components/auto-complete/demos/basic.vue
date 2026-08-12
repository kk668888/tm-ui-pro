<!-- packages/ui/src/components/auto-complete/demos/basic.vue -->
<!-- TmAutoComplete 基础演示：options 数据源自动完成 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmAutoComplete } from '../index'

const value = ref('')
const options = [
  { value: 'Apple', label: 'Apple' },
  { value: 'Banana', label: 'Banana' },
  { value: 'Orange', label: 'Orange' },
]
</script>

<template>
  <div style="width: 100%">
    <p>输入匹配自动完成</p>
    <TmAutoComplete
      v-model:value="value"
      :options="options"
      placeholder="输入 a / b / o 试试"
      style="width: 300px"
    />
  </div>
</template>
