// packages/ui/src/components/time-picker/src/composables/useValueFormat.ts
// TmTimePicker 复用单日期 Dayjs↔string 桥接（与 TmDatePicker 同一实现，避免重复维护）
// 单值 useValueFormat 的 props 形状（modelValue/valueFormat）与 TimePicker 完全兼容。
export { useValueFormat } from '../../../date-picker/src/composables/useValueFormat'
