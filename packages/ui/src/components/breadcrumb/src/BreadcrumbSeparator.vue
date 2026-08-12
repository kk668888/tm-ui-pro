<!-- packages/ui/src/components/breadcrumb/src/BreadcrumbSeparator.vue -->
<!--
  TmBreadcrumbSeparator 薄封装组件：ant Breadcrumb.Separator 分隔符
  核心机制：
  1. default 插槽透传（自定义分隔符内容）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { BreadcrumbSeparator as ABreadcrumbSeparator } from 'ant-design-vue'
import type { TmBreadcrumbSeparatorProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Breadcrumb.Separator 实例类型（ant 未导出 BreadcrumbSeparatorInstance，用 InstanceType 推导） */
type BreadcrumbSeparatorInstance = InstanceType<typeof ABreadcrumbSeparator>

defineOptions({ name: 'TmBreadcrumbSeparator', inheritAttrs: false })

/** 组件 props：TmBreadcrumbSeparatorProps = BreadcrumbSeparatorProps（无公司默认） */
const props = defineProps<TmBreadcrumbSeparatorProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Breadcrumb.Separator 实例 */
const { innerRef, exposed } = useForwardRef<BreadcrumbSeparatorInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ABreadcrumbSeparator ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ABreadcrumbSeparator>
</template>
