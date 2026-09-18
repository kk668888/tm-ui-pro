<!-- packages/ui/src/components/upload-dragger/src/UploadDragger.vue -->
<!--
  TmUploadDragger 薄封装组件：ant Upload.Dragger（拖拽上传区），与 TmUpload 同契约
  核心机制（照 upload/src/Upload.vue 逐机制对应）：
  1. 受控 fileList：fileList prop 透传给 ant（受控模式），ant 变更经 update:fileList 转发给父
  2. showUploadList 默认 true 兜底（复合类型陷阱，见 upload/src/defaults.ts 注释）
  3. beforeUpload / accept / multiple 等原生能力 $attrs 透传
  4. onUpdate:fileList 从透传对象剔除（模板显式绑定唯一通道，数组监听器崩溃教训同 TmUpload）
  5. slots 全透传（default 拖拽提示区 / listItem）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { UploadDragger as AUploadDragger } from 'ant-design-vue'
import type { UploadFile } from 'ant-design-vue/es/upload'
import type { UploadProps } from 'ant-design-vue'
import { tmUploadDefaults } from '../../upload/src/defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant UploadDragger 实例类型（ant 未导出实例类型，用 InstanceType 推导） */
type UploadDraggerInstance = InstanceType<typeof AUploadDragger>

defineOptions({ name: 'TmUploadDragger', inheritAttrs: false })

/** 组件 props：UploadProps；showUploadList 公司默认 true 兜底 */
const props = withDefaults(defineProps<UploadProps>(), {
  showUploadList: tmUploadDefaults.showUploadList,
})

/** v-model:file-list 双向：转发 ant 的 update:fileList 事件给父组件 */
const emit = defineEmits<{
  (e: 'update:fileList', v: UploadFile[]): void
}>()

const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant UploadDragger 实例 */
const { innerRef, exposed } = useForwardRef<UploadDraggerInstance>()
defineExpose(exposed)

/**
 * 合并透传对象：$attrs + 公司默认 + 业务显式 props（过滤幻影 false）。
 * onUpdate:fileList 排除：模板已用 @update:file-list 显式绑定（经 emit 转发给父），
 * $attrs 里的父监听器再透传会被合并成数组监听器（同 TmUpload 教训）。
 */
const forwardBindings = useForwardBindings(props, ['showUploadList'], ['onUpdate:fileList'])
</script>

<template>
  <AUploadDragger
    ref="innerRef"
    v-bind="forwardBindings"
    @update:file-list="(v: UploadFile[]) => emit('update:fileList', v)">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AUploadDragger>
</template>
