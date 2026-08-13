<!-- packages/ui/src/components/list/src/ListItem.vue -->
<!--
  TmListItem 薄封装组件：ant List.Item 列表项
  核心机制：
  1. ant 原生透传：actions / extra 等原样下发（通常配合 TmList 的 #renderItem 使用）
  2. 公司默认：无
  3. 动态插槽全透传（actions / extra / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { ListItem as AListItem } from 'ant-design-vue'
import type { TmListItemProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant List.Item 实例类型（用 InstanceType 推导） */
type ListItemInstance = InstanceType<typeof AListItem>

defineOptions({ name: 'TmListItem', inheritAttrs: false })

/** 组件 props：TmListItemProps = ListItemProps（无公司默认） */
const props = defineProps<TmListItemProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant List.Item 实例 */
const { innerRef, exposed } = useForwardRef<ListItemInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AListItem ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AListItem>
</template>
