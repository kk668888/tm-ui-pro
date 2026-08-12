// packages/ui/src/components/grid/__tests__/Grid.spec.ts
// TmGrid 单测：TmRow / TmCol 透传、响应式、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmRow from '../src/Row.vue'
import TmCol from '../src/Col.vue'

describe('TmRow', () => {
  it('ant 原生透传：gutter / justify / align 下发', () => {
    const wrapper = mount(TmRow, { props: { gutter: 16, justify: 'space-between', align: 'middle' } })
    const inner = wrapper.findComponent({ name: 'ARow' })
    expect(inner.props('gutter')).toBe(16)
    expect(inner.props('justify')).toBe('space-between')
    expect(inner.props('align')).toBe('middle')
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmRow, { slots: { default: '<span class="row-child">a</span>' } })
    expect(wrapper.find('.row-child').exists()).toBe(true)
  })
})

describe('TmCol', () => {
  it('ant 原生透传：span / offset 下发', () => {
    const wrapper = mount(TmCol, { props: { span: 8, offset: 4 } })
    const inner = wrapper.findComponent({ name: 'ACol' })
    expect(inner.props('span')).toBe(8)
    expect(inner.props('offset')).toBe(4)
  })

  it('响应式断点透传：xs / md 下发', () => {
    const wrapper = mount(TmCol, { props: { xs: 24, md: 12 } })
    const inner = wrapper.findComponent({ name: 'ACol' })
    expect(inner.props('xs')).toBe(24)
    expect(inner.props('md')).toBe(12)
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmCol, { slots: { default: '<span class="col-child">b</span>' } })
    expect(wrapper.find('.col-child').exists()).toBe(true)
  })
})
