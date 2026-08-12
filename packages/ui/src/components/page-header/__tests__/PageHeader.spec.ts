// packages/ui/src/components/page-header/__tests__/PageHeader.spec.ts
// TmPageHeader 单测：渲染、props 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmPageHeader from '../src/PageHeader.vue'

describe('TmPageHeader', () => {
  it('渲染内部 ant PageHeader 并透传 title / subTitle', () => {
    const wrapper = mount(TmPageHeader, { props: { title: '标题', subTitle: '副标题' } })
    const inner = wrapper.findComponent({ name: 'APageHeader' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('title')).toBe('标题')
    expect(inner.props('subTitle')).toBe('副标题')
  })

  it('ant 原生透传：backIcon 下发', () => {
    const wrapper = mount(TmPageHeader, { props: { backIcon: false } })
    const inner = wrapper.findComponent({ name: 'APageHeader' })
    expect(inner.props('backIcon')).toBe(false)
  })

  it('default 插槽透传（内容区）', () => {
    const wrapper = mount(TmPageHeader, { slots: { default: '<span class="ph-child">内容</span>' } })
    expect(wrapper.find('.ph-child').exists()).toBe(true)
  })
})
