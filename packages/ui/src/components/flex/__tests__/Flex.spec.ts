// packages/ui/src/components/flex/__tests__/Flex.spec.ts
// TmFlex 单测：公司默认间距、业务覆盖、ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmFlex from '../src/Flex.vue'

describe('TmFlex', () => {
  it('公司默认 gap=middle 下发（与 TmSpace 间距对齐）', () => {
    const wrapper = mount(TmFlex)
    const inner = wrapper.findComponent({ name: 'AFlex' })
    expect(inner.props('gap')).toBe('middle')
  })

  it('业务覆盖 gap 生效', () => {
    const wrapper = mount(TmFlex, { props: { gap: 'large' } })
    const inner = wrapper.findComponent({ name: 'AFlex' })
    expect(inner.props('gap')).toBe('large')
  })

  it('ant 原生透传：vertical / justify / align 下发', () => {
    const wrapper = mount(TmFlex, { props: { vertical: true, justify: 'space-between', align: 'center' } })
    const inner = wrapper.findComponent({ name: 'AFlex' })
    expect(inner.props('vertical')).toBe(true)
    expect(inner.props('justify')).toBe('space-between')
    expect(inner.props('align')).toBe('center')
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmFlex, { slots: { default: '<span class="flex-child">a</span>' } })
    expect(wrapper.find('.flex-child').exists()).toBe(true)
  })
})
