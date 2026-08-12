<!-- packages/ui/src/components/divider/src/Divider.vue -->
<!--
  TmDivider 薄封装组件：ant Divider + 公司视觉默认
  核心机制：
  1. type / orientation 公司默认兜底（horizontal + center，withDefaults + companyDefaults 显式转发）
  2. ant 原生透传：dashed / plain / orientationMargin 等原样下发
  3. default 插槽文案透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Divider as ADivider } from 'ant-design-vue'
import type { TmDividerProps } from './props'
import { tmDividerDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Divider 实例类型（ant 未导出 DividerInstance，用 InstanceType 推导） */
type DividerInstance = InstanceType<typeof ADivider>

defineOptions({ name: 'TmDivider', inheritAttrs: false })

/** 组件 props：TmDividerProps = DividerProps；type/orientation 公司默认兜底 */
const props = withDefaults(defineProps<TmDividerProps>(), tmDividerDefaults)

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Divider 实例 */
const { innerRef, exposed } = useForwardRef<DividerInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 公司默认 + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, ['type', 'orientation'])
</script>

<template>
  <ADivider ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ADivider>
</template>
