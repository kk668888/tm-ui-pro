<!-- packages/ui/src/components/skeleton/demos/basic.vue -->
<!-- TmSkeleton 基础演示：加载骨架 + 子组件组合 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSkeleton, TmSkeletonAvatar, TmSkeletonButton, TmSkeletonImage, TmSkeletonInput } from '../index'

const loading = ref(true)
</script>

<template>
  <div style="width: 100%">
    <p>基础骨架屏（loading 切换 + 子组件组合）</p>
    <TmSkeleton v-if="loading" :active="true" avatar :paragraph="{ rows: 3 }" />
    <template v-else>
      <div>加载完成后的真实内容</div>
    </template>
    <p style="margin-top: 16px">Skeleton 子组件（头像 / 按钮 / 输入框 / 图片占位）</p>
    <div style="display: flex; gap: 12px; align-items: center">
      <TmSkeletonAvatar />
      <TmSkeletonButton />
      <TmSkeletonInput style="width: 200px" />
      <TmSkeletonImage style="width: 120px; height: 80px" />
    </div>
  </div>
</template>
