<!-- packages/ui/src/components/tabs/src/Tabs.vue -->
<!--
  TmTabs 薄封装组件：ant Tabs 标签页
  核心机制：
  1. ant 原生透传：type / position / size / items / activeKey / centered 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过（destroyInactiveTabPane 缺省不覆盖 ant 默认 false）
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Tabs as ATabs } from 'ant-design-vue'
import type { TmTabsProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Tabs 实例类型（ant 未导出 TabsInstance，用 InstanceType 推导） */
type TabsInstance = InstanceType<typeof ATabs>

defineOptions({ name: 'TmTabs', inheritAttrs: false })

/** 组件 props：TmTabsProps = TabsProps（无公司默认） */
const props = defineProps<TmTabsProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Tabs 实例 */
const { innerRef, exposed } = useForwardRef<TabsInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ATabs ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATabs>
</template>
