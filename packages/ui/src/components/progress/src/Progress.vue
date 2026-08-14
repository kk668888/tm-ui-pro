<!-- packages/ui/src/components/progress/src/Progress.vue -->
<!--
  TmProgress 薄封装组件：ant Progress + 业务 status 语义映射
  核心机制：
  1. status 扩展映射：业务语义（success/processing/failed/warning）→ ant status / strokeColor，
     命中 src/status.ts 映射表；ant 原生值（active/normal/exception）原样透传
  2. 显式 strokeColor 优先：业务传 strokeColor 时覆盖映射兜底（warning 的默认色）
  3. useForwardBindings 只转发业务显式值，缺省 Boolean 幻影 false 跳过
  4. slots 全透传（format 自定义文案 / default 追加内容）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Progress as AProgress } from 'ant-design-vue'
import type { TmProgressProps } from './props'
import { PROGRESS_STATUS_MAP, type ProgressStatusKey } from './status'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/**
 * ant Progress 实例类型（ant 未导出 ProgressInstance，用 InstanceType 推导）。
 * 注意：exposed 类型必须剔除 `$props`——defineExpose(useForwardRef 返回的 exposed) 时
 * Volar 会把 exposed 的 `$props` 与组件 props 做交叉合并；若保留 ant 原生 `$props`
 * （status 值域较窄），会把 TmProgressProps 经 Omit 扩展后的 status 值域收窄回 ant 原生，
 * 导致业务语义值（processing/failed/warning）在模板中报类型错误。
 * 方法透传不受影响：ant Progress 实例方法均在 `$props` 之外。
 */
type ProgressInstance = Omit<InstanceType<typeof AProgress>, '$props'>

defineOptions({ name: 'TmProgress', inheritAttrs: false })

/** 组件 props：TmProgressProps = ant ProgressProps（status 放宽为业务语义 + ant 原生值） */
const props = defineProps<TmProgressProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Progress 实例 */
const { innerRef, exposed } = useForwardRef<ProgressInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])

/**
 * 业务 status → ant status/strokeColor 映射：
 * - status 命中业务值域 → 替换为映射的 ant status，warning 追加 strokeColor 兜底
 * - status 为 ant 原生值或未传 → 原样透传
 * - 显式 strokeColor 优先于映射兜底
 * - 用 Object.hasOwn 判断命中，避免 status 传入原型链属性名（如 'constructor'）
 *   时 in 误判为命中并静默丢弃 status
 */
const antBindings = computed(() => {
  const { status, strokeColor, ...rest } = forwardBindings.value
  // 用 Object.hasOwn 判断命中，避免 status 传入原型链属性名（如 'constructor'）
  // 时 in 误判为命中并静默丢弃 status
  if (typeof status === 'string' && Object.prototype.hasOwnProperty.call(PROGRESS_STATUS_MAP, status)) {
    const mapped = PROGRESS_STATUS_MAP[status as ProgressStatusKey]
    return {
      ...rest,
      ...mapped,
      // 显式 strokeColor 优先；映射兜底仅 warning 有值，其余不注入避免污染 bindings
      ...(strokeColor !== undefined
        ? { strokeColor }
        : mapped.strokeColor !== undefined
          ? { strokeColor: mapped.strokeColor }
          : {}),
    }
  }
  return forwardBindings.value
})
</script>

<template>
  <AProgress ref="innerRef" v-bind="antBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AProgress>
</template>
