// packages/ui/src/components/message/index.ts
// TmMessage：全局消息命令式 API（本库首个函数式导出形态）
//
// 有 TmApp 包裹（holder 非空）时用绑定 ConfigProvider 上下文的 message 实例
// （主题/locale 跟随）；无 TmApp 时降级 ant 全局 message（功能可用、主题不跟随）。
import { message as antMessage } from 'ant-design-vue'
import type { MessageInstance } from 'ant-design-vue/es/message/interface'
import { getHolder } from '../../utils/feedbackHolder'

/** 选择实例：holder 优先（有上下文），否则 ant 全局
 * antMessage 全局对象类型是 MessageApi（extends MessageInstance，含 useMessage 等），
 * 与 holder.message（useMessage 返回的 MessageInstance）方法签名一致；cast 统一返回类型
 * （ant 类型细节差异，方法调用不受影响） */
function pick(): MessageInstance {
  return getHolder()?.message ?? (antMessage as unknown as MessageInstance)
}

/** TmMessage 静态方法：任意位置（组件内外）调用显示全局消息 */
export const TmMessage = {
  success: (...args: Parameters<MessageInstance['success']>) => pick().success(...args),
  info: (...args: Parameters<MessageInstance['info']>) => pick().info(...args),
  warning: (...args: Parameters<MessageInstance['warning']>) => pick().warning(...args),
  error: (...args: Parameters<MessageInstance['error']>) => pick().error(...args),
  loading: (...args: Parameters<MessageInstance['loading']>) => pick().loading(...args),
} as const

export default TmMessage
