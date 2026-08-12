<!-- packages/ui/src/components/rate/src/Rate.vue -->
<!--
  TmRate 薄封装组件：ant Rate 评分
  核心机制：
  1. ant 原生透传：count / allowHalf / allowClear / character / tooltips 等原样下发
  2. 无公司默认：companyDefaults 传 []
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Rate as ARate } from 'ant-design-vue'
import type { TmRateProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Rate 实例类型（ant 未导出 RateInstance，用 InstanceType 推导） */
type RateInstance = InstanceType<typeof ARate>

defineOptions({ name: 'TmRate', inheritAttrs: false })

/** 组件 props：TmRateProps = RateProps（无公司默认） */
const props = defineProps<TmRateProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Rate 实例 */
const { innerRef, exposed } = useForwardRef<RateInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ARate ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ARate>
</template>
