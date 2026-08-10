// packages/ui/src/components/modal/src/props.ts
// TmModal 类型定义：ant 原生 ModalProps + 公司扩展
import type { ModalProps } from 'ant-design-vue'

/** TmModal 在 ant Modal 之上扩展的公司特有属性 */
export interface TmModalExtProps {
  /** 业务 v-model 绑定值（开关状态）；内部 computed 桥接到 ant Modal 的 open */
  modelValue?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmModalProps = ModalProps & TmModalExtProps

// 类型透传：业务方可直接 import TmModalProps / ModalProps
export type { ModalProps } from 'ant-design-vue'
