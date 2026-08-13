<!-- packages/ui/src/components/collapse/src/CollapsePanel.vue -->
<!--
  TmCollapsePanel 薄封装组件：ant CollapsePanel 折叠面板子项
  核心机制：
  1. ant Collapse 通过 vnode.key / props.header / children.header 提取面板（见 Collapse.vue 头注释）
     —— 必须转发 vnode key，否则面板按键识别断裂
  2. header / collapsible / disabled / showArrow 业务 props 显式下发；ant 内部传入的
     isActive / onItemClick / expandIcon 等走 $attrs 透传
  3. 动态插槽全透传（header / extra / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { getCurrentInstance, useSlots } from 'vue'
import { CollapsePanel as ACollapsePanel } from 'ant-design-vue'
import type { TmCollapsePanelProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant CollapsePanel 实例类型（用 InstanceType 推导） */
type CollapsePanelInstance = InstanceType<typeof ACollapsePanel>

defineOptions({ name: 'TmCollapsePanel', inheritAttrs: false })

/** 组件 props：TmCollapsePanelProps = CollapsePanelProps（无公司默认） */
const props = defineProps<TmCollapsePanelProps>()

// vnode key 转发：ant Collapse 用 child.key 识别面板（key 是 Vue 特殊属性，必须显式转发）
// ?? undefined 归一化 null（:key 不接受 null，PropertyKey | null | undefined → PropertyKey | undefined）
const vnodeKey = getCurrentInstance()?.vnode.key ?? undefined

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant CollapsePanel 实例 */
const { innerRef, exposed } = useForwardRef<CollapsePanelInstance>()
defineExpose(exposed)

/** 透传对象：$attrs（含 ant Collapse 传入的 isActive/onItemClick 等）+ 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ACollapsePanel ref="innerRef" :key="vnodeKey" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACollapsePanel>
</template>
