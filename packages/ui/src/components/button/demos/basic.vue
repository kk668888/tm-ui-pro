<!-- packages/ui/src/components/button/demos/basic.vue -->
<!-- TmButton 基础演示：默认按钮 / 防抖 / 二次确认 -->
<script setup lang="ts">
import { TmButton } from '../index'

// 演示用 click handler，实际业务在表单提交/接口调用场景替换
const handleClick = () => {}
</script>

<template>
  <TmButton @click="handleClick">默认按钮</TmButton>
  <TmButton :debounce="300" @click="handleClick">防抖 300ms</TmButton>
  <TmButton confirm="确定删除吗？" danger @click="handleClick">删除</TmButton>
</template>
