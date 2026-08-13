<!-- packages/ui/src/components/tag/src/Tag.vue -->
<!--
  TmTag 薄封装组件：ant Tag + status 状态→语义色映射
  核心机制：
  1. status 扩展键：映射为公司统一的语义色（ant 预设色名），业务无需手写颜色
  2. 显式 color 优先：业务传 color 时覆盖 status 映射（color: rest.color ?? STATUS_COLOR[status]）
  3. 扩展属性剥离：status 非 ant 原生 prop，从透传对象剔除避免 ant 警告
  4. Boolean 陷阱兜底：bordered（ant 默认 true）withDefaults 显式兜底
  5. slots 全透传（default/icon/closeIcon）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Tag as ATag } from 'ant-design-vue'
import type { TmTagProps } from './props'
import { TAG_STATUS_COLOR, tmTagDefaults } from './defaults'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Tag 实例类型（ant 未导出 TagInstance，用 InstanceType 推导） */
type TagInstance = InstanceType<typeof ATag>

defineOptions({ name: 'TmTag', inheritAttrs: false })

/** 组件 props：TmTagProps = TagProps（ant 原生）+ { status? }；bordered Boolean 陷阱兜底 */
const props = withDefaults(defineProps<TmTagProps>(), {
  // status 显式置 undefined：自文档化意图（status 无 `??` 级联语义，但保持与其余组件 withDefaults 一致）
  status: undefined,
  bordered: tmTagDefaults.bordered,
})

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Tag 实例 */
const { innerRef, exposed } = useForwardRef<TagInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离 + color 重算：
 * - status：公司扩展键，ant 不识别，必须剔除
 * - color：业务显式传优先，否则取 status 映射（未知 status → undefined → ant 默认色）
 */
const antProps = computed(() => {
  const {
    status,
    // visible 剥离（2026-08-10）：ant Tag 的 deprecated `visible` Boolean prop（ant 内部默认 undefined），
    // 类型化 defineProps 会默认成 false，传给 ant 后 `visible.value = false` → 标签渲染成 ant-tag-hidden
    visible: _v,
    ...rest
  } = props
  return {
    ...rest,
    color: rest.color ?? (status ? TAG_STATUS_COLOR[status] : undefined),
  }
})

/** 透传对象：$attrs + 业务显式 props + 合成 color / 公司默认 bordered（antProps 源，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['color', 'bordered'])
</script>

<template>
  <ATag ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATag>
</template>
