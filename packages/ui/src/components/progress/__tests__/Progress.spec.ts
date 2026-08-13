// packages/ui/src/components/progress/__tests__/Progress.spec.ts
// TmProgress 单测：业务 status 语义映射、ant 原生 status 透传、strokeColor 优先、props 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmProgress from '../src/Progress.vue'

describe('TmProgress', () => {
  it('percent / showInfo 等原生 props 透传', () => {
    const wrapper = mount(TmProgress, { props: { percent: 66, showInfo: true } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('percent')).toBe(66)
    expect(inner.props('showInfo')).toBe(true)
  })

  it('业务 status 映射为 ant status（success → success）', () => {
    const wrapper = mount(TmProgress, { props: { percent: 100, status: 'success' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBe('success')
  })

  it('业务 status 映射：failed → exception', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50, status: 'failed' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBe('exception')
  })

  it('业务 status 映射：processing → active', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50, status: 'processing' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBe('active')
  })

  it('业务 status 映射：warning → normal + strokeColor 兜底', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50, status: 'warning' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBe('normal')
    expect(inner.props('strokeColor')).toBe('#faad14')
  })

  it('显式 strokeColor 优先于 warning 映射兜底', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50, status: 'warning', strokeColor: '#1677ff' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('strokeColor')).toBe('#1677ff')
  })

  it('ant 原生 status 值原样透传（active 不在映射表）', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50, status: 'active' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBe('active')
  })

  it('未传 status 时不注入 status（缺省不透传）', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50 } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBeUndefined()
  })

  it('status 传原型链属性名（constructor）时原样透传（Object.hasOwn 防护）', () => {
    const wrapper = mount(TmProgress, { props: { percent: 50, status: 'constructor' } })
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(inner.props('status')).toBe('constructor')
  })

  it('format 插槽透传（自定义文案）', () => {
    const wrapper = mount(TmProgress, {
      props: { percent: 50, showInfo: true },
      slots: { format: '<span class="fmt-custom">自定义文案</span>' },
    })
    expect(wrapper.find('.fmt-custom').exists()).toBe(true)
    expect(wrapper.find('.fmt-custom').text()).toBe('自定义文案')
  })

  it('default 插槽透传（进度条后追加内容）', () => {
    const wrapper = mount(TmProgress, {
      props: { percent: 50 },
      slots: { default: '<div class="progress-extra">追加内容</div>' },
    })
    // jsdom 下 ant line 分支不渲染 default 插槽内容，验证已转发到内部组件即可
    const inner = wrapper.findComponent({ name: 'AProgress' })
    expect(typeof inner.vm.$slots.default).toBe('function')
  })
})
