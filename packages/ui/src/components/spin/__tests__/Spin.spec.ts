// packages/ui/src/components/spin/__tests__/Spin.spec.ts
// TmSpin 单测：spinning 默认兜底、显式覆盖、ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmSpin from '../src/Spin.vue'

describe('TmSpin', () => {
  it('spinning 默认 true（Boolean 陷阱兜底，还原 ant 默认加载态）', () => {
    const wrapper = mount(TmSpin)
    expect(wrapper.findComponent({ name: 'ASpin' }).props('spinning')).toBe(true)
  })

  it('显式 :spinning="false" 覆盖默认，关闭加载态', () => {
    const wrapper = mount(TmSpin, { props: { spinning: false } })
    expect(wrapper.findComponent({ name: 'ASpin' }).props('spinning')).toBe(false)
  })

  it('ant 原生透传：tip / size', () => {
    const wrapper = mount(TmSpin, { props: { tip: '加载中', size: 'large' } })
    const inner = wrapper.findComponent({ name: 'ASpin' })
    expect(inner.props('tip')).toBe('加载中')
    expect(inner.props('size')).toBe('large')
  })

  it('插槽透传：default 包裹内容转发到内部 ant Spin', () => {
    const wrapper = mount(TmSpin, { slots: { default: '<div class="content">内容</div>' } })
    expect(wrapper.find('.content').exists()).toBe(true)
  })
})
