<!-- packages/ui/src/components/upload/demos/basic.vue -->
<!-- TmUpload 基础演示：受控 fileList + beforeUpload 校验拦截 -->
<script setup lang="ts">
import { ref } from 'vue'
import { UploadOutlined } from '@ant-design/icons-vue'
import { Upload as AUpload } from 'ant-design-vue'
import { TmUpload } from '../index'
import { TmButton } from '../../button'
import { TmMessage } from '../../message'
import type { UploadFile } from 'ant-design-vue/es/upload'

const fileList = ref<UploadFile[]>([])

/**
 * 上传前校验：超过 1MB 拦截并提示。
 * 关键点：仅 `return false` 只会拦掉 POST 请求，文件仍会以无状态条目进入列表
 * （ant 对 beforeUpload 拒绝的文件有「repeat onChange」兼容分支）。必须返回
 * LIST_IGNORE 哨兵（Upload.LIST_IGNORE），才能同时「不进列表 + 不发请求」。
 */
const beforeUpload = (file: UploadFile): boolean | string => {
  if (file.size && file.size > 1024 * 1024) {
    TmMessage.error('文件大小不能超过 1MB')
    return AUpload.LIST_IGNORE
  }
  return true
}
</script>

<template>
  <TmUpload v-model:file-list="fileList" :before-upload="beforeUpload" action="/api/upload">
    <TmButton>
      <template #icon><UploadOutlined /></template>
      上传文件（限制 1MB）
    </TmButton>
  </TmUpload>
</template>
