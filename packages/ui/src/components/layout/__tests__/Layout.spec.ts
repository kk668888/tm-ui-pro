// packages/ui/src/components/layout/__tests__/Layout.spec.ts
// TmLayout 单测：五子组件渲染、ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmLayout from '../src/Layout.vue'
import TmSider from '../src/Sider.vue'
import TmHeader from '../src/Header.vue'
import TmContent from '../src/Content.vue'
import TmFooter from '../src/Footer.vue'

describe('TmLayout', () => {
  it('渲染内部 ant Layout 容器', () => {
    const wrapper = mount(TmLayout)
    expect(wrapper.findComponent({ name: 'ALayout' }).exists()).toBe(true)
  })

  it('hasSider 透传', () => {
    const wrapper = mount(TmLayout, { props: { hasSider: true } })
    const inner = wrapper.findComponent({ name: 'ALayout' })
    expect(inner.props('hasSider')).toBe(true)
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmLayout, { slots: { default: '<div class="layout-child">x</div>' } })
    expect(wrapper.find('.layout-child').exists()).toBe(true)
  })
})

describe('TmSider', () => {
  it('ant 原生透传：collapsible / collapsed / theme 下发', () => {
    const wrapper = mount(TmSider, { props: { collapsible: true, collapsed: false, theme: 'dark' } })
    const inner = wrapper.findComponent({ name: 'ALayoutSider' })
    expect(inner.props('collapsible')).toBe(true)
    expect(inner.props('collapsed')).toBe(false)
    expect(inner.props('theme')).toBe('dark')
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmSider, { slots: { default: '<span class="sider-child">菜单</span>' } })
    expect(wrapper.find('.sider-child').exists()).toBe(true)
  })
})

describe('TmHeader / TmContent / TmFooter', () => {
  it('渲染对应 ant 区块组件', () => {
    expect(mount(TmHeader).findComponent({ name: 'ALayoutHeader' }).exists()).toBe(true)
    expect(mount(TmContent).findComponent({ name: 'ALayoutContent' }).exists()).toBe(true)
    expect(mount(TmFooter).findComponent({ name: 'ALayoutFooter' }).exists()).toBe(true)
  })

  it('区块插槽透传', () => {
    const wrapper = mount(TmHeader, { slots: { default: '<span class="hdr">头部</span>' } })
    expect(wrapper.find('.hdr').exists()).toBe(true)
  })
})
