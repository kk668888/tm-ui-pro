<!-- packages/ui/src/components/tree/demos/basic.vue -->
<!-- TmTree 基础演示：treeData 配置 + 可勾选 + 目录树 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTree, TmDirectoryTree } from '../index'

const treeData = [
  { key: '0-0', title: '公司', children: [
    { key: '0-0-0', title: '技术部' },
    { key: '0-0-1', title: '产品部' },
  ]},
]
const checked = ref<string[]>([])
</script>

<template>
  <div style="width: 100%">
    <p>基础树（treeData）</p>
    <TmTree :tree-data="treeData" default-expand-all style="max-width: 400px" />
    <p>可勾选树（v-model:checkedKeys）</p>
    <TmTree v-model:checkedKeys="checked" :tree-data="treeData" checkable default-expand-all style="max-width: 400px" />
    <p>目录树</p>
    <TmDirectoryTree :tree-data="treeData" default-expand-all style="max-width: 400px" />
  </div>
</template>
