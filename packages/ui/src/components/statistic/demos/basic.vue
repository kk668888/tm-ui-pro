<!-- packages/ui/src/components/statistic/demos/basic.vue -->
<!-- TmStatistic 基础演示：统计数值 + 倒计时 -->
<script setup lang="ts">
import { TmStatistic, TmCountdown } from '../index'

const deadline = Date.now() + 1000 * 60 * 60 * 2
</script>

<template>
  <div style="width: 100%">
    <p>统计数值（前后缀 + 千分位）</p>
    <div style="display: flex; gap: 32px; flex-wrap: wrap">
      <TmStatistic title="总销售额" :value="112893.12" :precision="2">
        <template #prefix>¥</template>
      </TmStatistic>
      <TmStatistic title="活跃用户" :value="112893">
        <template #suffix>人</template>
      </TmStatistic>
    </div>
    <p style="margin-top: 16px">倒计时</p>
    <TmCountdown title="活动剩余" :value="deadline" format="HH:mm:ss" />
  </div>
</template>
