<!-- packages/ui/src/components/grid/src/Col.vue -->
<!--
  TmCol 薄封装组件：ant Col 栅格列
  核心机制：
  1. ant 原生透传：span / offset / order / flex / push / pull 及 xs~xxl 响应式断点
  2. 无公司默认值：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Col as ACol } from 'ant-design-vue'
import type { TmColProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Col 实例类型（ant 未导出 ColInstance，用 InstanceType 推导） */
type ColInstance = InstanceType<typeof ACol>

defineOptions({ name: 'TmCol', inheritAttrs: false })

/** 组件 props：TmColProps = ColProps（无公司默认） */
const props = defineProps<TmColProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Col 实例 */
const { innerRef, exposed } = useForwardRef<ColInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ACol ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACol>
</template>
