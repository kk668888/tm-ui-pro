// packages/ui/src/components/checkbox/__tests__/Checkbox.spec.ts
// TmCheckbox 单测：checked 受控、props 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmCheckbox from '../src/Checkbox.vue'

describe('TmCheckbox', () => {
  it('渲染内部 ant Checkbox 并透传 checked', () => {
    const wrapper = mount(TmCheckbox, { props: { checked: true } })
    const inner = wrapper.findComponent({ name: 'ACheckbox' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('checked')).toBe(true)
  })

  it('ant 原生透传：value / indeterminate / disabled 下发', () => {
    const wrapper = mount(TmCheckbox, { props: { value: 'a', indeterminate: true, disabled: true } })
    const inner = wrapper.findComponent({ name: 'ACheckbox' })
    expect(inner.props('value')).toBe('a')
    expect(inner.props('indeterminate')).toBe(true)
    expect(inner.props('disabled')).toBe(true)
  })

  it('default 插槽透传（选项文案）', () => {
    const wrapper = mount(TmCheckbox, { slots: { default: '<span class="cb-child">选项</span>' } })
    expect(wrapper.find('.cb-child').exists()).toBe(true)
  })
})
