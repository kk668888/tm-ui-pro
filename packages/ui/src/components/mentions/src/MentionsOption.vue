<!-- packages/ui/src/components/mentions/src/MentionsOption.vue -->
<!--
  TmMentionsOption 薄封装组件：ant Mentions 的 Option 提及选项
  核心机制：
  1. ant 原生透传：value / disabled 等原样下发
  2. default 插槽透传（选项文案）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { MentionsOption as AMentionsOption } from 'ant-design-vue'
import type { TmMentionsOptionProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant MentionsOption 实例类型（ant 未导出 MentionsOptionInstance，用 InstanceType 推导） */
type MentionsOptionInstance = InstanceType<typeof AMentionsOption>

defineOptions({ name: 'TmMentionsOption', inheritAttrs: false })

/** 组件 props：TmMentionsOptionProps（无公司默认） */
const props = defineProps<TmMentionsOptionProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant MentionsOption 实例 */
const { innerRef, exposed } = useForwardRef<MentionsOptionInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AMentionsOption ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AMentionsOption>
</template>
