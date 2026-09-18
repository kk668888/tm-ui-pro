<!-- packages/ui/src/components/time-range-picker/src/TimeRangePicker.vue -->
<!--
  TmTimeRangePicker 薄封装组件：ant TimeRangePicker（时间范围），与 TmRangePicker 同契约
  （运行时 props 声明原因、useReadonlyLock、valueFormat 区间成对桥接、disabled 级联均见
  date-picker/src/RangePicker.vue 与 DatePicker.vue 文件头注）
-->
<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import { TimeRangePicker as ATimeRangePicker } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import type { RangePickerProps } from 'ant-design-vue/es/date-picker'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useReadonlyLock } from '../../../composables/useReadonlyLock'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmDatePickerDefaults } from '../../date-picker/src/defaults'
import { useRangeValueFormat } from '../../date-picker/src/composables/useValueFormat'

/** ant TimeRangePicker 实例类型（ant 未导出实例类型，用 InstanceType 推导） */
type TimeRangePickerInstance = InstanceType<typeof ATimeRangePicker>

defineOptions({ name: 'TmTimeRangePicker', inheritAttrs: false })

/** 运行时 props 声明（union 类型无法类型化推断，见 DatePicker.vue 文件头注） */
const props = defineProps({
  modelValue: {
    type: [Array, null] as PropType<[Dayjs, Dayjs] | [string, string] | null>,
    default: undefined,
  },
  valueFormat: { type: String, default: undefined },
  readonly: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  allowClear: { type: Boolean, default: tmDatePickerDefaults.allowClear },
  size: { type: String as PropType<NonNullable<RangePickerProps['size']>>, default: tmDatePickerDefaults.size },
  open: { type: Boolean, default: undefined },
  placeholder: { type: Array as PropType<string[]>, default: undefined },
  format: { type: String, default: undefined },
  minuteStep: { type: Number, default: undefined },
  hourStep: { type: Number, default: undefined },
})

/** v-model 桥接事件：useRangeValueFormat 在 get/set 中成对转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: [Dayjs, Dayjs] | [string, string] | null): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant TimeRangePicker 实例方法 */
const { innerRef, exposed } = useForwardRef<TimeRangePickerInstance>()
defineExpose(exposed)

/** 只读锁 + disabled 级联 */
const { antProps: lockAntProps } = useReadonlyLock(props, formContext)

/** 扩展属性剥离：剔除公司扩展键（modelValue/valueFormat/readonly/open） */
const antProps = computed(() => {
  const { modelValue: _mv, valueFormat: _vf, readonly: _ro, open: _open, ...rest } = props
  return {
    ...rest,
    ...lockAntProps.value,
  }
})

/** 透传对象：$attrs + 业务显式 props + 公司默认与锁调整合成键 */
const forwardBindings = useForwardBindings(antProps, ['allowClear', 'size', 'disabled', 'open', 'readonly'])

/** v-model 双向桥接：modelValue ↔ ant value，valueFormat 时 [string,string]↔[Dayjs,Dayjs] 成对转换 */
const inner = useRangeValueFormat(props, (v) => emit('update:modelValue', v))
</script>

<template>
  <ATimeRangePicker ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATimeRangePicker>
</template>
