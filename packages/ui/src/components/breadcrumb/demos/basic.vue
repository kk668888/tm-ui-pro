<!-- packages/ui/src/components/breadcrumb/demos/basic.vue -->
<!-- TmBreadcrumb 基础演示：默认分隔符 + 自定义分隔符 -->
<script setup lang="ts">
import { TmBreadcrumb, TmBreadcrumbItem } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>默认分隔符（/）</p>
    <TmBreadcrumb>
      <TmBreadcrumbItem>首页</TmBreadcrumbItem>
      <TmBreadcrumbItem>列表</TmBreadcrumbItem>
      <TmBreadcrumbItem>详情</TmBreadcrumbItem>
    </TmBreadcrumb>
    <p>自定义分隔符 separator="&gt;"</p>
    <TmBreadcrumb separator=">">
      <TmBreadcrumbItem>首页</TmBreadcrumbItem>
      <TmBreadcrumbItem>列表</TmBreadcrumbItem>
    </TmBreadcrumb>
  </div>
</template>
