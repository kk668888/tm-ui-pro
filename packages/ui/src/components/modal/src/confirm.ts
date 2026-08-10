// packages/ui/src/components/modal/confirm.ts
// TmModal 命令式静态方法：confirm/info/success/error/warning
//
// 有 TmApp 包裹（holder 非空）时用绑定 ConfigProvider 上下文的 modal 实例；
// 无 TmApp 时降级 ant 全局 Modal（功能可用、主题不跟随）。
// 与 components/modal/index.ts 的组件式 TmModal 通过 Object.assign 合并导出。
import { Modal as antModal } from 'ant-design-vue'
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm'
import { getHolder } from '../../../utils/feedbackHolder'

/** ant Modal 命令式方法类型（ModalStaticFunctions 含 warn，剔除） */
export type ModalFuncs = Omit<ModalStaticFunctions, 'warn'>

/** 选择实例：holder 优先（有上下文），否则 ant 全局
 * antModal 全局对象类型是 ModalStaticFunctions & Modal 组件；holder.modal 是
 * Omit<ModalStaticFunctions,'warn'>。cast 到 ModalFuncs 统一（命令式方法签名一致） */
function pick(): ModalFuncs {
  return getHolder()?.modal ?? (antModal as unknown as ModalFuncs)
}

/** TmModal 命令式静态方法：任意位置调用弹出全局对话框 */
export const TmModalConfirm: ModalFuncs = {
  confirm: (...args: Parameters<ModalFuncs['confirm']>) => pick().confirm(...args),
  info: (...args: Parameters<ModalFuncs['info']>) => pick().info(...args),
  success: (...args: Parameters<ModalFuncs['success']>) => pick().success(...args),
  error: (...args: Parameters<ModalFuncs['error']>) => pick().error(...args),
  warning: (...args: Parameters<ModalFuncs['warning']>) => pick().warning(...args),
}
