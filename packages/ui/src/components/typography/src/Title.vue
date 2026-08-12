<!-- packages/ui/src/components/typography/src/Title.vue -->
<!--
  TmTypographyTitle 薄封装组件：ant Typography.Title 标题
  核心机制：
  1. ant 原生透传：level / copyable / ellipsis / editable 等原样下发
  2. 无公司默认值：companyDefaults 传 []
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { TypographyTitle as ATypographyTitle } from 'ant-design-vue'
import type { TmTypographyTitleProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Typography.Title 实例类型（ant 未导出 TitleInstance，用 InstanceType 推导） */
type TitleInstance = InstanceType<typeof ATypographyTitle>

defineOptions({ name: 'TmTypographyTitle', inheritAttrs: false })

/** 组件 props：TmTypographyTitleProps = TitleProps（无公司默认） */
const props = defineProps<TmTypographyTitleProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Typography.Title 实例 */
const { innerRef, exposed } = useForwardRef<TitleInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <ATypographyTitle ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATypographyTitle>
</template>
