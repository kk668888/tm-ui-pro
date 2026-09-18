<!-- packages/ui/src/components/quarter-picker/src/QuarterPicker.vue -->
<!--
  TmQuarterPicker 薄封装组件：ant QuarterPicker，与 TmDatePicker 同契约
  （运行时 props 声明原因、useReadonlyLock、valueFormat 桥接、disabled 级联均见
  date-picker/src/DatePicker.vue 文件头注；本组件固定季度语义，无 picker prop）
-->
<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import { QuarterPicker as AQuarterPicker } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import type { DatePickerProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useReadonlyLock } from '../../../composables/useReadonlyLock'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmDatePickerDefaults } from '../../date-picker/src/defaults'
import { useValueFormat } from '../../date-picker/src/composables/useValueFormat'

/** ant QuarterPicker 实例类型（ant 未导出实例类型，用 InstanceType 推导） */
type QuarterPickerInstance = InstanceType<typeof AQuarterPicker>

defineOptions({ name: 'TmQuarterPicker', inheritAttrs: false })

/** 运行时 props 声明（union 类型无法类型化推断，见 DatePicker.vue 文件头注） */
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
  disabledDate: { type: Function as PropType<DatePickerProps['disabledDate']>, default: undefined },
})

/** v-model 桥接事件：useValueFormat 在 get/set 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: Dayjs | string | null): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant QuarterPicker 实例方法 */
const { innerRef, exposed } = useForwardRef<QuarterPickerInstance>()
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

/** v-model 双向桥接：modelValue ↔ ant value，valueFormat 时 string↔Dayjs 自动转换 */
const inner = useValueFormat(props, (v) => emit('update:modelValue', v))
</script>

<template>
  <AQuarterPicker ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AQuarterPicker>
</template>
