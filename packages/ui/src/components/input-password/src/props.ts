// packages/ui/src/components/input-password/src/props.ts
// TmInputPassword 类型定义：ant 原生 InputProps + 密码专属扩展 + 公司扩展 modelValue
//
// 设计要点（对齐 input/src/props.ts 范本）：
// - ant-design-vue 未导出 PasswordProps（es/input/index.d.ts 仅导出 InputProps / TextAreaProps），
//   密码专属属性在本地接口补声明，保证 IDE 提示完整。
// - iconRender / action / 'onUpdate:visible' 不进接口：经 $attrs 透传即可工作，
//   重复声明只会增加维护面（visible 例外，见下）。
// - visibilityToggle / visible 必须声明：前者参与 withDefaults 幻影 false 兜底，
//   后者需要显式置 undefined 以区分「未传」（ant 内部非受控）与「受控显隐」。
import type { InputProps } from 'ant-design-vue'

/** TmInputPassword 在 ant InputProps 之上扩展的属性 */
export interface TmInputPasswordExtProps {
  /** 业务侧 v-model 绑定值；内部映射到 ant InputPassword 的 value */
  modelValue?: string | number
  /** 是否显示可见性切换控件；ant 语义默认 true，Boolean 幻影 false 由 defaults 显式兜底 */
  visibilityToggle?: boolean
  /** 受控显隐：未传走 ant 内部非受控状态；传了即受控（配合 update:visible 事件） */
  visible?: boolean
}

/** ant 原生 + 密码扩展 + 公司扩展（IDE 同时提示两者） */
export type TmInputPasswordProps = InputProps & TmInputPasswordExtProps

// 类型透传：业务方可直接 import TmInputPasswordProps / InputProps
export type { InputProps } from 'ant-design-vue'
