<!-- packages/ui/src/components/table/demos/basic.vue -->
<!-- TmTable 最小用法 demo：静态 data + columns 模式 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable } from '../index'
import type { TmTableProps } from '../index'

// 业务数据（静态模式：data 直接绑定到 TmTable）
const data = ref<TmTableProps['data']>([
  { id: 1, name: 'Tom', age: 28 },
  { id: 2, name: 'Jack', age: 34 },
  { id: 3, name: 'Lucy', age: 22 },
])

// 列配置（TmTable 自动补 align=left / showOverflow=true 默认）
const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
]
</script>

<template>
  <TmTable :data="data" :columns="columns" />
</template>
