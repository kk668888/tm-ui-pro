<!-- packages/ui/src/components/table/demos/density.vue -->
<!-- TmTable 密度切换 demo：compact / default / loose 三档行高 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable } from '../index'
import type { TmTableProps, TmTableDensity } from '../index'

const data = ref<TmTableProps['data']>(
  Array.from({ length: 20 }, (_, i) => ({
    id: i + 1,
    name: `用户${i + 1}`,
    dept: ['研发部', '产品部', '运营部'][i % 3],
  })),
)

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'dept', title: '部门', width: 120 },
]

// 密度三档循环切换
const densityList: TmTableDensity[] = ['compact', 'default', 'loose']
const density = ref<TmTableDensity>('default')
const toggleDensity = (): void => {
  const idx = densityList.indexOf(density.value)
  density.value = densityList[(idx + 1) % densityList.length]
}
</script>

<template>
  <div style="width: 100%">
    <button style="margin-bottom: 12px" @click="toggleDensity">
      切换密度（当前：{{ density }}）
    </button>
    <TmTable :data="data" :columns="columns" :density="density" />
  </div>
</template>
