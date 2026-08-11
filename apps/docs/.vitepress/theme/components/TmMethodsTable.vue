<!--
  TmMethodsTable.vue
  文档站命令式 API 方法表格组件：内部用组件库 TmTable 渲染，统一 ant 主题视觉 + 列排序
  - 固定列配置：方法 / 说明 / 返回
  - 数据由各组件页 md 的 <script setup> 声明数组传入（数据驱动，替代手写 markdown 表格）
  - TmTable 静态模式（无 request）+ pagination=false：隐藏分页器，数据全量渲染

  使用方式（markdown 内）：
  ```vue
  <script setup>
  const messageMethods = [
    { method: 'success(content, config?)', desc: '成功提示', returns: 'close: () => void' },
  ]
  </script>

  <TmMethodsTable :data="messageMethods" />
  ```
-->
<script setup lang="ts">
import { TmTable } from '@tm/ui'
import { renderInline } from './renderMarkdown'

/** 命令式 API 方法表格行数据契约（各组件页 md 按此声明） */
export interface TmMethodsTableRow {
  /** 方法签名 */
  method: string
  /** 说明文案 */
  desc: string
  /** 返回（'-' 表示无） */
  returns: string
}

/** 数据数组（业务侧传入） */
defineProps<{ data: TmMethodsTableRow[] }>()

// 固定列配置（vxe-grid 格式）：方法可排序，其余列自适应宽度，fit 默认铺满容器
// 列内容走 markdown cell slot（v-html），showOverflow:false 不触发 vxe 溢出 tooltip
const columns = [
  { field: 'method', title: '方法', minWidth: 280, sortable: true, showOverflow: false, slots: { default: 'md-method' } },
  { field: 'desc', title: '说明', minWidth: 320, showOverflow: false, slots: { default: 'md-desc' } },
  { field: 'returns', title: '返回', minWidth: 200, showOverflow: false, slots: { default: 'md-returns' } },
]
</script>

<template>
  <TmTable :data="data" :columns="columns" :pagination="false">
    <!-- 单元格内联 markdown 渲染（v-html 输出 markdown-it 产物） -->
    <template #md-method="{ row }"><span v-html="renderInline(row.method)" /></template>
    <template #md-desc="{ row }"><span v-html="renderInline(row.desc)" /></template>
    <template #md-returns="{ row }"><span v-html="renderInline(row.returns)" /></template>
  </TmTable>
</template>
