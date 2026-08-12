<!-- packages/ui/src/components/layout/src/Footer.vue -->
<!--
  TmFooter 薄封装组件：ant Layout.Footer 页脚区域
  核心机制：
  1. ant 原生透传：属性透传
  2. 无公司默认值：companyDefaults 传 []
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { LayoutFooter as AFooter } from 'ant-design-vue'
import type { TmFooterProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Layout.Footer 实例类型（ant 未导出 FooterInstance，用 InstanceType 推导） */
type FooterInstance = InstanceType<typeof AFooter>

defineOptions({ name: 'TmFooter', inheritAttrs: false })

/** 组件 props：TmFooterProps = LayoutProps 结构（无公司默认） */
const props = defineProps<TmFooterProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Layout.Footer 实例 */
const { innerRef, exposed } = useForwardRef<FooterInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AFooter ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFooter>
</template>
