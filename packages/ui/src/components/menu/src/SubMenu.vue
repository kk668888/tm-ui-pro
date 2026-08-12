<!-- packages/ui/src/components/menu/src/SubMenu.vue -->
<!--
  TmSubMenu 薄封装组件：ant Menu.SubMenu 子菜单
  核心机制：
  1. ant 原生透传：key / title / icon / popupClassName 等原样下发
  2. default 插槽透传（子菜单项）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { getCurrentInstance, useSlots } from 'vue'
import { SubMenu as ASubMenu } from 'ant-design-vue'
import type { TmSubMenuProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Menu.SubMenu 实例类型（ant 未导出 SubMenuInstance，用 InstanceType 推导） */
type SubMenuInstance = InstanceType<typeof ASubMenu>

defineOptions({ name: 'TmSubMenu', inheritAttrs: false })

/** 组件 props：TmSubMenuProps = SubMenuProps（无公司默认） */
const props = defineProps<TmSubMenuProps>()

// 关键：ant SubMenu 用 instance.vnode.key 读自身 key（同 MenuItem），须从 <TmSubMenu key="x">
// 的 vnode key 显式转发到内部 ASubMenu，否则 key 为 undefined、子菜单状态失效。
const vnodeKey = getCurrentInstance()?.vnode.key

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Menu.SubMenu 实例 */
const { innerRef, exposed } = useForwardRef<SubMenuInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ASubMenu :key="vnodeKey" ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASubMenu>
</template>
