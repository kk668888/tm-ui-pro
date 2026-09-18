<!-- packages/ui/src/components/month-picker/demos/basic.vue -->
<!--
  TmMonthPicker 详细演示：
  1. 字符串模式：v-model + value-format（业务侧只拿到字符串，不碰 Dayjs）
  2. 展示格式与占位：format / placeholder，并演示关闭一键清空
  3. 只读：readonly 锁死面板（弹层不可打开、禁止清空）
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmMonthPicker } from '../index'

/** 案例 1：字符串模式（账期等业务字段推荐） */
const billingMonth = ref('2026-09')

/** 案例 2：展示格式定制 + 关闭清空 */
const planMonth = ref('')

/** 案例 3：只读 */
const readonlyMonth = ref('2026-08')
</script>

<template>
  <div>
    <b>基础用法（字符串模式 value-format="YYYY-MM"）</b>
    <TmMonthPicker v-model="billingMonth" value-format="YYYY-MM" placeholder="请选择账期" style="width: 200px" />
    <p>当前值：{{ billingMonth || '空' }}（类型为 string）</p>
  </div>

  <div>
    <b>展示格式与占位（format + placeholder + 关闭一键清空）</b>
    <TmMonthPicker
      v-model="planMonth"
      value-format="YYYY-MM"
      format="YYYY 年 MM 月"
      placeholder="生效月份"
      :allow-clear="false"
      style="width: 200px" />
    <p>当前值：{{ planMonth || '空' }}</p>
  </div>

  <div>
    <b>只读（readonly 锁死面板，值可见不可改）</b>
    <TmMonthPicker v-model="readonlyMonth" value-format="YYYY-MM" readonly style="width: 200px" />
  </div>
</template>
