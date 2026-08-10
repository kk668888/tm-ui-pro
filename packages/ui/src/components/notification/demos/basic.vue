<!-- packages/ui/src/components/notification/demos/basic.vue -->
<!-- TmNotification 命令式交互 demo：点击按钮触发右上角通知 -->
<script setup lang="ts">
import { TmButton } from '../../button'
import { TmNotification } from '../index'

function show(type: 'success' | 'info' | 'warning' | 'error'): void {
  if (type === 'success') TmNotification.success({ message: '任务完成', description: '导出已就绪，可查看结果' })
  if (type === 'info') TmNotification.info({ message: '系统升级', description: '今晚 02:00-04:00' })
  if (type === 'warning') TmNotification.warning({ message: '磁盘不足', description: '已使用 90%' })
  if (type === 'error') TmNotification.error({ message: '任务失败', description: '请重试' })
}
</script>

<template>
  <TmButton type="primary" @click="show('success')">成功</TmButton>
  <TmButton @click="show('info')">信息</TmButton>
  <TmButton @click="show('warning')">警告</TmButton>
  <TmButton danger @click="show('error')">错误</TmButton>
</template>
