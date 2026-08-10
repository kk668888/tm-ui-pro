// packages/ui/src/components/input-number/src/defaults.ts
// 公司默认 props：业务传入可覆盖
import type { InputNumberProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - size: 'middle'（公司视觉规范默认中等尺寸）
 * - bordered / controls / keyboard: true —— 关键兜底（2026-08-06 已记录的通病）：
 *   TmInputNumberProps 继承 antd InputNumberProps，Vue 类型化 defineProps 会把这三个
 *   Boolean 属性（antd 默认 true）生成默认 false 的运行时 prop，覆盖 antd 内部
 *   `prop = true` 解构兜底。必须在此显式兜底 true，恢复 antd「默认有边框/有步进/可键盘」语义；
 *   业务显式传 false 仍可覆盖。
 */
export const tmInputNumberDefaults: Partial<InputNumberProps> = {
  size: 'middle',
  bordered: true,
  controls: true,
  keyboard: true,
}
