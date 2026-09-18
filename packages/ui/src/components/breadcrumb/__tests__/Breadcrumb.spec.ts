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
    // ant Breadcrumb routes 类型为 Route[]（path 必填），测试数据补 path 字段
    const routes = [
      { path: '/', breadcrumbName: '首页' },
      { path: '/list', breadcrumbName: '列表' },
    ]
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

// 分隔符行为锁定（实测 ant-design-vue 4.2.6）：文档「分隔符自定义」一节据此编写
describe('TmBreadcrumb 分隔符', () => {
  const sepsOf = (wrapper: { findAll: (s: string) => { text: () => string }[] }): string[] =>
    wrapper.findAll('.ant-breadcrumb-separator').map((s) => s.text())

  it('容器级 separator 生效于每个子项', () => {
    const wrapper = mount({
      components: { TmBreadcrumb, TmBreadcrumbItem },
      template: `<TmBreadcrumb separator="→">
        <TmBreadcrumbItem>首页</TmBreadcrumbItem>
        <TmBreadcrumbItem>列表</TmBreadcrumbItem>
      </TmBreadcrumb>`,
    })
    expect(sepsOf(wrapper)).toEqual(['→', '→'])
  })

  it('Item 级 separator 属性被容器覆盖（ant cloneVNode 行为，勿在文档里教错）', () => {
    const wrapper = mount({
      components: { TmBreadcrumb, TmBreadcrumbItem },
      template: `<TmBreadcrumb>
        <TmBreadcrumbItem separator=">">首页</TmBreadcrumbItem>
        <TmBreadcrumbItem>列表</TmBreadcrumbItem>
      </TmBreadcrumb>`,
    })
    expect(sepsOf(wrapper)).toEqual(['/', '/'])
  })

  it('separator="" + 显式 TmBreadcrumbSeparator：只渲染声明的分隔符且不重复', () => {
    const wrapper = mount({
      components: { TmBreadcrumb, TmBreadcrumbItem, TmBreadcrumbSeparator },
      template: `<TmBreadcrumb separator="">
        <TmBreadcrumbItem>首页</TmBreadcrumbItem>
        <TmBreadcrumbSeparator>:</TmBreadcrumbSeparator>
        <TmBreadcrumbItem>列表</TmBreadcrumbItem>
        <TmBreadcrumbSeparator><span>|</span></TmBreadcrumbSeparator>
        <TmBreadcrumbItem>详情</TmBreadcrumbItem>
      </TmBreadcrumb>`,
    })
    // 若容器不是空串，子项会各带一个默认 `/`，这里就会变成 ['/', ':', '/', '|', '/']
    expect(sepsOf(wrapper)).toEqual([':', '|'])
  })
})
