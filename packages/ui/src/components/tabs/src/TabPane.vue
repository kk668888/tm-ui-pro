<!-- packages/ui/src/components/tabs/src/TabPane.vue -->
<!--
  TmTabPane 薄封装组件：ant Tabs.TabPane 标签页面板
  核心机制：
  1. ant 原生透传：key / tab / disabled / closable 等原样下发
  2. default 插槽透传（面板内容）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { TabPane as ATabPane } from 'ant-design-vue'
import type { TmTabPaneProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Tabs.TabPane 实例类型（ant 未导出 TabPaneInstance，用 InstanceType 推导） */
type TabPaneInstance = InstanceType<typeof ATabPane>

defineOptions({ name: 'TmTabPane', inheritAttrs: false })

/** 组件 props：TmTabPaneProps = TabPaneProps（无公司默认） */
const props = defineProps<TmTabPaneProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Tabs.TabPane 实例 */
const { innerRef, exposed } = useForwardRef<TabPaneInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ATabPane ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATabPane>
</template>
