<!-- packages/ui/src/components/radio-button/src/RadioButton.vue -->
<!--
  TmRadioButton 薄包裹组件：ant Radio.Button（顶层导出 RadioButton），值单元语义
  与 TmRadio 范本（radio/src/Radio.vue）的差异点：
  1. disabled 需要 FormContext 级联（spec 要求）：显式置 undefined 落空 → 合成 context
  2. 无 v-model、无公司默认值：companyDefaults 仅 ['disabled']（级联合成键必须列出，
     见 unify-legacy-forward-bindings 经验：合成键不列入 companyDefaults 会静默失效）
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { RadioButton as ARadioButton } from 'ant-design-vue'
import type { TmRadioButtonProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useFormContext } from '../../form/src/composables/useFormContext'

/** ant RadioButton 实例类型（ant 未导出实例类型，用 InstanceType 推导） */
type RadioButtonInstance = InstanceType<typeof ARadioButton>

defineOptions({ name: 'TmRadioButton', inheritAttrs: false })

const props = withDefaults(defineProps<TmRadioButtonProps>(), {
  // 显式置 undefined 区分「未传」→ 可落空到 FormContext 级联
  disabled: undefined,
})

/** 注入祖先 TmForm 联动上下文（无祖先时返回 undefined，不影响独立使用） */
const formContext = useFormContext()

const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可访问内部 ant RadioButton 实例 */
const { innerRef, exposed } = useForwardRef<RadioButtonInstance>()
defineExpose(exposed)

/** disabled 级联合成：业务显式传优先，否则 TmForm context */
const antProps = computed(() => ({
  ...props,
  disabled: props.disabled ?? formContext?.value?.disabled,
}))

/** 透传对象：$attrs + 业务显式 props + 级联合成键（disabled 必须列出，否则默认失效） */
const forwardBindings = useForwardBindings(antProps, ['disabled'])
</script>

<template>
  <ARadioButton ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ARadioButton>
</template>
