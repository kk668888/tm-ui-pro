<!-- packages/ui/src/components/timeline/demos/basic.vue -->
<!-- TmTimeline 基础演示：时间轴（children 使用 ant 原生 TimelineItem，见 design Non-Goals） -->
<script setup lang="ts">
import { TimelineItem } from 'ant-design-vue'
import { TmTimeline } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础时间轴（子项为 ant TimelineItem）</p>
    <TmTimeline style="width: 100%">
      <TimelineItem>创建服务 2026-08-12 10:00</TimelineItem>
      <TimelineItem color="green">发布 v1.0.0</TimelineItem>
      <TimelineItem>完成联调</TimelineItem>
    </TmTimeline>
  </div>
</template>
