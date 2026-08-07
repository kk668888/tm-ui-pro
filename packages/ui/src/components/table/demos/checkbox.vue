<!-- packages/ui/src/components/table/demos/checkbox.vue -->
<!-- TmTable 勾选 demo：checkbox-config + getCheckboxRecords（vxe 原生能力透传） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable } from '../index'
import type { TmTableProps, VxeGridInstance } from '../index'

const data = ref<TmTableProps['data']>(
  Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    role: ['管理员', '编辑', '访客'][i % 3],
  })),
)

// 第一列为 checkbox 勾选列；checkbox-config.highlight 高亮选中行
const columns = [
  { type: 'checkbox', width: 60 },
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'role', title: '角色', width: 120 },
]

const checkboxConfig = { highlight: true }

// 获取勾选行（vxe 实例方法经 useForwardRef 透传到 tableRef）
const tableRef = ref<VxeGridInstance>()
const showChecked = (): void => {
  const records = tableRef.value?.getCheckboxRecords() ?? []
  window.alert(`已勾选 ${records.length} 行：` + records.map((r) => r.name).join('、'))
}
</script>

<template>
  <div style="width: 100%">
    <button style="margin-bottom: 12px" @click="showChecked">获取勾选行</button>
    <TmTable
      ref="tableRef"
      :data="data"
      :columns="columns"
      :checkbox-config="checkboxConfig"
    />
  </div>
</template>
