<!-- packages/ui/src/components/drawer/demos/basic.vue -->
<!-- TmDrawer 组件式基础演示：v-model 控制开关 + placement/width 透传 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmButton } from '../../button'
import { TmDrawer } from '../index'

const open = ref(false)
</script>

<template>
  <TmButton type="primary" @click="open = true">打开抽屉</TmButton>
  <TmDrawer v-model="open" title="基础抽屉" placement="right" :width="400">
    <p>抽屉内容，支持任意插槽与 ant Drawer 全部 props / events。</p>
  </TmDrawer>
</template>
