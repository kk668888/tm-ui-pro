// packages/ui/src/components/steps/__tests__/Steps.spec.ts
// TmSteps 单测：子组件族渲染、current/status 透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import TmSteps from '../src/Steps.vue'
import TmStep from '../src/Step.vue'

describe('TmSteps', () => {
  it('渲染内部 ant Steps 并透传 current', () => {
    const wrapper = mount(TmSteps, {
      props: { current: 1 },
      slots: { default: [TmStep, TmStep, TmStep] },
    })
    const inner = wrapper.findComponent({ name: 'ASteps' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('current')).toBe(1)
  })

  it('ant 原生透传：direction / size 下发', () => {
    const wrapper = mount(TmSteps, { props: { direction: 'vertical', size: 'small' } })
    const inner = wrapper.findComponent({ name: 'ASteps' })
    expect(inner.props('direction')).toBe('vertical')
    expect(inner.props('size')).toBe('small')
  })

  it('default 插槽透传（ant Steps 过滤非 Step 子节点，用真实 TmStep 验证）', () => {
    const wrapper = mount(TmSteps, {
      slots: { default: () => [h(TmStep, { title: '一' }), h(TmStep, { title: '二' })] },
    })
    expect(wrapper.findAllComponents({ name: 'AStep' }).length).toBe(2)
  })
})

describe('TmStep', () => {
  it('渲染内部 ant Step 并透传 title', () => {
    const wrapper = mount(TmStep, { props: { title: '步骤一' } })
    const inner = wrapper.findComponent({ name: 'AStep' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('title')).toBe('步骤一')
  })

  it('status 透传', () => {
    const wrapper = mount(TmStep, { props: { status: 'error' } })
    expect(wrapper.findComponent({ name: 'AStep' }).props('status')).toBe('error')
  })
})
