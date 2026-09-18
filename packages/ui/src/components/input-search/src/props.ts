// packages/ui/src/components/input-search/src/props.ts
// TmInputSearch 类型定义：ant 原生 InputProps + 公司扩展 modelValue（对齐 input/src/props.ts）
// 注：enterButton 是 Boolean|any 复合类型，不进接口声明——落入 $attrs 显式透传，
// 避免类型化 defineProps 的 Boolean 幻影 false 关掉 ant 的按钮形态
import type { InputProps } from 'ant-design-vue'

/** TmInputSearch 在 ant Input 之上扩展的公司特有属性 */
export interface TmInputSearchExtProps {
  /** 业务侧 v-model 绑定值；内部映射到 ant InputSearch 的 value */
  modelValue?: string | number
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmInputSearchProps = InputProps & TmInputSearchExtProps

// 类型透传：业务方可直接 import TmInputSearchProps / InputProps
export type { InputProps } from 'ant-design-vue'
