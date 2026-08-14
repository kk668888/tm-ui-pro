<!-- packages/ui/src/components/typography/src/Paragraph.vue -->
<!--
  TmTypographyParagraph 薄封装组件：ant Typography.Paragraph 段落
  核心机制：
  1. ant 原生透传：copyable / ellipsis / editable 等原样下发
  2. 无公司默认值：companyDefaults 传 []
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots, type ComponentPublicInstance } from 'vue'
import { TypographyParagraph as ATypographyParagraph } from 'ant-design-vue'
import type { TmTypographyParagraphProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

// 注：ant Typography.Paragraph 是 FunctionalComponent（非 defineComponent），无 class 实例，
// InstanceType 不适用；方法透传回退到通用组件实例类型（useForwardRef 运行时按需转发）。
type ParagraphInstance = ComponentPublicInstance

defineOptions({ name: 'TmTypographyParagraph', inheritAttrs: false })

/** 组件 props：TmTypographyParagraphProps = ParagraphProps（无公司默认） */
const props = defineProps<TmTypographyParagraphProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Typography.Paragraph 实例 */
const { innerRef, exposed } = useForwardRef<ParagraphInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ATypographyParagraph ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATypographyParagraph>
</template>
