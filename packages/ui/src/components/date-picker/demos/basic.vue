<!-- packages/ui/src/components/date-picker/demos/basic.vue -->
<!-- TmDatePicker / TmRangePicker 基础演示：Dayjs 直通 + valueFormat 字符串模式 -->
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { TmDatePicker, TmRangePicker } from '../index'

// Dayjs 直通模式：业务直接用 Dayjs
const date = ref(dayjs('2026-08-10'))
// valueFormat 模式：业务拿字符串，组件内部转 Dayjs
const str = ref('2026-08-11')
const range = ref(['2026-08-10', '2026-08-12'] as [string, string])
</script>

<template>
  <TmDatePicker v-model="date" style="width: 240px" />
  <p>Dayjs 直通值：{{ date.format('YYYY-MM-DD') }}</p>
  <TmDatePicker v-model="str" value-format="YYYY-MM-DD" style="width: 240px" />
  <p>字符串值：{{ str }}</p>
  <TmRangePicker v-model="range" value-format="YYYY-MM-DD" style="width: 360px" />
  <p>区间字符串值：{{ range.join(' ~ ') }}</p>
</template>
