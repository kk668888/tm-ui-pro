// packages/ui/src/components/time-picker/src/defaults.ts
// 公司默认 props：业务传入可覆盖
import type { TimePickerProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - allowClear: true（统一允许一键清空；ant Boolean 默认 true，类型化 defineProps 会生成 false，必须兜底）
 * - size: 'middle'（公司视觉规范默认中等尺寸）
 */
export const tmTimePickerDefaults: Partial<TimePickerProps> = {
  allowClear: true,
  size: 'middle',
}
