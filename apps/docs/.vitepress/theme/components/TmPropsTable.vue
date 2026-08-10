<!--
  TmPropsTable.vue
  文档站 API 表格组件：内部用组件库 TmTable 渲染，统一 ant 主题视觉 + 列排序
  - 固定列配置：属性 / 说明 / 类型 / 默认值
  - 数据由各组件页 md 的 <script setup> 声明数组传入（数据驱动，替代手写 markdown 表格）
  - TmTable 静态模式（无 request），pageSize 100 让 API 表格一页展示完整

  使用方式（markdown 内）：
  ```vue
  <script setup>
  const buttonProps = [
    { prop: 'debounce', desc: '点击防抖间隔（ms）', type: 'number', default: '0' },
  ]
  </script>

  <TmPropsTable :data="buttonProps" />
  ```
-->
<script setup lang="ts">
import { TmTable } from '@tm/ui'

/** API 表格行数据契约（各组件页 md 按此声明） */
export interface TmPropsTableRow {
  /** 属性名 */
  prop: string
  /** 说明文案 */
  desc: string
  /** 类型（TS 类型字符串） */
  type: string
  /** 默认值（'-' 表示无） */
  default: string
}

/** 数据数组（业务侧传入） */
defineProps<{ data: TmPropsTableRow[] }>()

// 固定列配置（vxe-grid 格式）：属性可排序，其余列自适应宽度，fit 默认铺满容器
const columns = [
  { field: 'prop', title: '属性', width: 160, sortable: true },
  { field: 'desc', title: '说明', minWidth: 320 },
  { field: 'type', title: '类型', minWidth: 220 },
  { field: 'default', title: '默认值', width: 140, align: 'center' },
]
</script>

<template>
  <TmTable :data="data" :columns="columns" :pager-config="{ pageSize: 100, pageSizes: [100] }" />
</template>
