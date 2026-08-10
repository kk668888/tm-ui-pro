<!-- packages/ui/src/components/switch/demos/basic.vue -->
<!-- TmSwitch 基础演示：v-model 布尔受控 + checkedChildren 插槽 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSwitch } from '../index'

const checked = ref(false)
</script>

<template>
  <TmSwitch v-model="checked" checked-children="开" un-checked-children="关" />
  <p>当前值：{{ checked }}</p>
</template>
