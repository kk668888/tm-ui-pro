<!-- packages/ui/src/components/popconfirm/src/Popconfirm.vue -->
<!--
  TmPopconfirm 薄封装组件：ant Popconfirm + 公司默认确认文案 + danger 危险确认
  核心机制：
  1. 默认文案：okText/cancelText 公司默认「确定/取消」，业务显式传值覆盖（withDefaults 兜底）
  2. danger 扩展键：置位时合并进 okButtonProps.danger=true，确认按钮红色（危险语义）
  3. 扩展属性剥离：danger 非 ant 原生 prop，从透传对象剔除
  4. slots 全透传（default 为触发元素）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Popconfirm as APopconfirm } from 'ant-design-vue'
import type { TmPopconfirmProps } from './props'
import { tmPopconfirmDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Popconfirm 实例类型（ant 未导出 PopconfirmInstance，用 InstanceType 推导） */
type PopconfirmInstance = InstanceType<typeof APopconfirm>

defineOptions({ name: 'TmPopconfirm', inheritAttrs: false })

/** 组件 props：TmPopconfirmProps = PopconfirmProps（ant 原生）+ { danger? }；默认文案 + Boolean 陷阱兜底 */
const props = withDefaults(defineProps<TmPopconfirmProps>(), {
  danger: undefined,
  okText: tmPopconfirmDefaults.okText,
  cancelText: tmPopconfirmDefaults.cancelText,
  autoAdjustOverflow: tmPopconfirmDefaults.autoAdjustOverflow,
  showCancel: tmPopconfirmDefaults.showCancel,
})

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Popconfirm 实例 */
const { innerRef, exposed } = useForwardRef<PopconfirmInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离 + okButtonProps 重算：
 * - danger：公司扩展键，ant 不识别，必须剔除
 * - okButtonProps：danger 置位时合并 danger:true（业务显式 okButtonProps 字段仍保留，不覆盖）
 */
const antProps = computed(() => {
  const { danger, okButtonProps, ...rest } = props
  return {
    ...rest,
    okButtonProps: danger ? { danger: true, ...(okButtonProps ?? {}) } : okButtonProps,
  }
})

/**
 * 合并透传对象：$attrs + 公司默认 + 业务显式 props（过滤幻影 false）。
 * open 是 ant 受控 prop，缺省被类型化 defineProps 归一化为 false → 直接透传会让 ant 变
 * 受控 open=false，点击永不弹出。useForwardBindings 跳过幻影 false，保持非受控。
 */
const forwardBindings = useForwardBindings(antProps, [
  'okText',
  'cancelText',
  'autoAdjustOverflow',
  'showCancel',
  'okButtonProps',
])
</script>

<template>
  <APopconfirm ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </APopconfirm>
</template>
