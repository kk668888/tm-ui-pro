<!-- packages/ui/src/components/collapse/demos/basic.vue -->
<!-- TmCollapse 基础演示：折叠面板（render function 转发 TmCollapsePanel） -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmCollapse, TmCollapsePanel } from '../index'

const activeKey = ref<string[]>(['1'])
</script>

<template>
  <div style="width: 100%">
    <p>基础折叠（受控 activeKey + 面板 disabled）</p>
    <TmCollapse v-model:active-key="activeKey" style="width: 100%">
      <TmCollapsePanel key="1" header="面板 A">
        <p>面板 A 内容</p>
      </TmCollapsePanel>
      <TmCollapsePanel key="2" header="面板 B">
        <p>面板 B 内容</p>
      </TmCollapsePanel>
      <TmCollapsePanel key="3" header="面板 C（禁用）" disabled>
        <p>禁用面板内容</p>
      </TmCollapsePanel>
    </TmCollapse>
  </div>
</template>
