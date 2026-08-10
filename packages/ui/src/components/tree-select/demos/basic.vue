<!-- packages/ui/src/components/tree-select/demos/basic.vue -->
<!-- TmTreeSelect 基础演示：treeData 树数据 + v-model 受控 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTreeSelect } from '../index'

const value = ref('0-0-1')

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      { title: 'Child Node1', value: '0-0-1' },
      { title: 'Child Node2', value: '0-0-2' },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    children: [{ title: 'Child Node3', value: '0-1-1' }],
  },
]
</script>

<template>
  <TmTreeSelect v-model="value" :tree-data="treeData" style="width: 240px" />
  <p>当前值：{{ value }}</p>
</template>
