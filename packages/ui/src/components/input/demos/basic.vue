<!-- packages/ui/src/components/input/demos/basic.vue -->
<!-- TmInput 基础演示：v-model 受控用法 + 公司默认（allowClear/size） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInput } from '../index'

// 业务侧标准 v-model：自动绑定 modelValue + update:modelValue
const v = ref('')
</script>

<template>
  <TmInput v-model="v" placeholder="请输入" />
  <p>当前值：{{ v }}</p>
</template>
