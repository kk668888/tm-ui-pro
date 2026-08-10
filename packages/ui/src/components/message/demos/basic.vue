<!-- packages/ui/src/components/message/demos/basic.vue -->
<!-- TmMessage 命令式交互 demo：点击按钮触发全局消息 -->
<script setup lang="ts">
import { TmButton } from '../../button'
import { TmMessage } from '../index'

function show(type: 'success' | 'info' | 'warning' | 'error' | 'loading'): void {
  if (type === 'success') TmMessage.success('保存成功')
  if (type === 'info') TmMessage.info('这是一条信息提示')
  if (type === 'warning') TmMessage.warning('磁盘空间不足')
  if (type === 'error') TmMessage.error('操作失败，请重试')
  if (type === 'loading') {
    const close = TmMessage.loading('加载中...')
    setTimeout(close, 2000)
  }
}
</script>

<template>
  <TmButton type="primary" @click="show('success')">成功</TmButton>
  <TmButton @click="show('info')">信息</TmButton>
  <TmButton @click="show('warning')">警告</TmButton>
  <TmButton danger @click="show('error')">错误</TmButton>
  <TmButton @click="show('loading')">加载</TmButton>
</template>
