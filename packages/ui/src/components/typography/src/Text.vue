<!-- packages/ui/src/components/typography/src/Text.vue -->
<!--
  TmTypographyText 薄封装组件：ant Typography.Text 文本
  核心机制：
  1. ant 原生透传：type / mark / code / keyboard / underline / copyable / ellipsis 等原样下发
  2. 无公司默认值：companyDefaults 传 []
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { TypographyText as ATypographyText } from 'ant-design-vue'
import type { TmTypographyTextProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Typography.Text 实例类型（ant 未导出 TextInstance，用 InstanceType 推导） */
type TextInstance = InstanceType<typeof ATypographyText>

defineOptions({ name: 'TmTypographyText', inheritAttrs: false })

/** 组件 props：TmTypographyTextProps = TextProps（无公司默认） */
const props = defineProps<TmTypographyTextProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Typography.Text 实例 */
const { innerRef, exposed } = useForwardRef<TextInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ATypographyText ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATypographyText>
</template>
