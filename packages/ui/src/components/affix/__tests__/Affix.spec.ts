// packages/ui/src/components/affix/__tests__/Affix.spec.ts
// TmAffix 单测：渲染、props 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmAffix from '../src/Affix.vue'

describe('TmAffix', () => {
  it('渲染内部 ant Affix 并透传 offsetTop', () => {
    const wrapper = mount(TmAffix, { props: { offsetTop: 80 } })
    const inner = wrapper.findComponent({ name: 'AAffix' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('offsetTop')).toBe(80)
  })

  it('ant 原生透传：offsetBottom / target 下发', () => {
    const target = () => document.body
    const wrapper = mount(TmAffix, { props: { offsetBottom: 20, target } })
    const inner = wrapper.findComponent({ name: 'AAffix' })
    expect(inner.props('offsetBottom')).toBe(20)
    expect(inner.props('target')).toBe(target)
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmAffix, { slots: { default: '<span class="affix-child">内容</span>' } })
    expect(wrapper.find('.affix-child').exists()).toBe(true)
  })
})
