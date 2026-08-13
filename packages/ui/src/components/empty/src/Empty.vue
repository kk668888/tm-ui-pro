<!-- packages/ui/src/components/empty/src/Empty.vue -->
<!--
  TmEmpty 薄封装组件：ant Empty + 公司默认空态文案
  核心机制：
  1. description 公司默认 '暂无数据'（withDefaults 兜底，业务传值覆盖）
  2. ant 原生透传：image / imageStyle 等原样下发
  3. slots 全透传（default / image）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Empty as AEmpty } from 'ant-design-vue'
import type { TmEmptyProps } from './props'
import { tmEmptyDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Empty 实例类型（ant 未导出 EmptyInstance，用 InstanceType 推导） */
type EmptyInstance = InstanceType<typeof AEmpty>

defineOptions({ name: 'TmEmpty', inheritAttrs: false })

/** 组件 props：TmEmptyProps = EmptyProps；description 公司默认 '暂无数据' 兜底 */
const props = withDefaults(defineProps<TmEmptyProps>(), {
  description: tmEmptyDefaults.description,
})

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Empty 实例 */
const { innerRef, exposed } = useForwardRef<EmptyInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props + 公司默认 description（幻影 false 跳过，见 useForwardBindings） */
const forwardBindings = useForwardBindings(props, ['description'])
</script>

<template>
  <AEmpty ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AEmpty>
</template>
