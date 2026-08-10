<!-- packages/ui/src/components/checkbox-group/demos/basic.vue -->
<!-- TmCheckboxGroup 基础演示：options 数组驱动 + v-model 数组受控 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmCheckboxGroup } from '../index'

const value = ref<string[]>(['vue'])

const options = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte', disabled: true },
]
</script>

<template>
  <TmCheckboxGroup v-model="value" :options="options" />
  <p>当前值：{{ value.join('、') }}</p>
</template>
