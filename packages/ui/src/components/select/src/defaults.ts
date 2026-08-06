// packages/ui/src/components/select/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 仅对有限关键属性做强制默认，其余 ant 默认保持原样
//
// 注：filterOption 不在此处静态默认，而在 Select.vue 的 antProps computed 中按
// remote 模式自适应（本地模式 true / 远程模式 false），以保证两种模式开箱即用。
import type { SelectProps } from 'ant-design-vue'

/** 公司扩展字段的默认值（非 ant SelectProps 原生的扩展键） */
export interface TmSelectDefaults {
  /** 远程搜索防抖毫秒（仅 remote 模式生效） */
  debounce: number
  /** 远程搜索最小输入长度（仅 remote 模式生效） */
  minLength: number
}

/** ant SelectProps 中需强制默认的 Boolean 属性键（Vue Boolean 陷阱兜底） */
type AntBoolDefaultKeys =
  | 'showSearch'
  | 'allowClear'
  | 'bordered'
  | 'showArrow'
  | 'virtual'
  | 'autoClearSearchValue'
  | 'defaultActiveFirstOption'

/**
 * 公司默认 props 集合
 *
 * 以下 Boolean 属性在 antd 中默认 true，但 Vue 3 的 defineProps<T>() 类型推断
 * 会为其生成 Boolean 运行时 prop，未传时默认 false——覆盖 antd 解构兜底。
 * 必须在 withDefaults 显式兜底 true，与 bordered / showSearch / allowClear 同源。
 * 业务显式传入同名 prop 时自动覆盖。
 */
export const tmSelectDefaults: Pick<SelectProps, AntBoolDefaultKeys> &
  TmSelectDefaults = {
  showSearch: true,
  allowClear: true,
  bordered: true,
  showArrow: true,
  virtual: true,
  autoClearSearchValue: true,
  defaultActiveFirstOption: true,
  // 公司扩展默认值
  debounce: 300,
  minLength: 1,
}
