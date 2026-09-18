<!-- packages/ui/src/components/table-columns/demos/column-group.vue -->
<!--
  TmTableColumnGroup 详细演示（原生 <a-table> 模板写法）：
  1. 两层表头：分组标题 + 组内多个列
  2. 三层嵌套：组内再套组（递归分组）

  原理：ant 用列组件对象上的静态标记 `__ANT_TABLE_COLUMN_GROUP` 判定是否为分组，
  再对组内 children 递归 convertChildrenToColumns。TmTableColumnGroup 是 ant
  TableColumnGroup 的「别名复用」（同一组件对象），静态标记与递归识别都完整保留。
-->
<script setup lang="ts">
import { TmTableColumn, TmTableColumnGroup } from '../index'

/** 示例数据：一行对应一个学生的各科成绩 */
const dataSource = [
  { id: '1', name: '张三', class: '一班', chinese: 92, math: 88, english: 95 },
  { id: '2', name: '李四', class: '二班', chinese: 85, math: 91, english: 79 },
  { id: '3', name: '王五', class: '一班', chinese: 78, math: 96, english: 84 },
]
</script>

<template>
  <div style="width: 100%">
    <b>两层表头（分组标题横跨组内各列）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      bordered
      style="width: 100%">
      <!-- 普通列：直接位于表格下 -->
      <TmTableColumn data-index="name" title="姓名" key="name" :width="100" />
      <TmTableColumn data-index="class" title="班级" key="class" :width="100" />
      <!-- 分组列：title 为组头，组内列按声明顺序排布 -->
      <TmTableColumnGroup title="各科成绩" key="scores" align="center">
        <TmTableColumn data-index="chinese" title="语文" key="chinese" align="right" />
        <TmTableColumn data-index="math" title="数学" key="math" align="right" />
        <TmTableColumn data-index="english" title="英语" key="english" align="right" />
      </TmTableColumnGroup>
    </a-table>
  </div>

  <div style="width: 100%">
    <b>三层嵌套（组内再分组）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      bordered
      style="width: 100%">
      <TmTableColumn data-index="name" title="姓名" key="name" :width="100" />
      <!-- 外层分组：第一学期 -->
      <TmTableColumnGroup title="第一学期" key="term1" align="center">
        <TmTableColumn data-index="chinese" title="语文" key="t1-chinese" align="right" />
        <!-- 内层分组：可在组内继续嵌套，实现三层及以上表头 -->
        <TmTableColumnGroup title="理科" key="t1-science" align="center">
          <TmTableColumn data-index="math" title="数学" key="t1-math" align="right" />
          <TmTableColumn data-index="english" title="英语" key="t1-english" align="right" />
        </TmTableColumnGroup>
      </TmTableColumnGroup>
    </a-table>
  </div>
</template>
