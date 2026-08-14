// packages/ui/src/components/alert/src/props.ts
// TmAlert 类型定义：ant 原生 AlertProps + 公司扩展 status
import type { ExtractPropTypes } from 'vue'
import type { alertProps } from 'ant-design-vue/es/alert'
import type { StatusValue } from '../../../constants/status'

/**
 * ant Alert 原生 props（不含 HTMLAttributes）
 * 注：ant `AlertProps` 含 Vue DOM 属性类型，compiler-sfc 无法从 extends 解析；
 * 取 ExtractPropTypes 部分（与其他组件一致），class/style 等 DOM 属性经 $attrs 透传。
 */
type AlertBaseProps = Partial<ExtractPropTypes<ReturnType<typeof alertProps>>>

/** TmAlert 在 ant Alert 之上扩展的公司特有属性 */
export interface TmAlertExtProps {
  /**
   * 状态枚举：映射为公司统一语义类型（success→success / processing→info / failed→error / warning→warning）
   * 业务无需手写 type；显式传 type 时优先于 status 映射
   */
  status?: StatusValue
}

/** ant 原生（ExtractPropTypes）+ 公司扩展（IDE 提示 ant 原生属性与 status） */
export type TmAlertProps = AlertBaseProps & TmAlertExtProps

// 类型透传：业务可 import { TmAlertProps, AlertProps } from '@kibus/tm-ui-plus'
export type { AlertProps } from 'ant-design-vue'
