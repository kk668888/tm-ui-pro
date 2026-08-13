<!-- packages/ui/src/components/segmented/demos/basic.vue -->
<!-- TmSegmented 基础演示：分段控制器（受控 value） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSegmented } from '../index'

const value = ref('周')
const options = ['日', '周', '月']
</script>

<template>
  <div style="width: 100%">
    <p>基础分段（受控 value = {{ value }}）</p>
    <TmSegmented v-model:value="value" :options="options" />
    <p style="margin-top: 16px">带禁用项的分段</p>
    <TmSegmented
      :options="[{ label: '启用', value: 'on' }, { label: '禁用', value: 'off', disabled: true }]"
    />
  </div>
</template>
