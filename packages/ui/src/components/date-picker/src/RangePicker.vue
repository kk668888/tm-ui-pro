<!-- packages/ui/src/components/date-picker/src/RangePicker.vue -->
<!--
  TmRangePicker 薄封装组件：ant RangePicker + useReadonlyLock + valueFormat 区间成对桥接
  核心机制：
  1. Dayjs 直通默认：未配置 valueFormat 时 modelValue 为 [Dayjs,Dayjs]（ant 原生零摩擦）
  2. valueFormat 可选：配置后业务 modelValue 为 [string,string]，useRangeValueFormat 成对转换
  3. useReadonlyLock：readonly 时 open:false 锁死弹层面板、allowClear:false 关清除
  4. disabled `??` 级联：业务显式传优先，否则 TmForm context
  5. 扩展键剥离 + $attrs 合并 + slots 全透传 + useForwardRef 方法透传

  注（2026-08-10）：ant RangePickerProps 是 union 类型（同 DatePickerProps），compiler-sfc
  无法推断 defineProps 运行时 props，故改用运行时 props 声明（见 DatePicker.vue 文件头注）。
-->
<script setup lang="ts">
import { computed, useSlots, type PropType } from 'vue'
import { RangePicker as ARangePicker } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import type { TmRangePickerProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useReadonlyLock } from '../../../composables/useReadonlyLock'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { tmDatePickerDefaults } from './defaults'
import { useRangeValueFormat } from './composables/useValueFormat'

/** ant RangePicker 实例类型（ant 未导出 RangePickerInstance，用 InstanceType 推导） */
type RangePickerInstance = InstanceType<typeof ARangePicker>

defineOptions({ name: 'TmRangePicker', inheritAttrs: false })

/** 运行时 props 声明（union 类型组件无法用 defineProps<T>()，见 DatePicker.vue 文件头注）
 * 仅声明公司扩展键 + 公司默认键 + 弹层锁相关 + 高频透传键；
 * presets/ranges/disabledDate/separator/allowEmpty 等类型敏感键不显式声明，经 $attrs 透传给 ant
 * （ant union 类型下这些字段的 PropType 推断会混乱，走 $attrs 反而干净）
 */
const props = defineProps({
  modelValue: {
    type: [Array, null] as PropType<[Dayjs, Dayjs] | [string, string] | null>,
    default: undefined,
  },
  valueFormat: { type: String, default: undefined },
  readonly: { type: Boolean, default: undefined },
  disabled: { type: Boolean, default: undefined },
  allowClear: { type: Boolean, default: tmDatePickerDefaults.allowClear },
  size: { type: String as PropType<NonNullable<TmRangePickerProps['size']>>, default: tmDatePickerDefaults.size },
  open: { type: Boolean, default: undefined },
  placeholder: { type: Array as PropType<string[]>, default: undefined },
  format: { type: String, default: undefined },
  showTime: { type: [Boolean, Object] as PropType<boolean | object>, default: undefined },
})

/** v-model 桥接事件：useRangeValueFormat 在 get/set 中成对转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: [Dayjs, Dayjs] | [string, string] | null): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，不影响独立使用） */
const formContext = useFormContext()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接调用内部 ant RangePicker 实例方法 */
const { innerRef, exposed } = useForwardRef<RangePickerInstance>()
defineExpose(exposed)

/** 只读锁 + disabled 级联：RangePicker 无内嵌搜索框，searchable 默认 false */
const { antProps: lockAntProps } = useReadonlyLock(props, formContext)

/** 扩展属性剥离（同 TmDatePicker）：仅剔除公司扩展键，disabled/allowClear/open 留 lockAntProps 覆盖 */
const antProps = computed(() => {
  const { modelValue: _mv, valueFormat: _vf, readonly: _ro, open: _open, ...rest } = props
  return {
    ...rest,
    ...lockAntProps.value,
  }
})

/** 透传对象：$attrs + 业务显式 props + 公司默认（allowClear/size）与锁调整合成键（disabled/open/readonly，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['allowClear', 'size', 'disabled', 'open', 'readonly'])

/** v-model 双向桥接：modelValue ↔ ant value（区间对），valueFormat 时成对 string↔Dayjs 自动转换 */
const inner = useRangeValueFormat(props, (v) => emit('update:modelValue', v))
</script>

<template>
  <ARangePicker ref="innerRef" v-bind="forwardBindings" v-model:value="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ARangePicker>
</template>
