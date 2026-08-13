<!-- packages/ui/src/components/float-button/src/FloatButtonBackTop.vue -->
<!--
  TmFloatButtonBackTop 薄封装组件：ant FloatButton.BackTop 返回顶部浮动按钮
  核心机制：
  1. 承接能力：React 生态的 antd v5 已移除独立 BackTop，由 FloatButton.BackTop 承载；
     本库基于 ant-design-vue 4.2.6，仍保留独立 BackTop 顶层导出（与 FloatButton.BackTop 等价），
     本组件直接包装它，业务从 TmBackTop（若存在）迁移到本组件即可
  2. ant 原生透传：target / visibilityHeight / onClick / duration 等原样下发
  3. 动态插槽全透传（default / icon / description 等）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { BackTop as ABackTop } from 'ant-design-vue'
import type { TmFloatButtonBackTopProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant FloatButton.BackTop 实例类型（用 InstanceType 推导） */
type FloatButtonBackTopInstance = InstanceType<typeof ABackTop>

defineOptions({ name: 'TmFloatButtonBackTop', inheritAttrs: false })

/** 组件 props：TmFloatButtonBackTopProps = BackTopProps（无公司默认） */
const props = defineProps<TmFloatButtonBackTopProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant FloatButton.BackTop 实例 */
const { innerRef, exposed } = useForwardRef<FloatButtonBackTopInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ABackTop ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ABackTop>
</template>
