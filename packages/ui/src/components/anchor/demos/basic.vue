<!-- packages/ui/src/components/anchor/demos/basic.vue -->
<!-- TmAnchor 基础演示：锚点导航 -->
<script setup lang="ts">
import { TmAnchor, TmAnchorLink } from '../index'
</script>

<template>
  <div style="width: 100%">
    <TmAnchor :affix="false">
      <TmAnchorLink href="#sec1" title="章节一" />
      <TmAnchorLink href="#sec2" title="章节二">
        <TmAnchorLink href="#sec2-1" title="小节 2.1" />
        <TmAnchorLink href="#sec2-2" title="小节 2.2" />
      </TmAnchorLink>
      <TmAnchorLink href="#sec3" title="章节三" />
    </TmAnchor>
    <div style="height: 600px" />
  </div>
</template>
