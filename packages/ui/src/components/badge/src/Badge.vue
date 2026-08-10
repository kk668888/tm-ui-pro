<!-- packages/ui/src/components/badge/src/Badge.vue -->
<!--
  TmBadge 薄封装组件：ant Badge 纯透传
  核心机制：
  1. ant 原生全透传：count / status / dot / overflowCount / showZero 等原样下发
  2. 无公司扩展键；公司默认（若有）经 defaults.ts 统一来源
  3. slots 全透传（default 包裹内容 / count 插槽）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Badge as ABadge } from 'ant-design-vue'
import type { TmBadgeProps } from './props'
import { tmBadgeDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'

/** ant Badge 实例类型（ant 未导出 BadgeInstance，用 InstanceType 推导） */
type BadgeInstance = InstanceType<typeof ABadge>

defineOptions({ name: 'TmBadge', inheritAttrs: false })

/** 组件 props：TmBadgeProps = BadgeProps；公司默认经 defaults.ts（当前为空） */
const props = withDefaults(defineProps<TmBadgeProps>(), {
  ...tmBadgeDefaults,
})

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Badge 实例 */
const { innerRef, exposed } = useForwardRef<BadgeInstance>()
defineExpose(exposed)

/** 合并透传对象：$attrs + ant 原生 props（单一 v-bind） */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...props,
}))
</script>

<template>
  <ABadge ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ABadge>
</template>
