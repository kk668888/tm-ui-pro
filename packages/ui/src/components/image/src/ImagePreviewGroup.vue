<!-- packages/ui/src/components/image/src/ImagePreviewGroup.vue -->
<!--
  TmImagePreviewGroup 薄封装组件：ant Image.PreviewGroup 图片预览组
  核心机制：
  1. ant PreviewGroup 通过 provide/inject 为子 TmImage 提供预览上下文（非遍历子项 vnode），
     模板 slot 转发即可，子项仍能正常注册到预览组
  2. 公司默认：无（ant 原生 preview 配置兜底）
  3. default 插槽透传（子项为 TmImage）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { ImagePreviewGroup as AImagePreviewGroup } from 'ant-design-vue'
import type { TmImagePreviewGroupProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Image.PreviewGroup 实例类型（用 InstanceType 推导） */
type ImagePreviewGroupInstance = InstanceType<typeof AImagePreviewGroup>

defineOptions({ name: 'TmImagePreviewGroup', inheritAttrs: false })

/** 组件 props：TmImagePreviewGroupProps（preview 本地类型，无公司默认） */
const props = defineProps<TmImagePreviewGroupProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Image.PreviewGroup 实例 */
const { innerRef, exposed } = useForwardRef<ImagePreviewGroupInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AImagePreviewGroup ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AImagePreviewGroup>
</template>
