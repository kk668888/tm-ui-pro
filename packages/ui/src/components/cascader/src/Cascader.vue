<!-- packages/ui/src/components/cascader/src/Cascader.vue -->
<!--
  TmCascader 薄封装组件：ant Cascader + useReadonlyLock
  核心机制：
  1. v-model 桥接：业务 modelValue ↔ ant Cascader 的 v-model:value（选中路径值数组）
  2. options/fieldNames 原生透传：级联树数据与字段映射用法不变
  3. useReadonlyLock：readonly 时 open:false 锁死弹层、allowClear:false 关清除
  4. disabled `??` 级联：业务显式传优先，否则 TmForm context
  5. 扩展键剥离 + $attrs 合并 + slots 全透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { Cascader as ACascader, type CascaderProps } from 'ant-design-vue'
import type { TmCascaderProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useReadonlyLock } from '../../../composables/useReadonlyLock'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmCascaderDefaults } from './defaults'

/** ant Cascader 实例类型（ant 未导出 CascaderInstance，用 InstanceType 推导） */
type CascaderInstance = InstanceType<typeof ACascader>

defineOptions({ name: 'TmCascader', inheritAttrs: false })

/**
 * 组件 props：TmCascaderProps = CascaderProps（ant 原生）+ { modelValue?, readonly? }
 * withDefaults：allowClear 公司默认兜底（Boolean 陷阱）；readonly/disabled 置 undefined 保证 `??` 级联落空
 */
const props = withDefaults(defineProps<TmCascaderProps>(), {
  modelValue: undefined,
  readonly: undefined,
  disabled: undefined,
  allowClear: tmCascaderDefaults.allowClear,
  // bordered Boolean 陷阱兜底（ant 默认 true，否则渲染成无边框）
  bordered: tmCascaderDefaults.bordered,
  // open 显式置 undefined：ant CascaderProps 的 open 是 Boolean prop，类型化 defineProps 会让
  // 未传时默认 false（受控关闭），useReadonlyLock 直透后无法区分「未传」与「显式 false」。
  open: undefined,
})

/** v-model 桥接事件：computed setter 在 v-model:value 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: CascaderProps['value']): void
}>()

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant Cascader 实例方法 */
const { innerRef, exposed } = useForwardRef<CascaderInstance>()
defineExpose(exposed)

/** 只读锁 + disabled 级联：Cascader 无内嵌搜索框，searchable 默认 false */
const { antProps: lockAntProps } = useReadonlyLock(props, formContext)

/**
 * 扩展属性剥离：
 * - modelValue/readonly：公司扩展键，ant 不识别，必须剔除
 * - value/defaultValue/onUpdate:value：v-model:value 单点写入的数值通道，必须剥离避免冲突
 * - disabled/allowClear/open 留 rest，被 lockAntProps 覆盖
 * 注意：onChange/onSearch 等通知事件【不剥离】（与 Select 同源，剥离会静默失败）
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    readonly: _ro,
    // popupVisible 剥离（2026-08-10 根因）：ant CascaderProps 的 popupVisible 是 deprecated
    // Boolean prop，Vue 类型化 defineProps 会把未传时默认 false（ant 内部默认 undefined），
    // 传给 ant 后 vc-cascader `mergedOpen = props.popupVisible = false` → 弹层永远打不开。
    popupVisible: _pv,
    // open 剥离：由 lockAntProps 统一决定是否下发——未传时不含 open 键（ant Cascader 纯受控
    // open 透传 undefined 会被 Boolean 解析为 false 锁死弹层）
    open: _open,
    'onUpdate:value': _ouv,
    ...rest
  } = props
  return {
    ...rest,
    ...lockAntProps.value,
  }
})

/** 合并透传对象：$attrs + 已剥离冲突项的 ant 原生 props（单一 v-bind） */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...antProps.value,
}))

/** v-model 双向桥接：modelValue ↔ ant value，类型复用 CascaderProps['value'] */
const inner = computed<CascaderProps['value']>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <ACascader ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACascader>
</template>
