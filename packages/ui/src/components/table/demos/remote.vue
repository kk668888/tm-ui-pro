<!-- packages/ui/src/components/table/demos/remote.vue -->
<!-- TmTable 远程分页 + search 搜索联动 demo -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable } from '../index'
import type { TmTableProps } from '../index'

// 内存 mock 数据源：模拟后端列表（57 条）
const mockRows = Array.from({ length: 57 }, (_, i) => ({
  id: i + 1,
  name: `用户${i + 1}`,
  age: 20 + (i % 30),
  status: i % 3 === 0 ? 1 : 2,
}))

// 列配置
const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'status', title: '状态', width: 100 },
]

// request 远程拉数：模拟网络延迟 + 按 search 条件过滤 + 分页切片
const request: TmTableProps['request'] = async ({ currentPage, pageSize, query }) => {
  await new Promise((r) => setTimeout(r, 300))
  const keyword = (query?.name as string | undefined) ?? ''
  const status = query?.status as number | undefined
  const filtered = mockRows.filter(
    (row) => row.name.includes(keyword) && (status == null || row.status === status),
  )
  const start = (currentPage - 1) * pageSize
  return { data: filtered.slice(start, start + pageSize), total: filtered.length }
}

// search 声明式 ant 搜索表单（查询/重置自动接 request）
const search = {
  fields: [
    { field: 'name', label: '姓名', type: 'input', placeholder: '请输入姓名' },
    {
      field: 'status',
      label: '状态',
      type: 'select',
      options: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 2 },
      ],
    },
  ],
}
</script>

<template>
  <TmTable :request="request" :columns="columns" :search="search" />
</template>
