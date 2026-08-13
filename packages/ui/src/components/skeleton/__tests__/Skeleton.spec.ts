// packages/ui/src/components/skeleton/__tests__/Skeleton.spec.ts
// TmSkeleton 单测：props 透传、default 插槽（loading=false 显示 children）、子组件透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmSkeleton from '../src/Skeleton.vue'
import TmSkeletonAvatar from '../src/SkeletonAvatar.vue'
import TmSkeletonButton from '../src/SkeletonButton.vue'
import TmSkeletonImage from '../src/SkeletonImage.vue'
import TmSkeletonInput from '../src/SkeletonInput.vue'

describe('TmSkeleton', () => {
  it('loading / active / avatar / title / paragraph 等 props 透传', () => {
    const wrapper = mount(TmSkeleton, {
      props: { loading: true, active: true, avatar: { size: 'large' }, title: { width: '60%' }, paragraph: { rows: 3 } },
    })
    const inner = wrapper.findComponent({ name: 'ASkeleton' })
    expect(inner.props('loading')).toBe(true)
    expect(inner.props('active')).toBe(true)
    expect(inner.props('avatar')).toEqual({ size: 'large' })
    expect(inner.props('title')).toEqual({ width: '60%' })
    expect(inner.props('paragraph')).toEqual({ rows: 3 })
  })

  it('default 插槽透传（loading=false 时渲染 children）', () => {
    const wrapper = mount(TmSkeleton, {
      props: { loading: false },
      slots: { default: '<div class="skeleton-children">真实内容</div>' },
    })
    expect(wrapper.find('.skeleton-children').exists()).toBe(true)
    expect(wrapper.text()).toContain('真实内容')
  })

  it('TmSkeletonAvatar 子组件透传', () => {
    const wrapper = mount(TmSkeletonAvatar, { props: { size: 'large' } })
    const inner = wrapper.findComponent({ name: 'ASkeletonAvatar' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('size')).toBe('large')
  })

  it('TmSkeletonButton 子组件透传', () => {
    const wrapper = mount(TmSkeletonButton, { props: { size: 'small' } })
    const inner = wrapper.findComponent({ name: 'ASkeletonButton' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('size')).toBe('small')
  })

  it('TmSkeletonImage 子组件透传', () => {
    const wrapper = mount(TmSkeletonImage)
    expect(wrapper.findComponent({ name: 'ASkeletonImage' }).exists()).toBe(true)
  })

  it('TmSkeletonInput 子组件透传', () => {
    const wrapper = mount(TmSkeletonInput, { props: { size: 'small' } })
    const inner = wrapper.findComponent({ name: 'ASkeletonInput' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('size')).toBe('small')
  })
})
