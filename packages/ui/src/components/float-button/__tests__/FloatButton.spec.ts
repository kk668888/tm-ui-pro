// packages/ui/src/components/float-button/__tests__/FloatButton.spec.ts
// TmFloatButton 单测：props 透传、open 缺省幻影 false 跳过、Group 与 BackTop 子组件透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmFloatButton from '../src/FloatButton.vue'
import TmFloatButtonGroup from '../src/FloatButtonGroup.vue'
import TmFloatButtonBackTop from '../src/FloatButtonBackTop.vue'

describe('TmFloatButton', () => {
  it('icon / description / tooltip 等 props 透传', () => {
    const wrapper = mount(TmFloatButton, {
      props: { description: '帮助', tooltip: '帮助中心' },
    })
    const inner = wrapper.findComponent({ name: 'AFloatButton' })
    expect(inner.props('description')).toBe('帮助')
    expect(inner.props('tooltip')).toBe('帮助中心')
  })
})

describe('TmFloatButtonGroup', () => {
  it('default 插槽透传（组内子按钮）', () => {
    const wrapper = mount(TmFloatButtonGroup, {
      slots: { default: '<div class="fb-child">子按钮</div>' },
    })
    expect(wrapper.findComponent({ name: 'AFloatButtonGroup' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('子按钮')
  })

  it('显式 open=false 透传（受控收起）', () => {
    const wrapper = mount(TmFloatButtonGroup, { props: { open: false } })
    const inner = wrapper.findComponent({ name: 'AFloatButtonGroup' })
    expect(inner.props('open')).toBe(false)
  })
})

describe('TmFloatButtonBackTop', () => {
  it('target / visibilityHeight / duration props 透传', () => {
    const wrapper = mount(TmFloatButtonBackTop, {
      props: { visibilityHeight: 200, duration: 500 },
    })
    const inner = wrapper.findComponent({ name: 'ABackTop' })
    expect(inner.props('visibilityHeight')).toBe(200)
    expect(inner.props('duration')).toBe(500)
  })
})
