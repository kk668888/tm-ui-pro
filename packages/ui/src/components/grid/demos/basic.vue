<!-- packages/ui/src/components/grid/demos/basic.vue -->
<!-- TmGrid 基础演示：TmRow / TmCol 24 栅格 + 响应式 -->
<script setup lang="ts">
import { TmRow, TmCol } from '../index'
</script>

<template>
  <!-- width:100% 兜底：DemoBlock 预览区是 flex 容器，块级栅格不设宽会被收缩到内容宽 -->
  <div style="width: 100%">
    <p>基础分列 8 / 16</p>
    <TmRow :gutter="16">
      <TmCol :span="8">
        <div style="background: #1677ff22; padding: 12px; text-align: center">span 8</div>
      </TmCol>
      <TmCol :span="16">
        <div style="background: #1677ff11; padding: 12px; text-align: center">span 16</div>
      </TmCol>
    </TmRow>
    <p>offset 偏移（8 宽左移 8）</p>
    <TmRow :gutter="16">
      <TmCol :span="8" :offset="8">
        <div style="background: #52c41a22; padding: 12px; text-align: center">span 8 offset 8</div>
      </TmCol>
      <TmCol :span="8">
        <div style="background: #52c41a11; padding: 12px; text-align: center">span 8</div>
      </TmCol>
    </TmRow>
    <p>响应式：xs=24（手机整行） md=12（平板半行）</p>
    <TmRow :gutter="16">
      <TmCol :xs="24" :md="12">
        <div style="background: #fa8c1622; padding: 12px; text-align: center">xs 24 / md 12</div>
      </TmCol>
      <TmCol :xs="24" :md="12">
        <div style="background: #fa8c1611; padding: 12px; text-align: center">xs 24 / md 12</div>
      </TmCol>
    </TmRow>
  </div>
</template>
