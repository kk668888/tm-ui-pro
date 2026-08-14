<!-- packages/ui/src/components/upload/src/Upload.vue -->
<!--
  TmUpload 薄封装组件：ant Upload 透传 + 受控 fileList（v-model:file-list）+ beforeUpload 校验透传
  核心机制：
  1. 受控 fileList：fileList prop 透传给 ant（受控模式），ant 变更经 update:fileList 事件转发给父
  2. beforeUpload 透传：业务上传前校验（返回 false / 拒绝 Promise 即拦截，ant 原生语义，公司不假设上传服务）
  3. showUploadList 默认 true 兜底（复合类型陷阱，见 defaults 注释）
  4. slots 全透传（default 触发元素 / listItem）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Upload as AUpload } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue/es/upload'
import type { TmUploadProps } from './props'
import { tmUploadDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Upload 实例类型（ant 未导出 UploadInstance，用 InstanceType 推导） */
type UploadInstance = InstanceType<typeof AUpload>

defineOptions({ name: 'TmUpload', inheritAttrs: false })

/** 组件 props：TmUploadProps = UploadProps；showUploadList 公司默认 true 兜底 */
const props = withDefaults(defineProps<TmUploadProps>(), {
  showUploadList: tmUploadDefaults.showUploadList,
})

/** v-model:file-list 双向：转发 ant 的 update:fileList 事件给父组件 */
const emit = defineEmits<{
  (e: 'update:fileList', v: UploadFile[]): void
}>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Upload 实例 */
const { innerRef, exposed } = useForwardRef<UploadInstance>()
defineExpose(exposed)

/**
 * 合并透传对象：$attrs + 公司默认 + 业务显式 props（过滤幻影 false，见 useForwardBindings）。
 * onUpdate:fileList 排除：模板已用 @update:file-list 显式绑定（经 emit 转发给父），
 * 若 $attrs 里的父监听器再透传会被 Vue 合并成数组监听器，ant onInternalChange 调 .call 崩溃。
 */
const forwardBindings = useForwardBindings(props, ['showUploadList'], ['onUpdate:fileList'])
</script>

<template>
  <AUpload
ref="innerRef" v-bind="forwardBindings"
    @update:file-list="(v: UploadFile[]) => emit('update:fileList', v)">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AUpload>
</template>
