// packages/ui/src/components/space/__tests__/Space.spec.ts
// TmSpace 单测：公司默认间距、业务覆盖、ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmSpace from '../src/Space.vue'

describe('TmSpace', () => {
  it('公司默认 size=middle 下发到内部 ant Space', () => {
    const wrapper = mount(TmSpace, { slots: { default: '<span>a</span><span>b</span>' } })
    const inner = wrapper.findComponent({ name: 'ASpace' })
    expect(inner.props('size')).toBe('middle')
  })

  it('业务覆盖 size 生效', () => {
    const wrapper = mount(TmSpace, { props: { size: 'large' } })
    const inner = wrapper.findComponent({ name: 'ASpace' })
    expect(inner.props('size')).toBe('large')
  })

  it('ant 原生透传：direction / align 下发', () => {
    const wrapper = mount(TmSpace, { props: { direction: 'vertical', align: 'center' } })
    const inner = wrapper.findComponent({ name: 'ASpace' })
    expect(inner.props('direction')).toBe('vertical')
    expect(inner.props('align')).toBe('center')
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmSpace, { slots: { default: '<span class="space-child">a</span>' } })
    expect(wrapper.find('.space-child').exists()).toBe(true)
  })

  it('split 扩展键：prop 形式自动转插槽渲染分隔符', () => {
    // 公司扩展：ant Space 的 split 是具名插槽（spaceProps 未声明 split prop），
    // TmSpace 支持 `split="|"` prop 形式，wrapper 自动转为 #split 插槽
    const wrapper = mount(TmSpace, {
      props: { split: '|' },
      slots: { default: '<span>a</span><span>b</span>' },
    })
    // ant Space 在子项之间渲染分隔符元素 ant-space-item-split
    expect(wrapper.find('.ant-space-item-split').exists()).toBe(true)
    expect(wrapper.find('.ant-space-item-split').text()).toBe('|')
  })

  it('split 扩展键：不泄漏为内部 DOM 的 HTML 属性', () => {
    const wrapper = mount(TmSpace, {
      props: { split: '|' },
      slots: { default: '<span>a</span>' },
    })
    // split 已从透传对象剔除，内部 div 不应带 split 属性
    expect(wrapper.find('div').attributes('split')).toBeUndefined()
  })

  it('split 扩展键：#split 插槽形式优先于 prop', () => {
    const wrapper = mount(TmSpace, {
      props: { split: '/' },
      slots: {
        default: '<span>a</span><span>b</span>',
        split: '<span class="space-split">|</span>',
      },
    })
    // 显式插槽优先，prop 值（/）不生效
    expect(wrapper.find('.space-split').text()).toBe('|')
    expect(wrapper.find('.ant-space-item-split').exists()).toBe(true)
  })

  it('split 具名插槽（ant 原生）透传渲染分隔符', () => {
    const wrapper = mount(TmSpace, {
      slots: {
        default: '<span>a</span><span>b</span>',
        split: '<span class="space-split-2">|</span>',
      },
    })
    expect(wrapper.find('.space-split-2').exists()).toBe(true)
  })
})
