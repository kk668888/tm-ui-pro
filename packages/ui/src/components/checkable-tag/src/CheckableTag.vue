<!-- packages/ui/src/components/checkable-tag/src/CheckableTag.vue -->
<!--
  TmCheckableTag 薄封装组件：ant Tag.CheckableTag（顶层导出 CheckableTag）+ v-model:checked 桥接
  核心机制：
  1. v-model:checked 双向：checked prop 透传（受控），ant 的 update:checked 经模板
     @update:checked 显式绑定转发为 update:checked emit（TmUpload 的 fileList 桥接同模式）
  2. change 事件透传：ant 同时 emit change(checked)，走 $attrs 自动透传，业务可直接 @change
  3. onUpdate:checked 从透传对象剔除：模板显式绑定是唯一通道，$attrs 转发会合并成
     数组监听器导致 ant 内部 .call 崩溃（同 TmUpload onUpdate:fileList 教训）
  4. default 插槽透传（标签文案）
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { CheckableTag as ACheckableTag } from 'ant-design-vue'
import type { TmCheckableTagProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant CheckableTag 实例类型（ant 未导出实例类型，用 InstanceType 推导） */
type CheckableTagInstance = InstanceType<typeof ACheckableTag>

defineOptions({ name: 'TmCheckableTag', inheritAttrs: false })

const props = defineProps<TmCheckableTagProps>()

/** v-model:checked 桥接事件 */
const emit = defineEmits<{
  (e: 'update:checked', v: boolean): void
}>()

const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可访问内部 ant CheckableTag 实例 */
const { innerRef, exposed } = useForwardRef<CheckableTagInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props；onUpdate:checked 剔除（模板显式绑定唯一通道） */
const forwardBindings = useForwardBindings(props, [], ['onUpdate:checked'])
</script>

<template>
  <ACheckableTag
    ref="innerRef"
    v-bind="forwardBindings"
    @update:checked="(v: boolean) => emit('update:checked', v)">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACheckableTag>
</template>
