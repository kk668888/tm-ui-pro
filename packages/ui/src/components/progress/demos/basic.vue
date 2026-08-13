<!-- packages/ui/src/components/progress/demos/basic.vue -->
<!-- TmProgress 基础演示：业务 status 语义映射（success / processing / failed / warning） -->
<script setup lang="ts">
import { TmProgress } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础进度（业务 status 语义映射，无需手写 ant 状态值）</p>
    <TmProgress :percent="30" />
    <TmProgress :percent="55" status="success" />
    <TmProgress :percent="72" status="processing" />
    <TmProgress :percent="45" status="warning" />
    <TmProgress :percent="88" status="failed" />
  </div>
</template>
