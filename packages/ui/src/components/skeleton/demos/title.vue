<!-- packages/ui/src/components/skeleton/demos/title.vue -->
<!--
  TmSkeletonTitle 详细演示：
  1. 在 ant 骨架容器内组合使用（复现标准骨架视觉）
  2. 独立使用（仅有结构，不带骨架底色）
  说明：与原生 <a-skeleton-title> 是同一组件对象（别名复用），行为完全一致。
  它主要供「自定义骨架组合」场景使用——在骨架容器里替代默认的标题条占位。
-->
<script setup lang="ts">
import { TmSkeletonTitle } from '../index'
</script>

<template>
  <div>
    <b>骨架容器内组合使用（带骨架底色）</b>
    <!-- ant 骨架容器的内部结构类：用于在自定义组合中复现骨架视觉 -->
    <div class="ant-skeleton">
      <div class="ant-skeleton-content">
        <TmSkeletonTitle :width="'60%'" />
        <TmSkeletonTitle :width="180" style="margin-top: 8px" />
      </div>
    </div>
  </div>

  <div>
    <b>独立使用（仅结构，不带骨架底色）</b>
    <TmSkeletonTitle :width="120" />
  </div>
</template>
