<!-- packages/ui/src/components/badge/demos/basic.vue -->
<!-- TmBadge 基础演示：count / overflowCount / status 状态点 -->
<script setup lang="ts">
import { TmBadge } from '../index'
</script>

<template>
  <TmBadge :count="5"><span>通知</span></TmBadge>
  <TmBadge :count="150" :overflow-count="99"><span>邮件</span></TmBadge>
  <TmBadge status="processing"><span>运行中</span></TmBadge>
</template>
