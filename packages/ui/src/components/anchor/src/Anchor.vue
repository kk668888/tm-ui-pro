<!-- packages/ui/src/components/anchor/src/Anchor.vue -->
<!--
  TmAnchor 薄封装组件：ant Anchor 锚点
  核心机制：
  1. ant 原生透传：affix / bounds / offsetTop / targetOffset / items 等原样下发
  2. 无公司默认：companyDefaults 传 []，缺省 Boolean 幻影值跳过（affix 缺省不覆盖 ant 默认 true）
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Anchor as AAnchor } from 'ant-design-vue'
import type { TmAnchorProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Anchor 实例类型（ant 未导出 AnchorInstance，用 InstanceType 推导） */
type AnchorInstance = InstanceType<typeof AAnchor>

defineOptions({ name: 'TmAnchor', inheritAttrs: false })

/** 组件 props：TmAnchorProps = AnchorProps（无公司默认） */
const props = defineProps<TmAnchorProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Anchor 实例 */
const { innerRef, exposed } = useForwardRef<AnchorInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AAnchor ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AAnchor>
</template>
