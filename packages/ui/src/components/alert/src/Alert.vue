<!-- packages/ui/src/components/alert/src/Alert.vue -->
<!--
  TmAlert 薄封装组件：ant Alert + status 状态→语义类型映射
  核心机制：
  1. status 扩展键：映射为公司统一语义类型（复用 StatusValue 枚举，映射表见 defaults）
  2. 显式 type 优先：业务传 type 时覆盖 status 映射（type: rest.type ?? ALERT_STATUS_TYPE[status]）
  3. 扩展属性剥离：status 非 ant 原生 prop，从透传对象剔除避免 ant 警告
  4. 无 Boolean 兜底：ant Alert 的 closable/showIcon/banner 默认均 undefined（非 true），
     类型化 defineProps 不产生「覆盖 ant 默认 true」陷阱，故不做 withDefaults 兜底
  5. slots 全透传（message / description / icon / closeIcon / action）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Alert as AAlert } from 'ant-design-vue'
import type { TmAlertProps } from './props'
import { ALERT_STATUS_TYPE } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'

/** ant Alert 实例类型（ant 未导出 AlertInstance，用 InstanceType 推导） */
type AlertInstance = InstanceType<typeof AAlert>

defineOptions({ name: 'TmAlert', inheritAttrs: false })

/** 组件 props：TmAlertProps = AlertProps（ant 原生）+ { status? } */
const props = withDefaults(defineProps<TmAlertProps>(), {
  // status 显式置 undefined：自文档化意图（与其余组件 withDefaults 一致）
  status: undefined,
})

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Alert 实例 */
const { innerRef, exposed } = useForwardRef<AlertInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离 + type 重算：
 * - status：公司扩展键，ant 不识别，必须剔除
 * - type：业务显式传优先，否则取 status 映射（未知 status → undefined → ant 默认 info）
 */
const antProps = computed(() => {
  const { status, ...rest } = props
  return {
    ...rest,
    type: rest.type ?? (status ? ALERT_STATUS_TYPE[status] : undefined),
  }
})

/** 合并透传对象：$attrs + 已剥离 status 的 ant 原生 props（单一 v-bind） */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...antProps.value,
}))
</script>

<template>
  <AAlert ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AAlert>
</template>
