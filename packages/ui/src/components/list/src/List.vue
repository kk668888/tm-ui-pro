<!-- packages/ui/src/components/list/src/List.vue -->
<!--
  TmList 薄封装组件：ant List 列表
  核心机制：
  1. ant 原生透传：dataSource / renderItem / pagination / loading / grid / header / footer 等原样下发
  2. 公司默认：无（ant 原生分页 / 空态等兜底）
  3. 动态插槽全透传（renderItem 带 { item, index } / header / footer / loadMore / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { List as AList } from 'ant-design-vue'
import type { TmListProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant List 实例类型（ant 未导出 ListInstance，用 InstanceType 推导） */
type ListInstance = InstanceType<typeof AList>

defineOptions({ name: 'TmList', inheritAttrs: false })

/** 组件 props：TmListProps = ListProps（无公司默认） */
const props = defineProps<TmListProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant List 实例 */
const { innerRef, exposed } = useForwardRef<ListInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过，loading 缺省不覆盖 ant 默认） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AList ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AList>
</template>
