// packages/ui/src/components/tabs/__tests__/Tabs.spec.ts
// TmTabs 单测：子组件族渲染、activeKey/type 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTabs from '../src/Tabs.vue'
import TmTabPane from '../src/TabPane.vue'

describe('TmTabs', () => {
  it('渲染内部 ant Tabs 并透传 activeKey', () => {
    const wrapper = mount(TmTabs, { props: { activeKey: 'b' } })
    const inner = wrapper.findComponent({ name: 'ATabs' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('activeKey')).toBe('b')
  })

  it('ant 原生透传：type / centered 下发', () => {
    const wrapper = mount(TmTabs, { props: { type: 'card', centered: true } })
    const inner = wrapper.findComponent({ name: 'ATabs' })
    expect(inner.props('type')).toBe('card')
    expect(inner.props('centered')).toBe(true)
  })

  it('default 插槽透传（TabPane）', () => {
    const wrapper = mount(TmTabs, {
      slots: {
        default:
          '<div class="pane-a">内容A</div><div class="pane-b">内容B</div>',
      },
    })
    expect(wrapper.find('.pane-a').exists()).toBe(true)
    expect(wrapper.find('.pane-b').exists()).toBe(true)
  })
})

describe('TmTabPane', () => {
  it('渲染内部 ant TabPane 并透传 tab', () => {
    // 注：key 是 Vue vnode 特殊属性，不作为普通 prop 透传断言，仅验证 tab
    const wrapper = mount(TmTabPane, { props: { tab: '标签A' } })
    const inner = wrapper.findComponent({ name: 'ATabPane' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('tab')).toBe('标签A')
  })
})
