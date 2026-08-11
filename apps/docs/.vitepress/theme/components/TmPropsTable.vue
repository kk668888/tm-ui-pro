<!--
  TmPropsTable.vue
  文档站 API 表格组件：内部用组件库 TmTable 渲染，统一 ant 主题视觉 + 列排序
  - 固定列配置：属性 / 说明 / 类型 / 默认值
  - 数据由各组件页 md 的 <script setup> 声明数组传入（数据驱动，替代手写 markdown 表格）
  - TmTable 静态模式（无 request）+ pagination=false：隐藏分页器，数据全量渲染

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
import { renderInline } from './renderMarkdown'

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

// 固定列配置（vxe-grid 格式）：
// - 属性可排序，其余列自适应宽度，fit 默认铺满容器
// - slots.default 指定 markdown 渲染的 cell slot（下方模板提供同名具名 slot）
// - showOverflow:false：markdown 渲染后内容由 v-html 输出，不走 vxe 溢出 tooltip
const columns = [
  { field: 'prop', title: '属性', width: 160, sortable: true, showOverflow: false, slots: { default: 'md-prop' } },
  { field: 'desc', title: '说明', minWidth: 320, showOverflow: false, slots: { default: 'md-desc' } },
  { field: 'type', title: '类型', minWidth: 220, showOverflow: false, slots: { default: 'md-type' } },
  { field: 'default', title: '默认值', width: 140, align: 'center', showOverflow: false, slots: { default: 'md-default' } },
]
</script>

<template>
  <TmTable :data="data" :columns="columns" :pagination="false">
    <!-- 单元格内联 markdown 渲染（v-html 输出 markdown-it 产物，支持反引号代码/链接等） -->
    <template #md-prop="{ row }"><span v-html="renderInline(row.prop)" /></template>
    <template #md-desc="{ row }"><span v-html="renderInline(row.desc)" /></template>
    <template #md-type="{ row }"><span v-html="renderInline(row.type)" /></template>
    <template #md-default="{ row }"><span v-html="renderInline(row.default)" /></template>
  </TmTable>
</template>
