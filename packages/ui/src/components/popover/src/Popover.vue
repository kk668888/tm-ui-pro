<!-- packages/ui/src/components/popover/src/Popover.vue -->
<!--
  TmPopover 薄封装组件：ant Popover 纯透传 + autoAdjustOverflow 默认兜底
  核心机制：
  1. autoAdjustOverflow 默认 true（Boolean 陷阱兜底，见 defaults 注释）
  2. ant 原生透传：title / content / trigger / placement 等原样下发
  3. slots 全透传（default 触发元素 / title / content）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Popover as APopover } from 'ant-design-vue'
import type { TmPopoverProps } from './props'
import { tmPopoverDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Popover 实例类型（ant 未导出 PopoverInstance，用 InstanceType 推导） */
type PopoverInstance = InstanceType<typeof APopover>

defineOptions({ name: 'TmPopover', inheritAttrs: false })

/** 组件 props：TmPopoverProps = PopoverProps；autoAdjustOverflow 公司默认 true 兜底 */
const props = withDefaults(defineProps<TmPopoverProps>(), {
  autoAdjustOverflow: tmPopoverDefaults.autoAdjustOverflow,
})

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Popover 实例 */
const { innerRef, exposed } = useForwardRef<PopoverInstance>()
defineExpose(exposed)

/**
 * 合并透传对象：$attrs + 公司默认 + 业务显式 props。
 * open/visible 是 ant 的受控 prop，缺省时被类型化 defineProps 归一化为 false →
 * 直接透传会让 ant 变受控 open=false，点击/hover 永不弹出。useForwardBindings 跳过幻影 false，
 * 保持 ant 非受控，触发即弹出。
 */
const forwardBindings = useForwardBindings(props, ['autoAdjustOverflow'])
</script>

<template>
  <APopover ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </APopover>
</template>
