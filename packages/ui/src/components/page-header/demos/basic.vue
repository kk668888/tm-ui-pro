<!-- packages/ui/src/components/page-header/demos/basic.vue -->
<!-- TmPageHeader 基础演示：页头 + 操作区 -->
<script setup lang="ts">
import { TmPageHeader } from '../index'
import { TmButton } from '../../button'
</script>

<template>
  <div style="width: 100%">
    <TmPageHeader title="页面标题" sub-title="页面副标题" @back="() => console.log('back')">
      <template #extra>
        <TmButton>次要操作</TmButton>
        <TmButton type="primary">主要操作</TmButton>
      </template>
      <p>页头下方的页面内容区域。</p>
    </TmPageHeader>
  </div>
</template>
