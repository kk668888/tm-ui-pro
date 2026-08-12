<!-- packages/ui/src/components/popconfirm/demos/basic.vue -->
<!-- TmPopconfirm 基础演示：默认确认文案 + 危险确认 + 显式文案覆盖 -->
<script setup lang="ts">
import { TmPopconfirm } from '../index'
import { TmButton } from '../../button'
import { TmMessage } from '../../message'
</script>

<template>
  <div class="popconfirm-demo">
    <TmPopconfirm title="确定删除该记录吗？" danger @confirm="() => TmMessage.success('已删除')">
      <TmButton type="primary" danger>危险删除</TmButton>
    </TmPopconfirm>
    <TmPopconfirm title="这是一条普通确认" @confirm="() => TmMessage.success('已确认')">
      <TmButton>普通确认</TmButton>
    </TmPopconfirm>
    <TmPopconfirm title="自定义按钮文案" ok-text="提交" cancel-text="返回"
      @confirm="() => TmMessage.success('已提交')">
      <TmButton>自定义文案</TmButton>
    </TmPopconfirm>
  </div>
</template>

<style scoped>
.popconfirm-demo {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
