<!-- packages/ui/src/components/rate/demos/basic.vue -->
<!-- TmRate 基础演示：星级 + 半星 + 自定义 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmRate } from '../index'

const value = ref(3)
const custom = ref(4)
</script>

<template>
  <div style="width: 100%">
    <p>基础评分</p>
    <TmRate v-model:value="value" />
    <p>半星 + 可清除</p>
    <TmRate v-model:value="custom" allow-half allow-clear />
    <p>自定义字符（好评/差评文案）</p>
    <TmRate :default-value="3" character="好" :tooltips="['很差', '较差', '一般', '较好', '很好']" />
  </div>
</template>
