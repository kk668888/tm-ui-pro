<!-- packages/ui/src/components/modal/demos/confirm.vue -->
<!-- TmModal 命令式交互 demo：点击按钮弹出确认对话框 -->
<script setup lang="ts">
import { TmButton } from '../../button'
import { TmModal } from '../index'
import { TmMessage } from '../../message'

function confirmDelete(): void {
  TmModal.confirm({
    title: '确认删除',
    content: '删除后不可恢复，是否继续？',
    onOk() {
      TmMessage.success('已删除')
    },
  })
}
</script>

<template>
  <TmButton type="primary" danger @click="confirmDelete">命令式确认弹窗</TmButton>
</template>
