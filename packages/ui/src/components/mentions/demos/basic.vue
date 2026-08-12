<!-- packages/ui/src/components/mentions/demos/basic.vue -->
<!-- TmMentions 基础演示：@提及 + options 数据源 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmMentions } from '../index'

const value = ref('@user1')
const options = [
  { value: 'user1', label: '张三' },
  { value: 'user2', label: '李四' },
  { value: 'user3', label: '王五' },
]
</script>

<template>
  <div style="width: 100%">
    <p>@提及（options 数据源）</p>
    <TmMentions v-model:value="value" :options="options" placeholder="输入 @ 触发提及" style="max-width: 400px" />
  </div>
</template>
