<!-- packages/ui/src/components/menu/src/MenuDivider.vue -->
<!--
  TmMenuDivider 薄封装组件：ant Menu.Divider 菜单分隔线
  核心机制：
  1. ant 原生透传（无实质 props）
  2. useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { MenuDivider as AMenuDivider } from 'ant-design-vue'
import type { TmMenuDividerProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Menu.Divider 实例类型（ant 未导出 MenuDividerInstance，用 InstanceType 推导） */
type MenuDividerInstance = InstanceType<typeof AMenuDivider>

defineOptions({ name: 'TmMenuDivider', inheritAttrs: false })

/** 组件 props：TmMenuDividerProps = MenuDividerProps（无公司默认） */
const props = defineProps<TmMenuDividerProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Menu.Divider 实例 */
const { innerRef, exposed } = useForwardRef<MenuDividerInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AMenuDivider ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AMenuDivider>
</template>
