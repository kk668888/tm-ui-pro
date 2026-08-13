<!-- packages/ui/src/components/calendar/demos/basic.vue -->
<!-- TmCalendar 基础演示：日历（受控 value + 月份卡片） -->
<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { TmCalendar } from '../index'

const value = ref(dayjs())
</script>

<template>
  <div style="width: 100%">
    <p>基础日历（受控 value，非全屏卡片式）</p>
    <TmCalendar v-model:value="value" :fullscreen="false" />
  </div>
</template>
