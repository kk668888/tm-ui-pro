// packages/ui/src/components/card/__tests__/Card.spec.ts
// TmCard 单测：公司默认 bordered/size、业务覆盖、props/插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmCard from '../src/Card.vue'

describe('TmCard', () => {
  it('公司默认 bordered=true / size=default 下发', () => {
    const wrapper = mount(TmCard)
    const inner = wrapper.findComponent({ name: 'ACard' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('bordered')).toBe(true)
    expect(inner.props('size')).toBe('default')
  })

  it('业务覆盖 bordered=false / size=small 生效', () => {
    const wrapper = mount(TmCard, { props: { bordered: false, size: 'small' } })
    const inner = wrapper.findComponent({ name: 'ACard' })
    expect(inner.props('bordered')).toBe(false)
    expect(inner.props('size')).toBe('small')
  })

  it('ant 原生透传：title / hoverable / actions 下发', () => {
    const wrapper = mount(TmCard, { props: { title: '卡片标题', hoverable: true } })
    const inner = wrapper.findComponent({ name: 'ACard' })
    expect(inner.props('title')).toBe('卡片标题')
    expect(inner.props('hoverable')).toBe(true)
  })

  it('default 插槽透传（卡片内容渲染）', () => {
    const wrapper = mount(TmCard, { slots: { default: '<p class="card-body">内容区</p>' } })
    expect(wrapper.find('.ant-card-body .card-body').text()).toBe('内容区')
  })
})
