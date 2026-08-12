<!-- packages/ui/src/components/pagination/src/Pagination.vue -->
<!--
  TmPagination 薄封装组件：ant Pagination + 公司分页默认
  核心机制：
  1. showSizeChanger 默认 true + pageSizeOptions 默认 [10,20,50]（与 TmTable 对齐），业务覆盖
  2. ant 原生透传：total / current / pageSize / showTotal / showQuickJumper 等原样下发
  3. useForwardBindings 消幻影 false + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Pagination as APagination } from 'ant-design-vue'
import type { TmPaginationProps } from './props'
import { tmPaginationDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Pagination 实例类型（ant 未导出 PaginationInstance，用 InstanceType 推导） */
type PaginationInstance = InstanceType<typeof APagination>

defineOptions({ name: 'TmPagination', inheritAttrs: false })

/** 组件 props：TmPaginationProps = PaginationProps；公司默认兜底 */
const props = withDefaults(defineProps<TmPaginationProps>(), tmPaginationDefaults)

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Pagination 实例 */
const { innerRef, exposed } = useForwardRef<PaginationInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 公司默认 + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, ['showSizeChanger', 'pageSizeOptions'])
</script>

<template>
  <APagination ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </APagination>
</template>
