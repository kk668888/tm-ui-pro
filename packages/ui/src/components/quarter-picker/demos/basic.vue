<!-- packages/ui/src/components/quarter-picker/demos/basic.vue -->
<!--
  TmQuarterPicker 详细演示（契约与 TmMonthPicker 完全一致，仅面板语义为「季度」）：
  1. 字符串模式：v-model + value-format="YYYY-[Q]Q"（方括号为 dayjs 转义，输出 '2026-Q3'）
  2. 展示格式与占位：format 只影响文案，不动绑定值
  3. 只读：readonly 锁死面板
  说明：字符串初值可正常回显——ant-design-vue 在模块加载时已扩展 dayjs 所需插件
  （customParseFormat / advancedFormat），细节见文档「valueFormat 与 dayjs 插件」。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmQuarterPicker } from '../index'

/** 案例 1：字符串模式（考核周期、财报期等），初值即演示「字符串初值可回显」 */
const assessmentQuarter = ref('2026-Q3')

/** 案例 2：展示格式定制（显示「2026 年第 3 季度」，绑定值仍是 '2026-Q3'） */
const reportQuarter = ref('2026-Q3')

/** 案例 3：只读（面板不可打开、清空被关闭） */
const readonlyQuarter = ref('2026-Q3')
</script>

<template>
  <div>
    <b>基础用法（字符串模式 value-format="YYYY-[Q]Q"）</b>
    <TmQuarterPicker
      v-model="assessmentQuarter"
      value-format="YYYY-[Q]Q"
      placeholder="请选择季度"
      style="width: 200px" />
    <p>当前值：{{ assessmentQuarter || '空' }}（形如 2026-Q3）</p>
  </div>

  <div>
    <b>展示格式与占位（format + placeholder）</b>
    <TmQuarterPicker
      v-model="reportQuarter"
      value-format="YYYY-[Q]Q"
      format="YYYY 年第 Q 季度"
      placeholder="财报季度"
      style="width: 200px" />
    <p>当前值：{{ reportQuarter || '空' }}（绑定值不受 format 影响）</p>
  </div>

  <div>
    <b>只读（readonly 锁死面板）</b>
    <TmQuarterPicker v-model="readonlyQuarter" value-format="YYYY-[Q]Q" readonly style="width: 200px" />
  </div>
</template>
