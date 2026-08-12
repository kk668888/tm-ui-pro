<!-- packages/ui/src/components/steps/src/Step.vue -->
<!--
  TmStep 薄封装组件：ant Steps.Step 步骤项
  核心机制：
  1. ant 原生透传：title / description / status / icon 等原样下发
  2. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Step as AStep } from 'ant-design-vue'
import type { TmStepProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Steps.Step 实例类型（ant 未导出 StepInstance，用 InstanceType 推导） */
type StepInstance = InstanceType<typeof AStep>

defineOptions({ name: 'TmStep', inheritAttrs: false })

/** 组件 props：TmStepProps = StepProps（无公司默认） */
const props = defineProps<TmStepProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Steps.Step 实例 */
const { innerRef, exposed } = useForwardRef<StepInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AStep ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AStep>
</template>
