// packages/ui/src/components/rate/__tests__/Rate.spec.ts
// TmRate 单测：ant 原生透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmRate from '../src/Rate.vue'

describe('TmRate', () => {
  it('渲染内部 ant Rate 并透传 count / allowHalf', () => {
    const wrapper = mount(TmRate, { props: { count: 10, allowHalf: true } })
    const inner = wrapper.findComponent({ name: 'ARate' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('count')).toBe(10)
    expect(inner.props('allowHalf')).toBe(true)
  })

  it('ant 原生透传：allowClear / disabled 下发', () => {
    const wrapper = mount(TmRate, { props: { allowClear: false, disabled: true } })
    const inner = wrapper.findComponent({ name: 'ARate' })
    expect(inner.props('allowClear')).toBe(false)
    expect(inner.props('disabled')).toBe(true)
  })

  it('ant 原生透传：character / tooltips 下发', () => {
    const character = '好'
    const tooltips = ['很差', '很好']
    const wrapper = mount(TmRate, { props: { character, tooltips } })
    const inner = wrapper.findComponent({ name: 'ARate' })
    expect(inner.props('character')).toBe(character)
    expect(inner.props('tooltips')).toEqual(tooltips)
  })
})
