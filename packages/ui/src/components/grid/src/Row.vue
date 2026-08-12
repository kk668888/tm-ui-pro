<!-- packages/ui/src/components/grid/src/Row.vue -->
<!--
  TmRow 薄封装组件：ant Row 栅格容器
  核心机制：
  1. ant 原生透传：gutter（含响应式对象）/ justify / align / wrap 等原样下发
  2. 无公司默认值：companyDefaults 传 []，缺省 Boolean 幻影值跳过
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Row as ARow } from 'ant-design-vue'
import type { TmRowProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Row 实例类型（ant 未导出 RowInstance，用 InstanceType 推导） */
type RowInstance = InstanceType<typeof ARow>

defineOptions({ name: 'TmRow', inheritAttrs: false })

/** 组件 props：TmRowProps = RowProps（无公司默认） */
const props = defineProps<TmRowProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Row 实例 */
const { innerRef, exposed } = useForwardRef<RowInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ARow ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ARow>
</template>
