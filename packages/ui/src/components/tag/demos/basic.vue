<!-- packages/ui/src/components/tag/demos/basic.vue -->
<!-- TmTag 基础演示：status 状态映射 + 显式 color 覆盖 -->
<script setup lang="ts">
import { TmTag } from '../index'
</script>

<template>
  <TmTag status="success">成功</TmTag>
  <TmTag status="processing">进行中</TmTag>
  <TmTag status="failed">失败</TmTag>
  <TmTag status="warning">警告</TmTag>
  <TmTag color="purple">自定义色</TmTag>
</template>
