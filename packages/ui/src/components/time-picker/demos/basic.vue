<!-- packages/ui/src/components/time-picker/demos/basic.vue -->
<!-- TmTimePicker 基础演示：value-format 字符串模式 + 默认 Dayjs 模式 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTimePicker } from '../index'

// 字符串模式（业务零 Dayjs 依赖）
const timeStr = ref('09:30:00')
// Dayjs 直通模式
const timeDayjs = ref<string | null>(null)
</script>

<template>
  <div class="time-picker-demo">
    <div class="row">
      <span class="label">字符串模式：</span>
      <TmTimePicker v-model="timeStr" value-format="HH:mm:ss" placeholder="选择时间" />
      <span class="value">{{ timeStr }}</span>
    </div>
    <div class="row">
      <span class="label">分钟步进：</span>
      <TmTimePicker v-model="timeStr" value-format="HH:mm" format="HH:mm" :minute-step="5" />
    </div>
  </div>
</template>

<style scoped>
.time-picker-demo .row {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
}
.time-picker-demo .label {
  width: 90px;
  color: rgba(0, 0, 0, 0.65);
}
.time-picker-demo .value {
  color: rgba(0, 0, 0, 0.88);
  font-family: monospace;
}
</style>
