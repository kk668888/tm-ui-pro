<!-- packages/ui/src/components/modal/demos/basic.vue -->
<!-- TmModal 组件式基础演示：v-model 控制开关 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmButton } from '../../button'
import { TmModal } from '../index'

const open = ref(false)
</script>

<template>
  <TmButton type="primary" @click="open = true">打开弹窗</TmButton>
  <TmModal v-model="open" title="基础弹窗" @ok="open = false" @cancel="open = false">
    <p>弹窗内容，支持任意插槽与 ant Modal 全部 props / events。</p>
  </TmModal>
</template>
