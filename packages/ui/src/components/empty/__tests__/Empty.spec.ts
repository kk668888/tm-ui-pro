// packages/ui/src/components/empty/__tests__/Empty.spec.ts
// TmEmpty 单测：公司默认文案、业务覆盖、ant 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmEmpty from '../src/Empty.vue'

describe('TmEmpty', () => {
  it('未传 description 时展示公司默认「暂无数据」', () => {
    const wrapper = mount(TmEmpty)
    expect(wrapper.text()).toContain('暂无数据')
  })

  it('业务显式 description 覆盖公司默认', () => {
    const wrapper = mount(TmEmpty, { props: { description: '列表为空，请先创建' } })
    expect(wrapper.text()).toContain('列表为空，请先创建')
    expect(wrapper.text()).not.toContain('暂无数据')
  })

  it('ant 原生透传：image 属性下发到内部 ant Empty', () => {
    const wrapper = mount(TmEmpty, { props: { description: 'x', image: 'https://example.com/empty.png' } })
    const inner = wrapper.findComponent({ name: 'AEmpty' })
    expect(inner.props('image')).toBe('https://example.com/empty.png')
  })

  it('插槽透传：default 插槽转发到内部 ant Empty', () => {
    const wrapper = mount(TmEmpty, { slots: { default: '<button class="empty-action">去创建</button>' } })
    expect(wrapper.find('.empty-action').exists()).toBe(true)
  })
})
