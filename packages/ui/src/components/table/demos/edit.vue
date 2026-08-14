<!-- packages/ui/src/components/table/demos/edit.vue -->
<!-- TmTable 行编辑 demo：edit-config + editRender（vxe 原生能力透传） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable } from '../index'
import type { TmTableProps } from '../index'

const data = ref<TmTableProps['data']>(
  Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    age: 20 + i,
    remark: '',
  })),
)

// editRender 使用 vxe-pc-ui 的 VxeInput 组件（需文档站已注册 vxe 全家桶）
const columns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名（点击编辑）', editRender: { name: 'VxeInput' } },
  {
    field: 'age',
    title: '年龄',
    width: 120,
    editRender: { name: 'VxeInput', props: { type: 'integer' } },
  },
  { field: 'remark', title: '备注', editRender: { name: 'VxeInput' } },
]

// 行编辑配置：点击行进入整行编辑，showStatus 显示增删改状态
const editConfig: TmTableProps['editConfig'] = { trigger: 'click', mode: 'row', showStatus: true }
</script>

<template>
  <TmTable :data="data" :columns="columns" :edit-config="editConfig" />
</template>
