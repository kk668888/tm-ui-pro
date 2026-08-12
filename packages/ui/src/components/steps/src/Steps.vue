<!-- packages/ui/src/components/steps/src/Steps.vue -->
<!--
  TmSteps 薄封装组件：ant Steps 步骤条
  核心机制：
  1. ant 原生透传：type / current / status / direction / size / items 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Steps as ASteps } from 'ant-design-vue'
import type { TmStepsProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Steps 实例类型（ant 未导出 StepsInstance，用 InstanceType 推导） */
type StepsInstance = InstanceType<typeof ASteps>

defineOptions({ name: 'TmSteps', inheritAttrs: false })

/** 组件 props：TmStepsProps = StepsProps（无公司默认） */
const props = defineProps<TmStepsProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Steps 实例 */
const { innerRef, exposed } = useForwardRef<StepsInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ASteps ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASteps>
</template>
