<!-- packages/ui/src/components/breadcrumb/src/BreadcrumbItem.vue -->
<!--
  TmBreadcrumbItem 薄封装组件：ant Breadcrumb.Item 面包屑项
  核心机制：
  1. ant 原生透传：href / separator 等原样下发
  2. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { BreadcrumbItem as ABreadcrumbItem } from 'ant-design-vue'
import type { TmBreadcrumbItemProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Breadcrumb.Item 实例类型（ant 未导出 BreadcrumbItemInstance，用 InstanceType 推导） */
type BreadcrumbItemInstance = InstanceType<typeof ABreadcrumbItem>

defineOptions({ name: 'TmBreadcrumbItem', inheritAttrs: false })

/** 组件 props：TmBreadcrumbItemProps = BreadcrumbItemProps（无公司默认） */
const props = defineProps<TmBreadcrumbItemProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Breadcrumb.Item 实例 */
const { innerRef, exposed } = useForwardRef<BreadcrumbItemInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ABreadcrumbItem ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ABreadcrumbItem>
</template>
