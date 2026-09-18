<!-- packages/ui/src/components/timeline/demos/item-children.vue -->
<!--
  TmTimelineItem 详细演示（模板子组件写法）：
  1. 基础：在 <TmTimeline> 内用 <TmTimelineItem> 声明条目
  2. label 时间标签 + color 自定义颜色
  3. dot 插槽自定义节点 + pending 进行中条目
  说明：TmTimelineItem 与原生 <a-timeline-item> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import { TmTimeline, TmTimelineItem } from '../index'
</script>

<template>
  <div>
    <b>基础用法（模板子组件写法）</b>
    <TmTimeline>
      <TmTimelineItem color="green">创建服务</TmTimelineItem>
      <TmTimelineItem color="red">初步排查</TmTimelineItem>
      <TmTimelineItem>技术评审</TmTimelineItem>
      <TmTimelineItem color="gray">发布上线</TmTimelineItem>
    </TmTimeline>
  </div>

  <div>
    <b>时间标签 label + 自定义颜色</b>
    <TmTimeline mode="left">
      <TmTimelineItem label="2026-09-01" color="blue">提交变更申请</TmTimelineItem>
      <TmTimelineItem label="2026-09-02" color="orange">评审通过</TmTimelineItem>
      <TmTimelineItem label="2026-09-03">合并主干</TmTimelineItem>
    </TmTimeline>
  </div>

  <div>
    <b>dot 插槽自定义节点 + pending 进行中</b>
    <TmTimeline pending="录制中...">
      <TmTimelineItem>脚本准备</TmTimelineItem>
      <TmTimelineItem color="red">
        <template #dot><span style="font-size: 12px">●</span></template>
        试讲
      </TmTimelineItem>
      <TmTimelineItem>正式录制</TmTimelineItem>
    </TmTimeline>
  </div>
</template>
