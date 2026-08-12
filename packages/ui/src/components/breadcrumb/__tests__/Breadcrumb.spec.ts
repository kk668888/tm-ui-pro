// packages/ui/src/components/breadcrumb/__tests__/Breadcrumb.spec.ts
// TmBreadcrumb 单测：子组件族渲染、分隔符、props 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmBreadcrumb from '../src/Breadcrumb.vue'
import TmBreadcrumbItem from '../src/BreadcrumbItem.vue'
import TmBreadcrumbSeparator from '../src/BreadcrumbSeparator.vue'

describe('TmBreadcrumb', () => {
  it('渲染内部 ant Breadcrumb 并透传 separator', () => {
    const wrapper = mount(TmBreadcrumb, {
      props: { separator: '>' },
      slots: { default: '<span>首页</span><span>列表</span>' },
    })
    const inner = wrapper.findComponent({ name: 'ABreadcrumb' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('separator')).toBe('>')
  })

  it('ant 原生透传：routes / itemRender 下发', () => {
    const routes = [{ breadcrumbName: '首页' }, { breadcrumbName: '列表' }]
    const wrapper = mount(TmBreadcrumb, { props: { routes } })
    const inner = wrapper.findComponent({ name: 'ABreadcrumb' })
    expect(inner.props('routes')).toEqual(routes)
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmBreadcrumb, { slots: { default: '<span class="crumb-child">首页</span>' } })
    expect(wrapper.find('.crumb-child').exists()).toBe(true)
  })
})

describe('TmBreadcrumbItem / TmBreadcrumbSeparator', () => {
  it('渲染内部 ant 组件', () => {
    expect(mount(TmBreadcrumbItem).findComponent({ name: 'ABreadcrumbItem' }).exists()).toBe(true)
    expect(mount(TmBreadcrumbSeparator).findComponent({ name: 'ABreadcrumbSeparator' }).exists()).toBe(true)
  })

  it('面包屑项插槽透传', () => {
    const wrapper = mount(TmBreadcrumbItem, { slots: { default: '<span class="item-child">列表</span>' } })
    expect(wrapper.find('.item-child').exists()).toBe(true)
  })
})
