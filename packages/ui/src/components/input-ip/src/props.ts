// packages/ui/src/components/input-ip/src/props.ts
// TmInputIp 类型定义：库内第一个自研交互组件（非 ant 薄封装），props 全部为自有契约
//
// 设计要点：
// - modelValue: string —— v-model 契约（spec「v-model 值契约」）：四段齐且全合法时为
//   点分完整串（前导零按原文），否则为 ''。是否必填由表单 rule 决定，无 allowEmpty 开关。
// - size / disabled / readonly：与库内其他表单控件对齐的三件套；disabled/readonly 未传时
//   级联 TmForm 上下文（见 InputIp.vue），显式传入优先。
import type { SizeType } from 'ant-design-vue/es/config-provider/SizeContext'

/** TmInputIp 自有属性 */
export interface TmInputIpProps {
  /** v-model 绑定值：完整合法 IP 点分串；段未齐或含非法段时为 '' */
  modelValue?: string
  /** 控件尺寸（与 ant 表单控件同体系，默认 middle） */
  size?: SizeType
  /** 禁用：置灰不可交互；未传时级联 TmForm disabled */
  disabled?: boolean
  /** 只读：段值可见不可编辑（不置灰）；未传时级联 TmForm readonly */
  readonly?: boolean
}
