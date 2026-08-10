<!-- packages/ui/src/components/cascader/demos/basic.vue -->
<!-- TmCascader 基础演示：options 级联数据 + v-model 受控 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmCascader } from '../index'

const value = ref<string[]>(['zhejiang', 'hangzhou'])

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [{ value: 'nanjing', label: '南京' }],
  },
]
</script>

<template>
  <TmCascader v-model="value" :options="options" style="width: 240px" />
  <p>当前值：{{ value.join(' / ') }}</p>
</template>
