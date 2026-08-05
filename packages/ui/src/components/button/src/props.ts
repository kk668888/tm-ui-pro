// packages/ui/src/components/button/src/props.ts
// TmButton 类型定义：ant 原生 props + 公司扩展 props 的交叉类型
// 设计要点：业务方使用 TmButton 时，IDE 同时提示 ant 原生属性与公司扩展属性
import type { ButtonProps } from 'ant-design-vue'

/** TmButton 在 ant Button 之上扩展的公司特有属性 */
export interface TmButtonExtProps {
  /** 点击防抖间隔（ms），>0 启用；未设置或 0 表示零开销透传 */
  debounce?: number
  /** 点击前二次确认文案，传入则用 Popconfirm 包裹内部按钮 */
  confirm?: string
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmButtonProps = ButtonProps & TmButtonExtProps

// 类型透传：业务方可直接 import TmButtonProps / ButtonProps
export type { ButtonProps } from 'ant-design-vue'
