<!-- packages/ui/src/components/table/demos/search.vue -->
<!-- TmTable search 搜索表单 demo：多字段（input/select）+ 查询/重置 -->
<script setup lang="ts">
import { TmTable } from '../index'
import type { TmTableProps } from '../index'

// 内存 mock 数据源
const mockRows = Array.from({ length: 45 }, (_, i) => ({
  id: i + 1,
  name: `项目${i + 1}`,
  owner: i % 2 === 0 ? 'Alice' : 'Bob',
  category: ['前端', '后端', '数据'][i % 3],
}))

const columns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '项目名' },
  { field: 'owner', title: '负责人', width: 120 },
  { field: 'category', title: '分类', width: 120 },
]

const request: TmTableProps['request'] = async ({ currentPage, pageSize, query }) => {
  await new Promise((r) => setTimeout(r, 200))
  const keyword = (query?.name as string | undefined) ?? ''
  const owner = (query?.owner as string | undefined) ?? ''
  const filtered = mockRows.filter(
    (row) => row.name.includes(keyword) && (!owner || row.owner === owner),
  )
  const start = (currentPage - 1) * pageSize
  return { data: filtered.slice(start, start + pageSize), total: filtered.length }
}

// 多字段搜索表单：名称模糊搜索 + 负责人下拉 + 分类下拉
// 显式类型标注（TmTableSearchConfig）：type 字段需收窄为字面量联合，否则推断为 string
const search: TmTableProps['search'] = {
  fields: [
    { field: 'name', label: '项目名', type: 'input', placeholder: '模糊搜索' },
    {
      field: 'owner',
      label: '负责人',
      type: 'select',
      options: [
        { label: 'Alice', value: 'Alice' },
        { label: 'Bob', value: 'Bob' },
      ],
    },
    {
      field: 'category',
      label: '分类',
      type: 'select',
      options: [
        { label: '前端', value: '前端' },
        { label: '后端', value: '后端' },
        { label: '数据', value: '数据' },
      ],
    },
  ],
}
</script>

<template>
  <TmTable :request="request" :columns="columns" :search="search" />
</template>
