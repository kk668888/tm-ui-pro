<!-- packages/ui/src/components/layout/src/Layout.vue -->
<!--
  TmLayout 薄封装组件：ant Layout 容器
  核心机制：
  1. ant 原生透传：hasSider / tagName 等原样下发
  2. 无公司默认值：companyDefaults 传 []，缺省 Boolean 幻影值跳过（hasSider false 不覆盖 ant 推断）
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Layout as ALayout } from 'ant-design-vue'
import type { TmLayoutProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Layout 实例类型（ant 未导出 LayoutInstance，用 InstanceType 推导） */
type LayoutInstance = InstanceType<typeof ALayout>

defineOptions({ name: 'TmLayout', inheritAttrs: false })

/** 组件 props：TmLayoutProps = LayoutProps（无公司默认） */
const props = defineProps<TmLayoutProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Layout 实例 */
const { innerRef, exposed } = useForwardRef<LayoutInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ALayout ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ALayout>
</template>
