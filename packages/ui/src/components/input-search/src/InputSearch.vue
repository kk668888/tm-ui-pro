<!-- packages/ui/src/components/input-search/src/InputSearch.vue -->
<!--
  TmInputSearch 薄封装组件：ant Input.Search，逐机制对齐 TmInput 范本
  1. v-model 桥接：业务侧标准 v-model（modelValue），内部映射 ant 的 v-model:value
  2. 扩展属性剥离：modelValue / value / defaultValue / onUpdate:value 四个值通道键剔除
     —— @search 是通知事件不剥离，经 $attrs 原样透传（回车/按钮点击均触发）
  3. enterButton 经 $attrs 显式透传（复合类型不声明 prop，避免幻影 false，见 props.ts）
  4. $attrs + slots 透传（enterButton 插槽 / prefix 等）+ useForwardRef 方法透传
  5. 公司默认值：allowClear / size / bordered 复用 TmInput 同源默认 + FormContext 级联
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { InputSearch as AInputSearch } from 'ant-design-vue'
import type { TmInputSearchProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmInputDefaults } from '../../input/src/defaults'

/** ant InputSearch 实例类型（ant 未导出实例类型，用 InstanceType 推导） */
type InputSearchInstance = InstanceType<typeof AInputSearch>

defineOptions({ name: 'TmInputSearch', inheritAttrs: false })

const props = withDefaults(defineProps<TmInputSearchProps>(), {
  modelValue: undefined,
  // 公司默认值兜底（与 TmInput 同源）；业务显式传入自动覆盖
  allowClear: tmInputDefaults.allowClear,
  size: tmInputDefaults.size,
  bordered: tmInputDefaults.bordered,
  readonly: undefined,
  disabled: undefined,
})

/** v-model 桥接事件 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时返回 undefined，不影响独立使用） */
const formContext = useFormContext()

const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可调用 ant InputSearch 实例方法 */
const { innerRef, exposed } = useForwardRef<InputSearchInstance>()
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
const forwardBindings = useForwardBindings(antProps, ['allowClear', 'size', 'bordered', 'readonly', 'disabled'])

/** v-model 双向桥接：清空等场景归一化为空串，保持 string | number 契约稳定 */
const inner = computed<string | number | undefined>({
  get: () => props.modelValue,
  set: (v: string | number | undefined) => emit('update:modelValue', v ?? ''),
})
</script>

<template>
  <AInputSearch ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AInputSearch>
</template>
