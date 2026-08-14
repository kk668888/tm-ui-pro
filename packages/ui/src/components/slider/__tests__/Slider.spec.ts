// packages/ui/src/components/slider/__tests__/Slider.spec.ts
// TmSlider 单测：ant 原生透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmSlider from '../src/Slider.vue'

describe('TmSlider', () => {
  it('渲染内部 ant Slider 并透传 min/max/step', () => {
    const wrapper = mount(TmSlider, { props: { min: 0, max: 100, step: 10 } })
    const inner = wrapper.findComponent({ name: 'ASlider' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('min')).toBe(0)
    expect(inner.props('max')).toBe(100)
    expect(inner.props('step')).toBe(10)
  })

  it('ant 原生透传：range / marks 下发', () => {
    const marks = { 0: '0', 50: '50', 100: '100' }
    const wrapper = mount(TmSlider, { props: { range: true, marks } })
    const inner = wrapper.findComponent({ name: 'ASlider' })
    expect(inner.props('range')).toBe(true)
    expect(inner.props('marks')).toEqual(marks)
  })

  it('tipFormatter 透传', () => {
    // ant Slider tipFormatter 签名 (value?: number) => any；测试函数按同签名声明
    const tipFormatter = (v?: number) => `值:${v}`
    const wrapper = mount(TmSlider, { props: { tipFormatter } })
    expect(wrapper.findComponent({ name: 'ASlider' }).props('tipFormatter')).toBe(tipFormatter)
  })
})
