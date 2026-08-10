// packages/ui/src/utils/feedbackHolder.spec.ts
// feedbackHolder 单测：set/get/覆盖/复位
import { describe, it, expect, beforeEach } from 'vitest'
import { setHolder, getHolder, resetHolder, type FeedbackHolder } from './feedbackHolder'

function makeHolder(): FeedbackHolder {
  return {
    message: { success: () => () => void 0 } as unknown as FeedbackHolder['message'],
    notification: { success: () => void 0 } as unknown as FeedbackHolder['notification'],
    modal: { confirm: () => void 0 } as unknown as FeedbackHolder['modal'],
  }
}

describe('feedbackHolder', () => {
  beforeEach(() => resetHolder())

  it('初始为 undefined（业务未包裹 TmApp 时命令式 API 降级）', () => {
    expect(getHolder()).toBeUndefined()
  })

  it('setHolder 后可读取同一引用', () => {
    const h = makeHolder()
    setHolder(h)
    expect(getHolder()).toBe(h)
  })

  it('重复 setHolder 覆盖为最新引用（不可变更新）', () => {
    const h1 = makeHolder()
    const h2 = makeHolder()
    setHolder(h1)
    setHolder(h2)
    expect(getHolder()).toBe(h2)
    expect(getHolder()).not.toBe(h1)
  })

  it('resetHolder 清空后返回 undefined', () => {
    setHolder(makeHolder())
    resetHolder()
    expect(getHolder()).toBeUndefined()
  })
})
