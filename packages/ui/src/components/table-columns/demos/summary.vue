<!-- packages/ui/src/components/table-columns/demos/summary.vue -->
<!--
  TmTableSummary / TmTableSummaryRow / TmTableSummaryCell 详细演示（原生 <a-table>）：
  1. 基础汇总行：合计值按列对齐
  2. 单元格合并：col-span 跨列（如「合计」标签横跨两列）
  3. 固定汇总栏：fixed 让汇总行随横向滚动固定在底部

  用法要点：
  - 三者必须写在 `<a-table>` 的 `#summary` 插槽内（ant 的 tfoot 容器通过 provide
    下发列信息，SummaryCell 依赖该上下文计算列位与固定偏移）。
  - `:index` 指定该单元格落在第几列（从 0 开始）；`col-span` / `row-span` 做合并；
    `align` 控制对齐，建议与对应列保持一致。
-->
<script setup lang="ts">
import { computed } from 'vue'
import { TmTableSummary, TmTableSummaryRow, TmTableSummaryCell, TmTableColumn } from '../index'

/** 示例数据：订单明细 */
const dataSource = [
  { id: '1', product: '键盘', price: 199, qty: 2 },
  { id: '2', product: '鼠标', price: 99, qty: 3 },
  { id: '3', product: '显示器', price: 1299, qty: 1 },
]

/** 单价 × 数量后求和：渲染成汇总栏的合计金额 */
const total = computed(() => dataSource.reduce((sum, row) => sum + row.price * row.qty, 0))
</script>

<template>
  <div style="width: 100%">
    <b>基础汇总行（合计按列对齐）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      bordered
      style="width: 100%">
      <TmTableColumn data-index="product" title="商品" key="product" />
      <TmTableColumn data-index="price" title="单价" key="price" align="right" />
      <TmTableColumn data-index="qty" title="数量" key="qty" align="right" />
      <!-- 汇总栏：写在 #summary 插槽内 -->
      <template #summary>
        <TmTableSummary>
          <TmTableSummaryRow>
            <TmTableSummaryCell :index="0">合计</TmTableSummaryCell>
            <!-- :index="1" 表示落在「单价」列位；本列留空 -->
            <TmTableSummaryCell :index="1" align="right" />
            <TmTableSummaryCell :index="2" align="right">{{ total }}</TmTableSummaryCell>
          </TmTableSummaryRow>
        </TmTableSummary>
      </template>
    </a-table>
  </div>

  <div style="width: 100%">
    <b>单元格合并（col-span 跨列）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      bordered
      style="width: 100%">
      <TmTableColumn data-index="product" title="商品" key="product" />
      <TmTableColumn data-index="price" title="单价" key="price" align="right" />
      <TmTableColumn data-index="qty" title="数量" key="qty" align="right" />
      <template #summary>
        <TmTableSummary>
          <TmTableSummaryRow>
            <!-- col-span="2"：该单元格横跨「商品」与「单价」两列 -->
            <TmTableSummaryCell :index="0" :col-span="2" align="right">合计金额</TmTableSummaryCell>
            <TmTableSummaryCell :index="2" align="right">{{ total }}</TmTableSummaryCell>
          </TmTableSummaryRow>
        </TmTableSummary>
      </template>
    </a-table>
  </div>

  <div style="width: 100%">
    <b>固定汇总栏（fixed + 横向滚动时始终贴在底部可见）</b>
    <a-table
      :data-source="dataSource"
      row-key="id"
      :pagination="false"
      size="small"
      bordered
      :scroll="{ x: 720 }"
      style="width: 100%">
      <TmTableColumn data-index="product" title="商品" key="product" :width="180" />
      <TmTableColumn data-index="price" title="单价" key="price" align="right" :width="180" />
      <TmTableColumn data-index="qty" title="数量" key="qty" align="right" :width="180" />
      <template #summary>
        <!-- fixed 为真时，汇总栏被抽出到表格底部独立渲染，横向滚动时保持可见 -->
        <TmTableSummary fixed>
          <TmTableSummaryRow>
            <TmTableSummaryCell :index="0">合计</TmTableSummaryCell>
            <TmTableSummaryCell :index="1" align="right" />
            <TmTableSummaryCell :index="2" align="right">{{ total }}</TmTableSummaryCell>
          </TmTableSummaryRow>
        </TmTableSummary>
      </template>
    </a-table>
  </div>
</template>
