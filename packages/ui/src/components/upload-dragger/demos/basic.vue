<!-- packages/ui/src/components/upload-dragger/demos/basic.vue -->
<!--
  TmUploadDragger 详细演示：
  1. 基础拖拽区：v-model:file-list 受控文件列表 + action 上传地址
  2. 上传前校验：beforeUpload 拦截超限文件（必须返回 LIST_IGNORE 哨兵）
  3. 禁用态：disabled 整体不可点击/拖拽
-->
<script setup lang="ts">
import { ref } from 'vue'
import { Upload as AUpload } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue/es/upload'
import { TmUploadDragger } from '../index'
import { TmMessage } from '../../message'

/** 案例 1：受控文件列表（父组件持有，v-model:file-list 双向同步） */
const fileList = ref<UploadFile[]>([])

/** 案例 2：仅允许图片且不超过 1MB 的文件列表 */
const imageList = ref<UploadFile[]>([])

/** 案例 3：禁用态的文件列表 */
const disabledList = ref<UploadFile[]>([])

/**
 * 上传前校验：超过 1MB 拦截并提示。
 * 关键点：仅 `return false` 只会拦掉 POST 请求，文件仍会以无状态条目进入列表；
 * 必须返回 LIST_IGNORE 哨兵（Upload.LIST_IGNORE），才能同时「不进列表 + 不发请求」。
 */
function beforeUpload(file: UploadFile): boolean | string {
  if (file.size && file.size > 1024 * 1024) {
    TmMessage.error('文件大小不能超过 1MB')
    return AUpload.LIST_IGNORE
  }
  return true
}
</script>

<template>
  <div>
    <b>基础用法（拖拽或点击上传，v-model:file-list 受控）</b>
    <TmUploadDragger v-model:file-list="fileList" action="/api/upload" style="max-width: 420px">
      <p class="ant-upload-text">点击或拖拽文件到此区域上传</p>
    </TmUploadDragger>
    <p>已选文件数：{{ fileList.length }}</p>
  </div>

  <div>
    <b>上传前校验（accept 限图片 + beforeUpload 限 1MB）</b>
    <TmUploadDragger
      v-model:file-list="imageList"
      action="/api/upload"
      accept="image/*"
      multiple
      :before-upload="beforeUpload"
      style="max-width: 420px">
      <p class="ant-upload-text">仅支持图片，单文件不超过 1MB（可多选）</p>
    </TmUploadDragger>
    <p>已选文件数：{{ imageList.length }}</p>
  </div>

  <div>
    <b>禁用态</b>
    <TmUploadDragger v-model:file-list="disabledList" action="/api/upload" disabled style="max-width: 420px">
      <p class="ant-upload-text">当前不可上传</p>
    </TmUploadDragger>
  </div>
</template>
