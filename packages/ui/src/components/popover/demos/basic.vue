<!-- packages/ui/src/components/popover/demos/basic.vue -->
<!-- TmPopover 基础演示：标题 + 内容 + 触发方式 -->
<script setup lang="ts">
import { TmPopover } from '../index'
import { TmButton } from '../../button'
</script>

<template>
  <div class="popover-demo">
    <TmPopover title="标题" content="这里是气泡卡片内容，可放说明文字或操作。">
      <TmButton>悬停显示</TmButton>
    </TmPopover>
    <TmPopover title="点击触发" trigger="click">
      <template #content>
        <div>自定义 content 插槽</div>
      </template>
      <TmButton>点击显示</TmButton>
    </TmPopover>
  </div>
</template>

<style scoped>
.popover-demo {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
