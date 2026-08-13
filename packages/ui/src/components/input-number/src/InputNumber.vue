<!-- packages/ui/src/components/input-number/src/InputNumber.vue -->
<!--
  TmInputNumber 薄封装组件：复用 TmInput 同构封装模式
  核心机制：
  1. v-model 桥接：业务 modelValue ↔ ant InputNumber 的 v-model:value（number）
  2. 扩展属性剥离：modelValue 非 ant 原生 prop，从透传对象剔除避免警告；
     value/defaultValue/onUpdate:value 由 v-model:value 单点写入，必须剥离避免冲突
  3. FormContext 级联：disabled 用 ?? 级联；readonly 用 ?? 级联（ant InputNumber 有原生 readonly 可透传）
  4. 公司默认：size='middle'、bordered/controls/keyboard=true（Boolean 陷阱兜底）
  5. min/max/precision/formatter/parser 原生透传 + slots 全透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { InputNumber as AInputNumber, type InputNumberProps } from 'ant-design-vue'
import type { TmInputNumberProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmInputNumberDefaults } from './defaults'

/** ant InputNumber 实例类型（ant 未导出 InputNumberInstance，用 InstanceType 推导） */
type InputNumberInstance = InstanceType<typeof AInputNumber>

defineOptions({ name: 'TmInputNumber', inheritAttrs: false })

/**
 * 组件 props：TmInputNumberProps = InputNumberProps（ant 原生）+ { modelValue? }
 * withDefaults：
 * - modelValue 置 undefined 区分「未传」
 * - size/bordered/controls/keyboard 公司默认兜底（Boolean 陷阱：bordered/controls/keyboard 必须显式 true）
 * - readonly/disabled 显式置 undefined：InputNumber 的这两个 Boolean 属性若默认 false，
 *   `false ?? context` 永远不落空，TmForm 级联失效（既有约定）
 */
const props = withDefaults(defineProps<TmInputNumberProps>(), {
  modelValue: undefined,
  size: tmInputNumberDefaults.size,
  bordered: tmInputNumberDefaults.bordered,
  controls: tmInputNumberDefaults.controls,
  keyboard: tmInputNumberDefaults.keyboard,
  readonly: undefined,
  disabled: undefined,
})

/** v-model 桥接事件：computed setter 在 v-model:value 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: InputNumberProps['value']): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant InputNumber 实例方法 */
const { innerRef, exposed } = useForwardRef<InputNumberInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离 + FormContext 级联（同 TmInput）：
 * - modelValue：公司扩展键，ant 不识别，必须剔除
 * - value/defaultValue/onUpdate:value：v-model:value 单点写入的数值通道，必须剥离避免冲突
 * - readonly/disabled：业务显式传优先；否则级联 TmForm context（InputNumber 两者均有原生 prop）
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    defaultValue: _dv,
    'onUpdate:value': _ouv,
    ...rest
  } = props
  return {
    ...rest,
    readonly: rest.readonly ?? formContext?.value?.readonly,
    disabled: rest.disabled ?? formContext?.value?.disabled,
  }
})

/** 透传对象：$attrs + 业务显式 props + 公司默认（size/bordered/controls/keyboard）与级联合成键（readonly/disabled，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['size', 'bordered', 'controls', 'keyboard', 'readonly', 'disabled'])

/**
 * v-model 双向桥接：modelValue ↔ ant value（number）
 * 类型直接复用 InputNumberProps['value']，与 ant 的 v-model:value 两侧一致
 */
const inner = computed<InputNumberProps['value']>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <AInputNumber ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AInputNumber>
</template>
