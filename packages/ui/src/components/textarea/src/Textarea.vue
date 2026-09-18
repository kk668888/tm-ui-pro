<!-- packages/ui/src/components/textarea/src/Textarea.vue -->
<!--
  TmTextarea 薄封装组件：ant Textarea 多行文本域，逐机制对齐 TmInput 范本
  1. v-model 桥接：业务侧标准 v-model（modelValue），内部映射 ant 的 v-model:value
  2. 扩展属性剥离：modelValue / value / defaultValue / onUpdate:value 四个值通道键剔除
  3. $attrs 透传（inheritAttrs:false + useForwardBindings）
  4. slots 透传（showCount 字符定制等）
  5. 方法透传：useForwardRef 代理 ant 实例方法（focus/blur）
  6. 公司默认值：allowClear / bordered 复用 TmInput 同源默认（size 不适用 Textarea，见 defaults.ts）
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Textarea as ATextarea } from 'ant-design-vue'
import type { TmTextareaProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmTextareaDefaults } from './defaults'

/** ant Textarea 实例类型（ant 未导出 TextareaInstance，用 InstanceType 推导） */
type TextareaInstance = InstanceType<typeof ATextarea>

defineOptions({ name: 'TmTextarea', inheritAttrs: false })

const props = withDefaults(defineProps<TmTextareaProps>(), {
  // undefined 表示「未传」，由 ant 内部按 defaultValue 处理
  modelValue: undefined,
  // 公司默认值兜底；业务显式传入自动覆盖
  allowClear: tmTextareaDefaults.allowClear,
  bordered: tmTextareaDefaults.bordered,
  // readonly/disabled 级联：显式置 undefined 区分「未传」→ 可落空到 context
  readonly: undefined,
  disabled: undefined,
})

/** v-model 桥接事件 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时返回 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可调用 ant Textarea 实例方法 */
const { innerRef, exposed } = useForwardRef<TextareaInstance>()
defineExpose(exposed)

/** 扩展属性剥离：剔除值通道键，disabled/readonly 级联合成 */
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

/** 透传对象：$attrs + 业务显式 props + 公司默认与级联合成键 */
const forwardBindings = useForwardBindings(antProps, ['allowClear', 'bordered', 'readonly', 'disabled'])

/** v-model 双向桥接：清空等场景 ant 传入 undefined 时归一化为空串，保持 string 契约稳定 */
const inner = computed<string | undefined>({
  get: () => props.modelValue,
  set: (v: string | undefined) => emit('update:modelValue', v ?? ''),
})
</script>

<template>
  <ATextarea ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATextarea>
</template>
