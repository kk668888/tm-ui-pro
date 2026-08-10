// packages/ui/src/components/badge/__tests__/Badge.spec.ts
// TmBadge 单测：ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import TmBadge from '../src/Badge.vue'

describe('TmBadge', () => {
  it('ant 原生透传：count / overflowCount 下发到内部 ant Badge', () => {
    const wrapper = mount(TmBadge, { props: { count: 150, overflowCount: 99 } })
    const inner = wrapper.findComponent({ name: 'ABadge' })
    expect(inner.props('count')).toBe(150)
    expect(inner.props('overflowCount')).toBe(99)
  })

  it('ant 原生透传：status 状态点下发', () => {
    const wrapper = mount(TmBadge, { props: { status: 'processing' } })
    const inner = wrapper.findComponent({ name: 'ABadge' })
    expect(inner.props('status')).toBe('processing')
  })

  it('插槽透传：default 包裹内容转发到内部 ant Badge', () => {
    const wrapper = mount(TmBadge, { props: { count: 5 }, slots: { default: '<span class="badge-child">通知</span>' } })
    expect(wrapper.find('.badge-child').exists()).toBe(true)
  })

  it('插槽透传：count 插槽转发到内部 ant Badge（替代 count prop）', () => {
    const wrapper = mount(TmBadge, {
      slots: { count: () => h('b', { class: 'custom-count' }, '新') },
    })
    expect(wrapper.find('.custom-count').exists()).toBe(true)
  })
})
