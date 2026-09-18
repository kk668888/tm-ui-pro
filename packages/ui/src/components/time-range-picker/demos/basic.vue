<!-- packages/ui/src/components/time-range-picker/demos/basic.vue -->
<!--
  TmTimeRangePicker 详细演示（区间值成对桥接）：
  1. 基础区间：v-model 绑定 [起, 止]，value-format 后两侧均为字符串
  2. 秒级精度 + 步进：format="HH:mm:ss" / minuteStep，并演示关闭一键清空
  3. 只读：readonly 锁死面板（起止两个输入框同时不可交互）
  说明：字符串初值可正常回显——ant-design-vue 在模块加载时已扩展 dayjs 的
  customParseFormat 插件。注意绑定串必须与 valueFormat 完全匹配（`HH:mm:ss` 的初值
  不能只写到分钟，否则该侧解析失败显示空白），细节见文档「valueFormat 与 dayjs 插件」。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTimeRangePicker } from '../index'

/** 案例 1：分钟级区间（排班、统计时段等），初值即演示「字符串初值可回显」 */
const workTime = ref<[string, string] | null>(['09:00', '18:00'])

/** 案例 2：秒级精度（初值同样带秒，与 value-format 对齐） */
const preciseTime = ref<[string, string] | null>(['09:30:00', '18:00:00'])

/** 案例 3：只读 */
const readonlyTime = ref<[string, string] | null>(['09:00', '18:00'])
</script>

<template>
  <div>
    <b>基础用法（区间值 [起, 止]，value-format="HH:mm"）</b>
    <TmTimeRangePicker v-model="workTime" value-format="HH:mm" style="width: 260px" />
    <p>当前值：{{ workTime ? workTime.join(' ~ ') : '空' }}（类型为 [string, string]）</p>
  </div>

  <div>
    <b>秒级精度与步进（format="HH:mm:ss" + minuteStep）</b>
    <TmTimeRangePicker
      v-model="preciseTime"
      value-format="HH:mm:ss"
      format="HH:mm:ss"
      :minute-step="5"
      :allow-clear="false"
      :placeholder="['开始时间', '结束时间']"
      style="width: 300px" />
    <p>当前值：{{ preciseTime ? preciseTime.join(' ~ ') : '空' }}</p>
  </div>

  <div>
    <b>只读（readonly 锁死面板）</b>
    <TmTimeRangePicker v-model="readonlyTime" value-format="HH:mm" readonly style="width: 260px" />
  </div>
</template>
