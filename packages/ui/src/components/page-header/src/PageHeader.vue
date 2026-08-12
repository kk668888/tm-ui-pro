<!-- packages/ui/src/components/page-header/src/PageHeader.vue -->
<!--
  TmPageHeader 薄封装组件：ant PageHeader 页头
  核心机制：
  1. ant 原生透传：title / subTitle / backIcon / tags / extra / avatar / onBack 原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. slots 全透传（default / title / subTitle / tags / extra / avatar / backIcon）+ useForwardRef
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { PageHeader as APageHeader } from 'ant-design-vue'
import type { TmPageHeaderProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant PageHeader 实例类型（ant 未导出 PageHeaderInstance，用 InstanceType 推导） */
type PageHeaderInstance = InstanceType<typeof APageHeader>

defineOptions({ name: 'TmPageHeader', inheritAttrs: false })

/** 组件 props：TmPageHeaderProps = PageHeaderProps（无公司默认） */
const props = defineProps<TmPageHeaderProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant PageHeader 实例 */
const { innerRef, exposed } = useForwardRef<PageHeaderInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <APageHeader ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </APageHeader>
</template>
