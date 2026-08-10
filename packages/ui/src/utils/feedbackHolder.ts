// packages/ui/src/utils/feedbackHolder.ts
// feedbackHolder：模块级单例持有全局反馈实例（design.md 决策 1）
//
// 背景：ant 4.x 的全局反馈（message/notification/modal）是命令式 API，不走组件树，
// 拿不到 TmConfigProvider 下发的 locale/token。TmApp 在组件树内用 ant 的
// message.useMessage() / notification.useNotification() / Modal.useModal() 创建
// 绑定了 ConfigProvider 上下文的实例，存到本模块；TmMessage 等命令式 API 读取。
//
// 不可变引用更新（setHolder 覆盖整个对象引用），与 withInstall 的不可变约定一致。
import type { MessageInstance } from 'ant-design-vue/es/message/interface'
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface'
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm'

/** 全局反馈 holder 结构（与 ant useApp 返回值对齐，剔除弃用的 warn） */
export interface FeedbackHolder {
  message: MessageInstance
  notification: NotificationInstance
  modal: Omit<ModalStaticFunctions, 'warn'>
}

/** 模块级单例（未包裹 TmApp 时为 undefined，命令式 API 降级到 ant 全局） */
let holder: FeedbackHolder | undefined

/** TmApp 内部调用：捕获绑定 ConfigProvider 上下文的反馈实例（不可变覆盖）
 * 注：不做嵌套/重复挂载的 dev 警告（import.meta.env 需 vite/client 类型，且组件库 es 产物
 * 不应引用 env 全局），嵌套场景由业务保证单实例 */
export function setHolder(h: FeedbackHolder): void {
  holder = h
}

/** TmMessage 等命令式 API 读取：无 TmApp 时返回 undefined，调用方降级 */
export function getHolder(): FeedbackHolder | undefined {
  return holder
}

/** 清空 holder（测试隔离用；业务一般不需要） */
export function resetHolder(): void {
  holder = undefined
}
