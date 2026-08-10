// packages/ui/src/components/modal/confirm.spec.ts
// TmModalConfirm 命令式单测：holder 优先 + 无 holder 降级 ant 全局
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { Modal as antModal } from 'ant-design-vue'
import { TmModalConfirm } from './confirm'
import { setHolder, resetHolder, type FeedbackHolder } from '../../utils/feedbackHolder'

function makeHolder(): FeedbackHolder {
  return {
    message: {} as FeedbackHolder['message'],
    notification: {} as FeedbackHolder['notification'],
    modal: {
      confirm: vi.fn(() => ({ destroy: () => void 0 })),
      info: vi.fn(() => ({ destroy: () => void 0 })),
      success: vi.fn(() => ({ destroy: () => void 0 })),
      error: vi.fn(() => ({ destroy: () => void 0 })),
      warning: vi.fn(() => ({ destroy: () => void 0 })),
    } as unknown as FeedbackHolder['modal'],
  }
}

describe('TmModalConfirm', () => {
  beforeEach(() => resetHolder())
  afterEach(() => vi.restoreAllMocks())

  it('holder 优先：有 TmApp 时用绑定上下文的 modal 实例', () => {
    const h = makeHolder()
    setHolder(h)
    TmModalConfirm.confirm({ title: '删除', content: '确认？' })
    expect(h.modal.confirm).toHaveBeenCalledWith({ title: '删除', content: '确认？' })
  })

  it('holder 分支：五个方法（confirm/info/success/error/warning）都用上下文实例', () => {
    const h = makeHolder()
    setHolder(h)
    TmModalConfirm.confirm({ title: 'a' })
    TmModalConfirm.info({ title: 'b' })
    TmModalConfirm.success({ title: 'c' })
    TmModalConfirm.error({ title: 'd' })
    TmModalConfirm.warning({ title: 'e' })
    expect(h.modal.confirm).toHaveBeenCalled()
    expect(h.modal.info).toHaveBeenCalled()
    expect(h.modal.success).toHaveBeenCalled()
    expect(h.modal.error).toHaveBeenCalled()
    expect(h.modal.warning).toHaveBeenCalled()
  })

  it('无 holder 降级 ant 全局：真实调用 ant Modal', () => {
    const spy = vi.spyOn(antModal, 'confirm')
    TmModalConfirm.confirm({ title: '删除' })
    expect(spy).toHaveBeenCalledWith({ title: '删除' })
  })

  it('暴露 confirm/info/success/error/warning 五个方法', () => {
    expect(typeof TmModalConfirm.confirm).toBe('function')
    expect(typeof TmModalConfirm.info).toBe('function')
    expect(typeof TmModalConfirm.success).toBe('function')
    expect(typeof TmModalConfirm.error).toBe('function')
    expect(typeof TmModalConfirm.warning).toBe('function')
  })
})
