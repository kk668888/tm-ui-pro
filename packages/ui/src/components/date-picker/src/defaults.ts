// packages/ui/src/components/date-picker/src/defaults.ts
// 公司默认 props：业务传入可覆盖
import type { DatePickerProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合（DatePicker / RangePicker 共用）
 * - allowClear: true（统一允许一键清空）
 * - size: 'middle'（公司视觉规范默认中等尺寸）
 * 注：allowClear 是 ant Boolean 默认 true 的属性，Vue 类型化 defineProps 会生成默认 false，
 * 必须在 withDefaults 显式兜底（既有通病，见 input/defaults.ts）。
 */
export const tmDatePickerDefaults: Partial<DatePickerProps> = {
  allowClear: true,
  size: 'middle',
}
