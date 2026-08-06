// packages/ui/src/components/input/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 仅对有限关键属性做强制默认，其余 ant 默认保持原样
import type { InputProps } from 'ant-design-vue'

/**
 * 公司默认 props 集合
 * - allowClear: true（统一允许一键清空，提升表单易用性）
 * - size: 'middle'（公司视觉规范默认中等尺寸）
 * - bordered: true（关键修复，见下方注释）
 */
export const tmInputDefaults: Partial<InputProps> = {
  allowClear: true,
  size: 'middle',
  // bordered: true —— 2026-08-06 修复「input 无 antd 边框」
  // 根因：TmInput 用 defineProps<TmInputProps>() 类型化声明 props，Vue 3 会基于类型推断
  // 生成运行时 props。TmInputProps 继承 antd InputProps，其中 bordered 是 Boolean prop
  // （antd 语义默认 true = 有边框）。但 Vue 对 Boolean prop 未传时的默认值是 false，
  // 且 antd 内部的 `bordered = true` 解构兜底只对 undefined 生效 —— props.bordered
  // 已是 false，兜底失效，输入框被渲染成 borderless（无边框、背景透明）。
  // 此处显式默认 true，恢复 antd「默认有边框」语义；业务显式传 bordered=false 仍可覆盖。
  // 通用教训：薄封装继承的 antd Boolean prop 中，凡 antd 默认 true 的都需在此显式兜底。
  bordered: true,
}
