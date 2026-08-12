<!-- packages/ui/src/components/breadcrumb/src/Breadcrumb.vue -->
<!--
  TmBreadcrumb 薄封装组件：ant Breadcrumb 面包屑
  核心机制：
  1. ant 原生透传：routes / params / separator / itemRender 原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Breadcrumb as ABreadcrumb } from 'ant-design-vue'
import type { TmBreadcrumbProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Breadcrumb 实例类型（ant 未导出 BreadcrumbInstance，用 InstanceType 推导） */
type BreadcrumbInstance = InstanceType<typeof ABreadcrumb>

defineOptions({ name: 'TmBreadcrumb', inheritAttrs: false })

/** 组件 props：TmBreadcrumbProps = BreadcrumbProps（无公司默认） */
const props = defineProps<TmBreadcrumbProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Breadcrumb 实例 */
const { innerRef, exposed } = useForwardRef<BreadcrumbInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ABreadcrumb ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ABreadcrumb>
</template>
