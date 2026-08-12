<!-- packages/ui/src/components/steps/demos/basic.vue -->
<!-- TmSteps 交互演示：上一步 / 下一步 切换当前步骤 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSteps, TmStep } from '../index'
import { TmButton } from '../../button'

const current = ref(0)
const next = () => {
  if (current.value < 2) current.value += 1
}
const prev = () => {
  if (current.value > 0) current.value -= 1
}
</script>

<template>
  <div style="width: 100%">
    <TmSteps :current="current">
      <TmStep title="第一步" description="填写信息" />
      <TmStep title="第二步" description="确认提交" />
      <TmStep title="第三步" description="完成" />
    </TmSteps>
    <div style="margin-top: 16px">
      <TmButton :disabled="current === 0" style="margin-right: 8px" @click="prev">上一步</TmButton>
      <TmButton type="primary" :disabled="current === 2" @click="next">下一步</TmButton>
      <span v-if="current === 2" style="margin-left: 8px; color: #52c41a">已完成</span>
    </div>
  </div>
</template>
