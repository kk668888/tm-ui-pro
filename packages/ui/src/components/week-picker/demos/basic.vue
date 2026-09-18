<!-- packages/ui/src/components/week-picker/demos/basic.vue -->
<!--
  TmWeekPicker 详细演示（契约与 TmMonthPicker 完全一致，仅面板语义为「周」）：
  1. 字符串模式：v-model + value-format="YYYY-ww"（ww = 两位周序号，输出如 '2026-36'）
  2. 展示格式与占位：format 只影响文案，不动绑定值
  3. 只读：readonly 锁死面板
  说明：字符串初值可正常回显——ant-design-vue 在模块加载时已扩展 dayjs 所需插件
  （customParseFormat / advancedFormat / weekOfYear），细节见文档「valueFormat 与 dayjs 插件」。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmWeekPicker } from '../index'

/** 案例 1：字符串模式（排期、周报周期等），初值即演示「字符串初值可回显」 */
const scheduleWeek = ref('2026-36')

/** 案例 2：展示格式定制（面板与输入框显示「2026 第 36 周」，绑定值仍是 '2026-36'） */
const reportWeek = ref('2026-36')

/** 案例 3：只读（面板不可打开、清空被关闭） */
const readonlyWeek = ref('2026-36')
</script>

<template>
  <div>
    <b>基础用法（字符串模式 value-format="YYYY-ww"）</b>
    <TmWeekPicker v-model="scheduleWeek" value-format="YYYY-ww" placeholder="请选择周" style="width: 200px" />
    <p>当前值：{{ scheduleWeek || '空' }}（形如 2026-36，表示 2026 年第 36 周）</p>
  </div>

  <div>
    <b>展示格式与占位（format + placeholder）</b>
    <TmWeekPicker
      v-model="reportWeek"
      value-format="YYYY-ww"
      format="YYYY 第 ww 周"
      placeholder="周报所属周"
      style="width: 220px" />
    <p>当前值：{{ reportWeek || '空' }}（绑定值不受 format 影响）</p>
  </div>

  <div>
    <b>只读（readonly 锁死面板）</b>
    <TmWeekPicker v-model="readonlyWeek" value-format="YYYY-ww" readonly style="width: 200px" />
  </div>
</template>
