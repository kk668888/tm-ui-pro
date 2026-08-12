<!-- packages/ui/src/components/checkbox/src/Checkbox.vue -->
<!--
  TmCheckbox 薄封装组件：ant Checkbox 单复选框
  核心机制：
  1. ant 原生透传：checked / value / indeterminate / disabled / onChange 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传（选项文案）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Checkbox as ACheckbox } from 'ant-design-vue'
import type { TmCheckboxProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Checkbox 实例类型（ant 未导出 CheckboxInstance，用 InstanceType 推导） */
type CheckboxInstance = InstanceType<typeof ACheckbox>

defineOptions({ name: 'TmCheckbox', inheritAttrs: false })

/** 组件 props：TmCheckboxProps = CheckboxProps（无公司默认） */
const props = defineProps<TmCheckboxProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Checkbox 实例 */
const { innerRef, exposed } = useForwardRef<CheckboxInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ACheckbox ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACheckbox>
</template>
