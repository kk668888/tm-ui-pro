// packages/ui/src/components/message/index.spec.ts
// TmMessage 单测：holder 优先（TmApp 上下文）+ 无 holder 降级 ant 全局
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { message as antMessage } from 'ant-design-vue'
import { TmMessage } from './index'
import { setHolder, resetHolder, type FeedbackHolder } from '../../utils/feedbackHolder'

function makeHolder(): FeedbackHolder {
  return {
    message: {
      success: vi.fn(() => () => void 0),
      info: vi.fn(() => () => void 0),
      warning: vi.fn(() => () => void 0),
      error: vi.fn(() => () => void 0),
      loading: vi.fn(() => () => void 0),
    } as unknown as FeedbackHolder['message'],
    notification: {} as FeedbackHolder['notification'],
    modal: {} as FeedbackHolder['modal'],
  }
}

describe('TmMessage', () => {
  beforeEach(() => resetHolder())
  afterEach(() => vi.restoreAllMocks())

  it('holder 优先：有 TmApp 时用绑定上下文的实例', () => {
    const h = makeHolder()
    setHolder(h)
    TmMessage.success({ content: '保存成功', duration: 2 })
    expect(h.message.success).toHaveBeenCalledWith({ content: '保存成功', duration: 2 })
  })

  it('holder 分支：五个方法（success/info/warning/error/loading）都用上下文实例', () => {
    const h = makeHolder()
    setHolder(h)
    TmMessage.success('a')
    TmMessage.info('b')
    TmMessage.warning('c')
    TmMessage.error('d')
    TmMessage.loading('e')
    expect(h.message.success).toHaveBeenCalled()
    expect(h.message.info).toHaveBeenCalled()
    expect(h.message.warning).toHaveBeenCalled()
    expect(h.message.error).toHaveBeenCalled()
    expect(h.message.loading).toHaveBeenCalled()
  })

  it('无 holder 降级 ant 全局：真实调用 ant message', () => {
    const spy = vi.spyOn(antMessage, 'success')
    TmMessage.success('保存成功')
    expect(spy).toHaveBeenCalledWith('保存成功')
  })
})
