// packages/ui/src/components/radio/__tests__/Radio.spec.ts
// TmRadio 单测：checked 受控、props 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmRadio from '../src/Radio.vue'

describe('TmRadio', () => {
  it('渲染内部 ant Radio 并透传 checked', () => {
    const wrapper = mount(TmRadio, { props: { checked: true } })
    const inner = wrapper.findComponent({ name: 'ARadio' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('checked')).toBe(true)
  })

  it('ant 原生透传：value / disabled 下发', () => {
    const wrapper = mount(TmRadio, { props: { value: 'a', disabled: true } })
    const inner = wrapper.findComponent({ name: 'ARadio' })
    expect(inner.props('value')).toBe('a')
    expect(inner.props('disabled')).toBe(true)
  })

  it('default 插槽透传（选项文案）', () => {
    const wrapper = mount(TmRadio, { slots: { default: '<span class="rd-child">选项</span>' } })
    expect(wrapper.find('.rd-child').exists()).toBe(true)
  })
})
