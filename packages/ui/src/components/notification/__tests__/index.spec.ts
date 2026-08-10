// packages/ui/src/components/notification/index.spec.ts
// TmNotification 单测：holder 优先 + 无 holder 降级 ant 全局
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { notification as antNotification } from 'ant-design-vue'
import { TmNotification } from '../index'
import { setHolder, resetHolder, type FeedbackHolder } from '../../../utils/feedbackHolder'

function makeHolder(): FeedbackHolder {
  return {
    message: {} as FeedbackHolder['message'],
    notification: {
      success: vi.fn(),
      info: vi.fn(),
      warning: vi.fn(),
      error: vi.fn(),
    } as unknown as FeedbackHolder['notification'],
    modal: {} as FeedbackHolder['modal'],
  }
}

describe('TmNotification', () => {
  beforeEach(() => resetHolder())
  afterEach(() => vi.restoreAllMocks())

  it('holder 优先：有 TmApp 时用绑定上下文的实例', () => {
    const h = makeHolder()
    setHolder(h)
    TmNotification.success({ message: '任务完成', description: 'xxx' })
    expect(h.notification.success).toHaveBeenCalledWith({ message: '任务完成', description: 'xxx' })
  })

  it('holder 分支：四个方法（success/info/warning/error）都用上下文实例', () => {
    const h = makeHolder()
    setHolder(h)
    TmNotification.success({ message: 'a' })
    TmNotification.info({ message: 'b' })
    TmNotification.warning({ message: 'c' })
    TmNotification.error({ message: 'd' })
    expect(h.notification.success).toHaveBeenCalled()
    expect(h.notification.info).toHaveBeenCalled()
    expect(h.notification.warning).toHaveBeenCalled()
    expect(h.notification.error).toHaveBeenCalled()
  })

  it('无 holder 降级 ant 全局：真实调用 ant notification', () => {
    const spy = vi.spyOn(antNotification, 'success')
    TmNotification.success({ message: '任务完成' })
    expect(spy).toHaveBeenCalledWith({ message: '任务完成' })
  })
})
