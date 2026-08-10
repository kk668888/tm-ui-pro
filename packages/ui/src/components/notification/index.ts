// packages/ui/src/components/notification/index.ts
// TmNotification：全局通知命令式 API（函数式导出形态）
//
// 有 TmApp 包裹（holder 非空）时用绑定 ConfigProvider 上下文的 notification 实例；
// 无 TmApp 时降级 ant 全局 notification。
import { notification as antNotification } from 'ant-design-vue'
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface'
import { getHolder } from '../../utils/feedbackHolder'

/** 选择实例：holder 优先（有上下文），否则 ant 全局
 * antNotification 全局对象类型是 NotificationApi（含 useNotification 等），
 * 与 holder.notification（useNotification 返回的 NotificationInstance）方法签名一致；cast 统一
 */
function pick(): NotificationInstance {
  return getHolder()?.notification ?? (antNotification as unknown as NotificationInstance)
}

/** TmNotification 静态方法：任意位置调用显示右上角通知卡片 */
export const TmNotification = {
  success: (...args: Parameters<NotificationInstance['success']>) => pick().success(...args),
  info: (...args: Parameters<NotificationInstance['info']>) => pick().info(...args),
  warning: (...args: Parameters<NotificationInstance['warning']>) => pick().warning(...args),
  error: (...args: Parameters<NotificationInstance['error']>) => pick().error(...args),
} as const

export default TmNotification
