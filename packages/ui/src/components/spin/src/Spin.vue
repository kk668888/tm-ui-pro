<!-- packages/ui/src/components/spin/src/Spin.vue -->
<!--
  TmSpin 薄封装组件：ant Spin 纯透传 + spinning 默认 true 兜底
  核心机制：
  1. spinning 默认 true（Boolean 陷阱兜底，见 defaults 注释）
  2. ant 原生透传：size / tip / delay / indicator 等原样下发
  3. slots 全透传（default 包裹内容）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Spin as ASpin } from 'ant-design-vue'
import type { TmSpinProps } from './props'
import { tmSpinDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'

/** ant Spin 实例类型（ant 未导出 SpinInstance，用 InstanceType 推导） */
type SpinInstance = InstanceType<typeof ASpin>

defineOptions({ name: 'TmSpin', inheritAttrs: false })

/** 组件 props：TmSpinProps = SpinProps；spinning 公司默认 true 兜底 */
const props = withDefaults(defineProps<TmSpinProps>(), {
  spinning: tmSpinDefaults.spinning,
})

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Spin 实例 */
const { innerRef, exposed } = useForwardRef<SpinInstance>()
defineExpose(exposed)

/** 合并透传对象：$attrs + 含公司默认的 ant 原生 props（单一 v-bind） */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...props,
}))
</script>

<template>
  <ASpin ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASpin>
</template>
