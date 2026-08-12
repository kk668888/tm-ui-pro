// packages/ui/src/components/divider/__tests__/Divider.spec.ts
// TmDivider 单测：公司视觉默认、业务覆盖、ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmDivider from '../src/Divider.vue'

describe('TmDivider', () => {
  it('公司默认 type=horizontal / orientation=center 下发', () => {
    const wrapper = mount(TmDivider)
    const inner = wrapper.findComponent({ name: 'ADivider' })
    expect(inner.props('type')).toBe('horizontal')
    expect(inner.props('orientation')).toBe('center')
  })

  it('业务覆盖 type / orientation 生效', () => {
    const wrapper = mount(TmDivider, { props: { type: 'vertical', orientation: 'left' } })
    const inner = wrapper.findComponent({ name: 'ADivider' })
    expect(inner.props('type')).toBe('vertical')
    expect(inner.props('orientation')).toBe('left')
  })

  it('ant 原生透传：dashed / plain 下发', () => {
    const wrapper = mount(TmDivider, { props: { dashed: true, plain: true } })
    const inner = wrapper.findComponent({ name: 'ADivider' })
    expect(inner.props('dashed')).toBe(true)
    expect(inner.props('plain')).toBe(true)
  })

  it('default 插槽文案透传', () => {
    const wrapper = mount(TmDivider, { slots: { default: '<span class="divider-text">分割</span>' } })
    expect(wrapper.find('.divider-text').exists()).toBe(true)
  })
})
