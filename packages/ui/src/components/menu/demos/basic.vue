<!-- packages/ui/src/components/menu/demos/basic.vue -->
<!-- TmMenu 基础演示：横向 + 纵向菜单 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmMenu, TmMenuItem } from '../index'

const items = [
  { key: 'nav', label: '导航一' },
  { key: 'sub', label: '子菜单', children: [{ key: 'sub1', label: '选项1' }, { key: 'sub2', label: '选项2' }] },
  { key: 'nav2', label: '导航二' },
]
const selected = ref('nav')
</script>

<template>
  <div style="width: 100%">
    <p>横向菜单（items 配置）</p>
    <TmMenu :selected-keys="[selected]" mode="horizontal" :items="items" @click="(e: any) => (selected = e.key)" />
    <p>纵向内联菜单（子组件形式）</p>
    <TmMenu mode="inline" style="width: 256px">
      <TmMenuItem key="a">菜单项 A</TmMenuItem>
      <TmMenuItem key="b">菜单项 B</TmMenuItem>
    </TmMenu>
  </div>
</template>
