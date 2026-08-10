<!-- packages/ui/src/components/checkbox-group/src/CheckboxGroup.vue -->
<!--
  TmCheckboxGroup 薄封装组件：复用 TmRadioGroup 同构封装模式
  核心机制：
  1. v-model 桥接：业务 modelValue ↔ ant CheckboxGroup 的 v-model:value（数组值）
  2. 扩展属性剥离：modelValue/readonly 非 ant 原生 prop，从透传对象剔除避免警告；
     value/onUpdate:value 由 v-model:value 单点写入，必须剥离避免冲突
  3. options 透传：ant CheckboxGroup 原生 options 数组能力，原样下发
  4. FormContext 级联：disabled 用 ?? 级联；readonly 因 ant 无原生实现，映射为禁用态
  5. slots 全透传 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useAttrs, useSlots } from 'vue'
import { CheckboxGroup as ACheckboxGroup, type CheckboxGroupProps } from 'ant-design-vue'
import type { TmCheckboxGroupProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmCheckboxGroupDefaults } from './defaults'

/** ant CheckboxGroup 实例类型（ant 未导出 CheckboxGroupInstance，用 InstanceType 推导） */
type CheckboxGroupInstance = InstanceType<typeof ACheckboxGroup>

defineOptions({ name: 'TmCheckboxGroup', inheritAttrs: false })

/**
 * 组件 props：TmCheckboxGroupProps = CheckboxGroupProps（ant 原生）+ { modelValue?, readonly? }
 * withDefaults：modelValue/readonly/disabled 显式置 undefined 区分「未传」（既有约定）
 */
const props = withDefaults(defineProps<TmCheckboxGroupProps>(), {
  modelValue: undefined,
  readonly: undefined,
  disabled: undefined,
  // 公司默认值统一来自 defaults.ts（当前为空，as const 类型不引入 ant 键，避免 InferDefaults 冲突）
  ...tmCheckboxGroupDefaults,
})

/** v-model 桥接事件：computed setter 在 v-model:value 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: CheckboxGroupProps['value']): void
}>()

// inheritAttrs:false 下手动取 $attrs
const $attrs = useAttrs()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant CheckboxGroup 实例方法 */
const { innerRef, exposed } = useForwardRef<CheckboxGroupInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离 + FormContext 级联（同 TmRadioGroup）：
 * - modelValue/readonly：公司扩展键，ant 不识别，必须剔除
 * - value/onUpdate:value：v-model:value 单点写入的数值通道，必须剥离避免冲突
 * - disabled：业务显式传优先；否则 readonly 映射为禁用；否则级联 TmForm disabled
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    value: _v,
    readonly: _ro,
    disabled: _dis,
    'onUpdate:value': _ouv,
    ...rest
  } = props
  const isReadonly = _ro === true || formContext?.value?.readonly === true
  return {
    ...rest,
    disabled: _dis ?? (isReadonly ? true : formContext?.value?.disabled),
  }
})

/** 合并透传对象：$attrs + 已剥离冲突项的 ant 原生 props（单一 v-bind） */
const forwardBindings = computed(() => ({
  ...$attrs,
  ...antProps.value,
}))

/**
 * v-model 双向桥接：modelValue ↔ ant value（数组）
 * 类型直接复用 CheckboxGroupProps['value']，与 ant 的 v-model:value 两侧一致
 */
const inner = computed<CheckboxGroupProps['value']>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <ACheckboxGroup ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ACheckboxGroup>
</template>
