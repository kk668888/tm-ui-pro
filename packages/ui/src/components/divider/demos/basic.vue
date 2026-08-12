<!-- packages/ui/src/components/divider/demos/basic.vue -->
<!-- TmDivider 基础演示：公司默认 horizontal + 业务覆盖 -->
<script setup lang="ts">
import { TmDivider } from '../index'
</script>

<template>
  <div>
    <p>公司默认分割线（horizontal + center 文案）</p>
    <TmDivider>分割文案</TmDivider>
    <p>左对齐文案 orientation=left</p>
    <TmDivider orientation="left">左对齐</TmDivider>
    <p>虚线 dashed</p>
    <TmDivider dashed>虚线分割</TmDivider>
    <p>垂直分割线 type=vertical</p>
    <span>左</span>
    <TmDivider type="vertical" />
    <span>右</span>
  </div>
</template>
