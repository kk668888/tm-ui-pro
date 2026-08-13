<!-- packages/ui/src/components/statistic/src/Statistic.vue -->
<!--
  TmStatistic 薄封装组件：ant Statistic 统计数值
  核心机制：
  1. ant 原生透传：value / formatter / precision / prefix / suffix / title 等原样下发
  2. 公司默认：无（ant 原生 format 等兜底）
  3. 动态插槽全透传（prefix / suffix / title / formatter / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Statistic as AStatistic } from 'ant-design-vue'
import type { TmStatisticProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Statistic 实例类型（ant 未导出 StatisticInstance，用 InstanceType 推导） */
type StatisticInstance = InstanceType<typeof AStatistic>

defineOptions({ name: 'TmStatistic', inheritAttrs: false })

/** 组件 props：TmStatisticProps = StatisticProps（无公司默认） */
const props = defineProps<TmStatisticProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Statistic 实例 */
const { innerRef, exposed } = useForwardRef<StatisticInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AStatistic ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AStatistic>
</template>
