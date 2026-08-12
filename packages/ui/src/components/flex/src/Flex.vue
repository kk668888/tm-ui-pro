<!-- packages/ui/src/components/flex/src/Flex.vue -->
<!--
  TmFlex 薄封装组件：ant Flex + 公司默认间距
  核心机制：
  1. gap 公司默认 'middle'（与 TmSpace 间距对齐，withDefaults + companyDefaults 显式转发）
  2. ant 原生透传：vertical / justify / align / wrap / flex 等原样下发
  3. default 插槽透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Flex as AFlex } from 'ant-design-vue'
import type { TmFlexProps } from './props'
import { tmFlexDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Flex 实例类型（ant 未导出 FlexInstance，用 InstanceType 推导） */
type FlexInstance = InstanceType<typeof AFlex>

defineOptions({ name: 'TmFlex', inheritAttrs: false })

/** 组件 props：TmFlexProps = FlexProps；gap 公司默认 'middle' 兜底 */
const props = withDefaults(defineProps<TmFlexProps>(), tmFlexDefaults)

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Flex 实例 */
const { innerRef, exposed } = useForwardRef<FlexInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 公司默认 gap + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, ['gap'])
</script>

<template>
  <AFlex ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFlex>
</template>
