<!-- packages/ui/src/components/menu/src/MenuItemGroup.vue -->
<!--
  TmMenuItemGroup 薄封装组件：ant Menu.ItemGroup 菜单分组
  核心机制：
  1. ant 原生透传：title 等原样下发
  2. default 插槽透传（组内菜单项）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { MenuItemGroup as AMenuItemGroup } from 'ant-design-vue'
import type { TmMenuItemGroupProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Menu.ItemGroup 实例类型（ant 未导出 MenuItemGroupInstance，用 InstanceType 推导） */
type MenuItemGroupInstance = InstanceType<typeof AMenuItemGroup>

defineOptions({ name: 'TmMenuItemGroup', inheritAttrs: false })

/** 组件 props：TmMenuItemGroupProps = MenuItemGroupProps（无公司默认） */
const props = defineProps<TmMenuItemGroupProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Menu.ItemGroup 实例 */
const { innerRef, exposed } = useForwardRef<MenuItemGroupInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AMenuItemGroup ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AMenuItemGroup>
</template>
