<!-- packages/ui/src/components/menu/src/MenuItem.vue -->
<!--
  TmMenuItem 薄封装组件：ant Menu.Item 菜单项
  核心机制：
  1. ant 原生透传：key / disabled / danger / icon 等原样下发
  2. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { getCurrentInstance, useSlots } from 'vue'
import { MenuItem as AMenuItem } from 'ant-design-vue'
import type { TmMenuItemProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Menu.Item 实例类型（ant 未导出 MenuItemInstance，用 InstanceType 推导） */
type MenuItemInstance = InstanceType<typeof AMenuItem>

defineOptions({ name: 'TmMenuItem', inheritAttrs: false })

/** 组件 props：TmMenuItemProps = MenuItemProps（无公司默认） */
const props = defineProps<TmMenuItemProps>()

// 关键：ant MenuItem 用 instance.vnode.key 读自身 key 注册/选中（Menu.js child.key + MenuItem.js vnode.key）。
// 业务在 <TmMenuItem key="a"> 上的 vnode key 不会自动传导到内部 AMenuItem，须显式转发，
// 否则 AMenuItem 的 key 为 undefined，ant Menu 的选中态失效（多项同时高亮，Bug 2026-08-12）。
const vnodeKey = getCurrentInstance()?.vnode.key ?? undefined

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Menu.Item 实例 */
const { innerRef, exposed } = useForwardRef<MenuItemInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AMenuItem :key="vnodeKey" ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AMenuItem>
</template>
