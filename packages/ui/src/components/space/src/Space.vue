<!-- packages/ui/src/components/space/src/Space.vue -->
<!--
  TmSpace 薄封装组件：ant Space + 公司默认间距规范
  核心机制：
  1. size 公司默认 'middle'（withDefaults 兜底 + companyDefaults 显式转发），业务传值覆盖
  2. ant 原生透传：align / direction / wrap / split 等原样下发
  3. slots 全透传（default / split）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Space as ASpace } from 'ant-design-vue'
import type { TmSpaceProps } from './props'
import { tmSpaceDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Space 实例类型（ant 未导出 SpaceInstance，用 InstanceType 推导） */
type SpaceInstance = InstanceType<typeof ASpace>

defineOptions({ name: 'TmSpace', inheritAttrs: false })

/** 组件 props：TmSpaceProps = SpaceProps + split 扩展；size 公司默认 'middle' 兜底 */
const props = withDefaults(defineProps<TmSpaceProps>(), tmSpaceDefaults)

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Space 实例 */
const { innerRef, exposed } = useForwardRef<SpaceInstance>()
defineExpose(exposed)

/**
 * split 扩展键：ant 的 split 是具名插槽（prop 形式会被静默忽略）。
 * 业务显式 #split 插槽时以插槽为准；否则用 split prop 值渲染为插槽内容。
 * split 从透传对象剔除，避免泄漏为内部 div 的 HTML 属性。
 */
const hasSplitSlot = slotNames.includes('split')
const splitAsProp = computed(() => (hasSplitSlot ? undefined : props.split))

/** 透传对象：$attrs + 公司默认 size + 业务显式 props（幻影 false 跳过；split 剔除） */
const forwardBindings = useForwardBindings(props, ['size'], ['split'])
</script>

<template>
  <ASpace ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
    <template v-if="splitAsProp !== undefined" #split>{{ splitAsProp }}</template>
  </ASpace>
</template>
