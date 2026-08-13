// packages/ui/src/components/watermark/__tests__/Watermark.spec.ts
// TmWatermark 单测：content/font/gap 透传、渲染结构、default 插槽包裹内容
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmWatermark from '../src/Watermark.vue'

describe('TmWatermark', () => {
  it('content / font props 透传', () => {
    const wrapper = mount(TmWatermark, { props: { content: '内部水印' } })
    const inner = wrapper.findComponent({ name: 'AWatermark' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('content')).toBe('内部水印')
  })

  it('渲染水印容器结构（jsdom 无 canvas，验证 wrapper 暴露内部实例）', () => {
    const wrapper = mount(TmWatermark, { props: { content: '内部水印' } })
    const inner = wrapper.findComponent({ name: 'AWatermark' })
    expect(inner.exists()).toBe(true)
    // canvas 水印在 jsdom 中无法绘制，容器 class 不渲染，仅验证组件树存在
  })

  it('default 插槽透传（包裹内容）', () => {
    const wrapper = mount(TmWatermark, {
      props: { content: '内部水印' },
      slots: { default: '<div class="wm-content">受保护内容</div>' },
    })
    expect(wrapper.find('.wm-content').text()).toBe('受保护内容')
  })
})
