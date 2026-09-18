<!-- packages/ui/src/components/table-columns/demos/column.vue -->
<!--
  TmTableColumn 详细演示（原生 <a-table> 模板写法）：
  1. 基础列：data-index + title，配列宽（width）与对齐（align）
  2. 列级自定义渲染：<TmTableColumn> 的 #default 插槽
     作用域为 { text, value, record, index, renderIndex, column }
  3. 表格级统一渲染：#bodyCell 插槽，按 column.dataIndex 分发不同列

  ⚠️ 不能同时传 :columns —— ant 内部实现是
  `const columns = props.columns || convertChildrenToColumns(slots.default?.())`，
  只要 columns 是 truthy（**空数组 [] 也是 truthy**）就整体禁用模板列写法，
  表格会渲染成空列（与 TmSelect 传空数组 options 会禁用 children 模式属同类陷阱）。
-->
<script setup lang="ts">
import { TmTableColumn } from '../index'

/** 示例数据：ant Table 需要数据行唯一标识，故用 row-key="id" */
const dataSource = [
  { id: '1', name: '张三', dept: '前端', score: 92, status: 'active' },
  { id: '2', name: '李四', dept: '后端', score: 85, status: 'inactive' },
  { id: '3', name: '王五', dept: '测试', score: 78, status: 'active' },
]

/** 英文状态值 → 中文展示文案（未知值原样返回） */
const statusText: Record<string, string> = { active: '启用', inactive: '停用' }

/** 把单元格里的状态值格式化成中文（插槽拿到的是 unknown，先转字符串再查表） */
function formatStatus(value: unknown): string {
  const key = String(value)
  return statusText[key] ?? key
}

/** 状态值 → ant Tag 颜色（启用绿、停用灰） */
function statusColor(value: unknown): string {
  return String(value) === 'active' ? 'green' : 'default'
}

/** 评分 → ant Tag 颜色（85 分及以上达标） */
function scoreColor(value: unknown): string {
  return Number(value) >= 85 ? 'green' : 'orange'
}
</script>

<template>
  <div style="width: 100%">
    <b>基础列（data-index + title + 列宽/对齐）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      style="width: 100%">
      <TmTableColumn data-index="name" title="姓名" key="name" />
      <TmTableColumn data-index="dept" title="部门" key="dept" />
      <!-- align="right" + 固定列宽：数值列常见写法 -->
      <TmTableColumn data-index="score" title="评分" key="score" align="right" :width="100" />
    </a-table>
  </div>

  <div style="width: 100%">
    <b>列级自定义渲染（#default 插槽，作用域含 text / record / index）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      style="width: 100%">
      <TmTableColumn data-index="name" title="姓名" key="name" />
      <TmTableColumn data-index="status" title="状态" key="status">
        <template #default="{ text }">
          <a-tag :color="statusColor(text)">{{ formatStatus(text) }}</a-tag>
        </template>
      </TmTableColumn>
      <!-- 无 data-index 的操作列：仅靠插槽渲染，record 为当前行数据 -->
      <TmTableColumn title="操作" key="action" :width="120">
        <template #default="{ record }">
          <a-button type="link" size="small">编辑 {{ record.name }}</a-button>
        </template>
      </TmTableColumn>
    </a-table>
  </div>

  <div style="width: 100%">
    <b>表格级统一渲染（#bodyCell，按 column.dataIndex 分发）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      style="width: 100%">
      <TmTableColumn data-index="name" title="姓名" key="name" />
      <TmTableColumn data-index="score" title="评分" key="score" />
      <TmTableColumn data-index="status" title="状态" key="status" />
      <!-- 一处集中处理所有列；未命中任何分支的列（这里是「姓名」）
           插槽输出为空，ant 自动回退为原始单元格值，无需再写 else 分支 -->
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'score'">
          <a-tag :color="scoreColor(text)">{{ text }}</a-tag>
        </template>
        <template v-else-if="column.dataIndex === 'status'">
          {{ formatStatus(text) }}
        </template>
      </template>
    </a-table>
  </div>
</template>
