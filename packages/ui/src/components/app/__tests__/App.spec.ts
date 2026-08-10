// packages/ui/src/components/app/App.spec.ts
// TmApp 单测：渲染 slot + 捕获反馈实例到 holder
import { describe, it, expect, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TmApp from '../index'
import { getHolder, resetHolder } from '../../../utils/feedbackHolder'

describe('TmApp', () => {
  beforeEach(() => resetHolder())

  it('渲染内部 ant App + 业务 slot 内容', () => {
    const wrapper = mount(TmApp, {
      slots: { default: '<span class="app-content">业务内容</span>' },
      attachTo: document.body,
    })
    try {
      expect(wrapper.find('.app-content').exists()).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })

  it('mount 后捕获反馈实例到 holder（TmMessage 等命令式 API 可消费）', () => {
    const wrapper = mount(TmApp, { attachTo: document.body })
    try {
      expect(getHolder()).toBeDefined()
      expect(typeof getHolder()?.message?.success).toBe('function')
      expect(typeof getHolder()?.modal?.confirm).toBe('function')
    } finally {
      wrapper.unmount()
    }
  })
})
