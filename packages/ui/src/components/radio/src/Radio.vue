<!-- packages/ui/src/components/radio/src/Radio.vue -->
<!--
  TmRadio 薄封装组件：ant Radio 单选框
  核心机制：
  1. ant 原生透传：checked / value / disabled / onChange 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传（选项文案）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Radio as ARadio } from 'ant-design-vue'
import type { TmRadioProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Radio 实例类型（ant 未导出 RadioInstance，用 InstanceType 推导） */
type RadioInstance = InstanceType<typeof ARadio>

defineOptions({ name: 'TmRadio', inheritAttrs: false })

/** 组件 props：TmRadioProps = RadioProps（无公司默认） */
const props = defineProps<TmRadioProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Radio 实例 */
const { innerRef, exposed } = useForwardRef<RadioInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ARadio ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ARadio>
</template>
