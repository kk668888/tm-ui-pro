// packages/ui/src/components/form/src/props.ts
// TmForm 类型定义：ant 原生 FormProps + 公司扩展键（v2 新增）
//
// 设计要点：
// - TmForm 本为纯薄封装（不新增扩展键），v2 起引入 submitting / readonly / disabled 三个公司级扩展键，
//   故参照 Button/Input/Select 惯例抽出独立 props.ts，避免在 Form.vue 内定义私有 interface
//   导致 vite:dts 声明文件无法命名（TS4023/TS4082）。
// - disabled 同时存在于 ant FormProps（原生整表禁用）与本扩展键——类型同为 boolean | undefined，交叉兼容。
// - 业务方使用 TmForm 时，IDE 提示 ant Form 原生属性 + 公司扩展键。
import type { FormProps } from 'ant-design-vue'

/** TmForm 在 ant Form 之上扩展的公司特有属性 */
export interface TmFormExtProps {
  /** 提交 loading 态。经 FormContext 下发，TmFormItem slot props 可拿到（业务按钮区据此禁用/loading） */
  submitting?: boolean
  /** 全局只读模式。经 FormContext 级联到 TmInput（业务显式传同名 prop 优先） */
  readonly?: boolean
  /** 全局禁用模式。透传 ant Form 原生 disabled（整表禁用）+ 经 FormContext 级联到 TmInput/TmSelect */
  disabled?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmFormProps = FormProps & TmFormExtProps

// 类型透传：业务方可直接 import TmFormProps / FormProps
export type { FormProps } from 'ant-design-vue'
