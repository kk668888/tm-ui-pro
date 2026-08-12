// packages/ui/src/components/anchor/__tests__/Anchor.spec.ts
// TmAnchor 单测：子组件族渲染、affix/items 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmAnchor from '../src/Anchor.vue'
import TmAnchorLink from '../src/AnchorLink.vue'

describe('TmAnchor', () => {
  it('渲染内部 ant Anchor 并透传 affix', () => {
    const wrapper = mount(TmAnchor, { props: { affix: false } })
    const inner = wrapper.findComponent({ name: 'AAnchor' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('affix')).toBe(false)
  })

  it('default 插槽透传（AnchorLink）', () => {
    const wrapper = mount(TmAnchor, {
      slots: { default: '<span class="anchor-child">锚点</span>' },
    })
    expect(wrapper.find('.anchor-child').exists()).toBe(true)
  })
})

describe('TmAnchorLink', () => {
  it('渲染内部 ant Anchor.Link 并透传 href / title', () => {
    const wrapper = mount(TmAnchorLink, { props: { href: '#sec1', title: '章节一' } })
    const inner = wrapper.findComponent({ name: 'AAnchorLink' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('href')).toBe('#sec1')
    expect(inner.props('title')).toBe('章节一')
  })

  it('default 插槽透传（二级链接）', () => {
    const wrapper = mount(TmAnchorLink, { slots: { default: '<span class="alink-child">二级</span>' } })
    expect(wrapper.find('.alink-child').exists()).toBe(true)
  })
})
