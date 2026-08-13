<!-- packages/ui/src/components/statistic/src/Countdown.vue -->
<!--
  TmCountdown 薄封装组件：ant Statistic.Countdown 倒计时
  核心机制：
  1. ant 原生透传：value / format / onFinish / onChange 等原样下发
     —— 注意 ant 顶层导出名为 StatisticCountdown（components.js: StatisticCountdown），这里别名引用
  2. 公司默认：无（ant 原生 format 'HH:mm:ss' 等兜底）
  3. 动态插槽全透传（prefix / suffix / title / formatter / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { StatisticCountdown as AStatisticCountdown } from 'ant-design-vue'
import type { TmCountdownProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Statistic.Countdown 实例类型（用 InstanceType 推导） */
type CountdownInstance = InstanceType<typeof AStatisticCountdown>

defineOptions({ name: 'TmCountdown', inheritAttrs: false })

/** 组件 props：TmCountdownProps = CountdownProps（无公司默认） */
const props = defineProps<TmCountdownProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Statistic.Countdown 实例 */
const { innerRef, exposed } = useForwardRef<CountdownInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，loading 缺省不覆盖 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AStatisticCountdown ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AStatisticCountdown>
</template>
