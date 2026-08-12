<!-- packages/ui/src/components/checkbox/demos/basic.vue -->
<!-- TmCheckbox 基础演示：单复选框 + 半选态 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmCheckbox } from '../index'

const checked = ref(false)
const indeterminate = ref(false)
</script>

<template>
  <div style="width: 100%">
    <p>单复选框（v-model:checked）</p>
    <TmCheckbox v-model:checked="checked">同意用户协议</TmCheckbox>
    <p>半选态（indeterminate）</p>
    <TmCheckbox v-model:checked="indeterminate" indeterminate>部分选中</TmCheckbox>
    <p>禁用</p>
    <TmCheckbox :checked="true" disabled>只读勾选</TmCheckbox>
  </div>
</template>
