<!-- packages/ui/src/components/table/demos/static-pagination.vue -->
<!-- TmTable 静态数据本地分页 demo：不传 request，ant 分页器本地切片 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable } from '../index'
import type { TmTableProps } from '../index'

// 25 条静态数据（静态模式：TmTable 本地切片分页，total = data.length）
const data = ref<TmTableProps['data']>(
  Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    name: `记录${i + 1}`,
    group: ['A', 'B', 'C'][i % 3],
  })),
)

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '名称' },
  { field: 'group', title: '分组', width: 100 },
]
</script>

<template>
  <TmTable :data="data" :columns="columns" />
</template>
