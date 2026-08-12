<!-- packages/ui/src/components/layout/demos/basic.vue -->
<!-- TmLayout 基础演示：标准页骨架 + 侧边栏布局 -->
<script setup lang="ts">
import { TmLayout, TmSider, TmHeader, TmContent, TmFooter } from '../index'
</script>

<template>
  <!-- width:100% 兜底：DemoBlock 预览区是 flex 容器，块级布局若不设宽会被收缩到内容宽 -->
  <div style="width: 100%">
    <p>标准页骨架</p>
    <TmLayout style="width: 100%; border: 1px solid #f0f0f0">
      <TmHeader style="background: #1677ff22; padding: 16px">Header 头部</TmHeader>
      <TmContent style="background: #fafafa; padding: 16px">Content 内容</TmContent>
      <TmFooter style="background: #f0f0f0; padding: 16px; text-align: center">Footer 页脚</TmFooter>
    </TmLayout>
    <p>侧边栏布局</p>
    <TmLayout style="width: 100%; border: 1px solid #f0f0f0">
      <TmSider width="160" style="background: #001529; color: #fff; padding: 16px">Sider 菜单</TmSider>
      <TmLayout>
        <TmHeader style="background: #1677ff22; padding: 16px">Header</TmHeader>
        <TmContent style="background: #fafafa; padding: 16px">Content</TmContent>
      </TmLayout>
    </TmLayout>
  </div>
</template>
