<!-- packages/ui/src/components/tabs/demos/basic.vue -->
<!-- TmTabs 基础演示：基础标签 + 卡片式 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTabs, TmTabPane } from '../index'

const active = ref('a')
</script>

<template>
  <div style="width: 100%">
    <p>基础标签</p>
    <TmTabs v-model:activeKey="active">
      <TmTabPane key="a" tab="标签A"><p>内容 A</p></TmTabPane>
      <TmTabPane key="b" tab="标签B"><p>内容 B</p></TmTabPane>
      <TmTabPane key="c" tab="标签C"><p>内容 C</p></TmTabPane>
    </TmTabs>
    <p>卡片式</p>
    <TmTabs type="card">
      <TmTabPane key="x" tab="卡片一"><p>卡片内容一</p></TmTabPane>
      <TmTabPane key="y" tab="卡片二"><p>卡片内容二</p></TmTabPane>
    </TmTabs>
  </div>
</template>
