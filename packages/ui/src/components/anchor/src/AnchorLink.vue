<!-- packages/ui/src/components/anchor/src/AnchorLink.vue -->
<!--
  TmAnchorLink 薄封装组件：ant Anchor.Link 锚点链接
  核心机制：
  1. ant 原生透传：href / title / target 等原样下发
  2. default 插槽透传（二级链接）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { AnchorLink as AAnchorLink } from 'ant-design-vue'
import type { TmAnchorLinkProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Anchor.Link 实例类型（ant 未导出 AnchorLinkInstance，用 InstanceType 推导） */
type AnchorLinkInstance = InstanceType<typeof AAnchorLink>

defineOptions({ name: 'TmAnchorLink', inheritAttrs: false })

/** 组件 props：TmAnchorLinkProps = AnchorLinkProps（无公司默认） */
const props = defineProps<TmAnchorLinkProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Anchor.Link 实例 */
const { innerRef, exposed } = useForwardRef<AnchorLinkInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AAnchorLink ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AAnchorLink>
</template>
