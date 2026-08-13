<!-- packages/ui/src/components/list/src/ListItemMeta.vue -->
<!--
  TmListItemMeta 薄封装组件：ant List.Item.Meta 列表项元信息
  核心机制：
  1. ant 原生透传：avatar / title / description 等原样下发（通常配合 TmListItem 使用）
  2. 公司默认：无
  3. 动态插槽全透传（avatar / title / description）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { ListItemMeta as AListItemMeta } from 'ant-design-vue'
import type { TmListItemMetaProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant List.Item.Meta 实例类型（用 InstanceType 推导） */
type ListItemMetaInstance = InstanceType<typeof AListItemMeta>

defineOptions({ name: 'TmListItemMeta', inheritAttrs: false })

/** 组件 props：TmListItemMetaProps = ListItemMetaProps（无公司默认） */
const props = defineProps<TmListItemMetaProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant List.Item.Meta 实例 */
const { innerRef, exposed } = useForwardRef<ListItemMetaInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AListItemMeta ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AListItemMeta>
</template>
