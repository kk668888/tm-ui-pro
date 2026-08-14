<!-- packages/ui/src/components/transfer/demos/basic.vue -->
<!-- TmTransfer 基础演示：穿梭框（公司默认标题 + 搜索） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTransfer } from '../index'

const targetKeys = ref<string[]>(['1'])
const dataSource = [
  { key: '0', title: '项目 0' },
  { key: '1', title: '项目 1' },
  { key: '2', title: '项目 2' },
  { key: '3', title: '项目 3' },
  { key: '4', title: '项目 4' },
]
</script>

<template>
  <div style="width: 100%">
    <p>基础穿梭（公司默认标题 + 默认 render 显示选项文案）</p>
    <TmTransfer
      v-model:target-keys="targetKeys"
      :data-source="dataSource"
      :list-style="{ width: 260, height: 420 }"
      show-search
    />
  </div>
</template>
