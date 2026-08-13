<!-- packages/ui/src/components/switch/src/Switch.vue -->
<!--
  TmSwitch 薄封装组件：复用 TmRadioGroup 同构封装模式
  核心机制：
  1. v-model 桥接：业务 modelValue ↔ ant Switch 的 v-model:checked（注意：Switch 受控键是 checked 而非 value）
  2. 扩展属性剥离：modelValue/readonly 非 ant 原生 prop，从透传对象剔除避免警告；
     checked/onUpdate:checked 由 v-model:checked 单点写入，必须剥离避免冲突
  3. checkedValue/unCheckedValue 透传：ant Switch 自定义开合值能力，原样下发
  4. FormContext 级联：disabled 用 ?? 级联；readonly 因 ant 无原生实现，映射为禁用态
  5. slots 全透传（checkedChildren/unCheckedChildren）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Switch as ASwitch, type SwitchProps } from 'ant-design-vue'
import type { TmSwitchProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmSwitchDefaults } from './defaults'

/** ant Switch 实例类型（ant 未导出 SwitchInstance，用 InstanceType 推导） */
type SwitchInstance = InstanceType<typeof ASwitch>

defineOptions({ name: 'TmSwitch', inheritAttrs: false })

/**
 * 组件 props：TmSwitchProps = SwitchProps（ant 原生）+ { modelValue?, readonly? }
 * withDefaults：modelValue/readonly/disabled 显式置 undefined 区分「未传」（既有约定）
 */
const props = withDefaults(defineProps<TmSwitchProps>(), {
  modelValue: undefined,
  readonly: undefined,
  disabled: undefined,
  // 公司默认值统一来自 defaults.ts（当前为空，as const 类型不引入 ant 键，避免 InferDefaults 冲突）
  ...tmSwitchDefaults,
})

/** v-model 桥接事件：computed setter 在 v-model:checked 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: SwitchProps['checked']): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant Switch 实例方法 */
const { innerRef, exposed } = useForwardRef<SwitchInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离 + FormContext 级联（同 TmRadioGroup）：
 * - modelValue/readonly：公司扩展键，ant 不识别，必须剔除
 * - checked/onUpdate:checked：v-model:checked 单点写入的数值通道，必须剥离避免冲突
 * - disabled：业务显式传优先；否则 readonly 映射为禁用；否则级联 TmForm disabled
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    checked: _c,
    readonly: _ro,
    disabled: _dis,
    'onUpdate:checked': _ouc,
    ...rest
  } = props
  const isReadonly = _ro === true || formContext?.value?.readonly === true
  return {
    ...rest,
    disabled: _dis ?? (isReadonly ? true : formContext?.value?.disabled),
  }
})

/** 透传对象：$attrs + 业务显式 props + 级联合成 disabled（见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['disabled'])

/**
 * v-model 双向桥接：modelValue ↔ ant checked
 * 类型直接复用 SwitchProps['checked']（默认 boolean，配置 checkedValue/unCheckedValue 时可为 string|number）
 */
const inner = computed<SwitchProps['checked']>({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})
</script>

<template>
  <ASwitch ref="innerRef" v-bind="forwardBindings" v-model:checked="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASwitch>
</template>
