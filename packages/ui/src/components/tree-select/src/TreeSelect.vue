<!-- packages/ui/src/components/tree-select/src/TreeSelect.vue -->
<!--
  TmTreeSelect 薄封装组件：ant TreeSelect + useReadonlyLock（searchable）
  核心机制：
  1. v-model 桥接：业务 modelValue ↔ ant TreeSelect 的 v-model:value（单选/多选/labelInValue 原生形态）
  2. treeData/fieldNames 原生透传：树数据结构与字段映射用法不变
  3. useReadonlyLock（searchable: true）：readonly 时 open:false 锁弹层、allowClear:false 关清除、
     showSearch:false 关搜索输入框
  4. disabled `??` 级联：业务显式传优先，否则 TmForm context
  5. 扩展键剥离 + $attrs 合并 + slots 全透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { TreeSelect as ATreeSelect, type TreeSelectProps } from 'ant-design-vue'
import type { TmTreeSelectProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useReadonlyLock } from '../../../composables/useReadonlyLock'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmTreeSelectDefaults } from './defaults'

/** ant TreeSelect 实例类型（ant 未导出 TreeSelectInstance，用 InstanceType 推导） */
type TreeSelectInstance = InstanceType<typeof ATreeSelect>

defineOptions({ name: 'TmTreeSelect', inheritAttrs: false })

/**
 * 组件 props：TmTreeSelectProps = TreeSelectProps（ant 原生）+ { modelValue?, readonly? }
 * withDefaults：allowClear 公司默认兜底（Boolean 陷阱）；readonly/disabled 置 undefined 保证 `??` 级联落空
 */
const props = withDefaults(defineProps<TmTreeSelectProps>(), {
  modelValue: undefined,
  readonly: undefined,
  disabled: undefined,
  allowClear: tmTreeSelectDefaults.allowClear,
  // open 显式置 undefined：ant TreeSelectProps 的 open 是 Boolean prop，类型化 defineProps 会让
  // 未传时默认 false（受控关闭），useReadonlyLock 直透后无法区分「未传」与「显式 false」。
  open: undefined,
})

/** v-model 桥接事件：computed setter 在 v-model:value 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: TreeSelectProps['value']): void
}>()

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant TreeSelect 实例方法 */
const { innerRef, exposed } = useForwardRef<TreeSelectInstance>()
defineExpose(exposed)

/** 只读锁 + disabled 级联：TreeSelect 有内嵌搜索框，searchable: true 一并锁死 */
const { antProps: lockAntProps } = useReadonlyLock(props, formContext, { searchable: true })

/**
 * 扩展属性剥离：
 * - modelValue/readonly：公司扩展键，ant 不识别，必须剔除
 * - value/defaultValue/onUpdate:value：v-model:value 单点写入的数值通道，必须剥离避免冲突
 * - disabled/allowClear/showSearch/open 留 rest，被 lockAntProps 覆盖
 * 注意：onChange/onSearch 等通知事件【不剥离】（与 Select 同源，剥离会静默失败）
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    readonly: _ro,
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

/** v-model 双向桥接：modelValue ↔ ant value，类型复用 TreeSelectProps['value'] */
const inner = computed<TreeSelectProps['value']>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <ATreeSelect ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATreeSelect>
</template>
