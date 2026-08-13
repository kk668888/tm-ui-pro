<!-- packages/ui/src/components/comment/demos/basic.vue -->
<!-- TmComment 兼容型演示：评论（上游已废弃，文档标注推荐替代） -->
<script setup lang="ts">
import { TmComment } from '../index'
import { TmAvatar } from '../../avatar/index'
</script>

<template>
  <div style="width: 100%">
    <p>兼容型评论（ant Comment 上游已废弃，建议使用 Avatar/Flex/Typography 组合替代）</p>
    <TmComment
      author="张三"
      :datetime="'2026-08-12 10:00'"
    >
      <template #avatar><TmAvatar>张</TmAvatar></template>
      <template #content>
        <p>这是一个评论内容示例。</p>
      </template>
    </TmComment>
  </div>
</template>
