<!-- packages/ui/src/components/spin/demos/basic.vue -->
<!-- TmSpin 基础演示：加载态切换 + 包裹内容 -->
<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { TmSpin } from '../index'

const loading = ref(true)
onMounted(() => {
  setTimeout(() => {
    loading.value = false
  }, 2000)
})
</script>

<template>
  <TmSpin :spinning="loading" tip="加载中...">
    <div class="spin-content">
      <h4>业务内容区域</h4>
      <p>加载完成（2 秒后）此区域恢复显示。</p>
    </div>
  </TmSpin>
</template>

<style scoped>
.spin-content {
  padding: 24px;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  min-height: 120px;
}
</style>
