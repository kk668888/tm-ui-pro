<!-- packages/ui/src/components/date-picker/src/DatePicker.vue -->
<!--
  TmDatePicker 薄封装组件：ant DatePicker + useReadonlyLock + valueFormat 可选字符串桥接
  核心机制：
  1. Dayjs 直通默认：未配置 valueFormat 时 modelValue 即 Dayjs（ant 原生零摩擦）
  2. valueFormat 可选：配置后业务 modelValue 为字符串，useValueFormat 内部完成 string↔Dayjs 双向转换
  3. useReadonlyLock：readonly 时 open:false 锁死弹层面板、allowClear:false 关清除
  4. disabled `??` 级联：业务显式传优先，否则 TmForm context
  5. 扩展键剥离 + $attrs 合并 + slots 全透传 + useForwardRef 方法透传

  注（2026-08-10）：ant DatePickerProps 是 union 类型（PickerBase|PickerDate|PickerTime），
  Vue compiler-sfc 无法从 union 推断 defineProps 运行时 props（Unresolvable type reference）。
  故改用运行时 props 声明：声明公司扩展键 + 公司默认键 + 高频透传键，其余 ant 能力经 $attrs 透传
  （能力不丢，仅 IDE 对未声明键弱提示）。完整类型仍由 props.ts 的 TmDatePickerProps 提供。
-->
<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import { DatePicker as ADatePicker } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import type { DatePickerProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useReadonlyLock } from '../../../composables/useReadonlyLock'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmDatePickerDefaults } from './defaults'
import { useValueFormat } from './composables/useValueFormat'

/** ant DatePicker 实例类型（ant 未导出 DatePickerInstance，用 InstanceType 推导） */
type DatePickerInstance = InstanceType<typeof ADatePicker>

defineOptions({ name: 'TmDatePicker', inheritAttrs: false })

/**
 * 运行时 props 声明（union 类型组件无法用 defineProps<T>() 类型推断，见文件头注）：
 * - 公司扩展：modelValue / valueFormat / readonly
 * - 公司默认：allowClear / size（allowClear 是 Boolean 陷阱，显式 default true）
 * - 高频透传：disabled / open / placeholder / format / showTime / disabledDate / presets / picker
 * - 其余 ant 能力经 $attrs 透传（inheritAttrs:false + v-bind="$attrs"）
 */
const props = defineProps({
  modelValue: { type: [String, Object, null] as PropType<Dayjs | string | null>, default: undefined },
  valueFormat: { type: String, default: undefined },
  readonly: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  allowClear: { type: Boolean, default: tmDatePickerDefaults.allowClear },
  size: { type: String as PropType<NonNullable<DatePickerProps['size']>>, default: tmDatePickerDefaults.size },
  open: { type: Boolean, default: undefined },
  placeholder: { type: String, default: undefined },
  format: { type: String, default: undefined },
  showTime: { type: [Boolean, Object] as PropType<boolean | object>, default: undefined },
  disabledDate: { type: Function as PropType<DatePickerProps['disabledDate']>, default: undefined },
  presets: { type: Array as PropType<DatePickerProps['presets']>, default: undefined },
  picker: { type: String as PropType<'date' | 'week' | 'month' | 'quarter' | 'year'>, default: undefined },
})

/** v-model 桥接事件：useValueFormat 在 get/set 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: Dayjs | string | null): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant DatePicker 实例方法 */
const { innerRef, exposed } = useForwardRef<DatePickerInstance>()
defineExpose(exposed)

/** 只读锁 + disabled 级联：DatePicker 无内嵌搜索框，searchable 默认 false */
const { antProps: lockAntProps } = useReadonlyLock(props, formContext)

/**
 * 扩展属性剥离：仅剔除公司扩展键（modelValue/valueFormat/readonly）——它们不是 ant 声明 prop，
 * 不能透传；disabled/allowClear/open 等保留并经 lockAntProps 覆盖锁调整。
 * 其余 ant 能力（placeholder/showTime/disabledDate/...）本就来自 $attrs，无需在此处理。
 */
const antProps = computed(() => {
  const { modelValue: _mv, valueFormat: _vf, readonly: _ro, open: _open, ...rest } = props
  return {
    ...rest,
    ...lockAntProps.value,
  }
})

/** 透传对象：$attrs + 业务显式 props + 公司默认（allowClear/size）与锁调整合成键（disabled/open/readonly，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['allowClear', 'size', 'disabled', 'open', 'readonly'])

/** v-model 双向桥接：modelValue ↔ ant value，valueFormat 时 string↔Dayjs 自动转换 */
const inner = useValueFormat(props, (v) => emit('update:modelValue', v))
</script>

<template>
  <ADatePicker ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ADatePicker>
</template>
