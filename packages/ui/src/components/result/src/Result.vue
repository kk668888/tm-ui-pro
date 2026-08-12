<!-- packages/ui/src/components/result/src/Result.vue -->
<!--
  TmResult 薄封装组件：ant Result 纯透传
  核心机制：
  1. ant 原生透传：status / title / subTitle / extra / icon 等原样下发
  2. slots 全透传（title / subTitle / extra / icon）+ useForwardRef 方法透传
  3. 无 Boolean 陷阱：ant Result 无可覆盖默认 true 的 Boolean prop，无需 withDefaults 兜底
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Result as AResult } from 'ant-design-vue'
import type { TmResultProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'

/** ant Result 实例类型（ant 未导出 ResultInstance，用 InstanceType 推导） */
type ResultInstance = InstanceType<typeof AResult>

defineOptions({ name: 'TmResult', inheritAttrs: false })

/** 组件 props：TmResultProps = ResultProps（无公司默认覆盖） */
const props = defineProps<TmResultProps>()

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Result 实例 */
const { innerRef, exposed } = useForwardRef<ResultInstance>()
defineExpose(exposed)

/** 合并透传对象：$attrs + ant 原生 props（单一 v-bind） */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...props,
}))
</script>

<template>
  <AResult ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AResult>
</template>
