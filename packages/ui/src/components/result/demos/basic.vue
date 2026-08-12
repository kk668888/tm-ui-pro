<!-- packages/ui/src/components/result/demos/basic.vue -->
<!-- TmResult 基础演示：状态页 + 自定义操作区 -->
<script setup lang="ts">
import { TmResult } from '../index'
import { TmButton } from '../../button'
</script>

<template>
  <div class="result-demo">
    <TmResult status="success" title="操作成功" sub-title="提交成功，等待审核。">
      <template #extra>
        <TmButton type="primary">返回首页</TmButton>
        <TmButton>再提交一次</TmButton>
      </template>
    </TmResult>
    <TmResult status="404" title="页面不存在" sub-title="抱歉，你访问的页面不存在或已被移除。" />
  </div>
</template>

<style scoped>
.result-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
