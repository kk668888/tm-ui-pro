<!-- packages/ui/src/components/affix/demos/basic.vue -->
<!-- TmAffix 基础演示：顶部固定 -->
<script setup lang="ts">
import { TmAffix } from '../index'
import { TmButton } from '../../button'
</script>

<template>
  <div style="width: 100%">
    <TmAffix :offset-top="100">
      <TmButton type="primary">固定操作区（滚动可见）</TmButton>
    </TmAffix>
    <p style="height: 800px">向下滚动查看固定效果</p>
  </div>
</template>
