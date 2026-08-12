// packages/ui/src/components/result/__tests__/Result.spec.ts
// TmResult 单测：ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmResult from '../src/Result.vue'

describe('TmResult', () => {
  it('ant 原生透传：status / title / subTitle', () => {
    const wrapper = mount(TmResult, {
      props: { status: '404', title: '页面不存在', subTitle: '抱歉' },
    })
    const inner = wrapper.findComponent({ name: 'AResult' })
    expect(inner.props('status')).toBe('404')
    expect(inner.props('title')).toBe('页面不存在')
    expect(inner.props('subTitle')).toBe('抱歉')
  })

  it('插槽透传：extra 插槽转发到内部 ant Result', () => {
    const wrapper = mount(TmResult, {
      props: { status: 'success' },
      slots: { extra: '<button class="back-btn">返回</button>' },
    })
    expect(wrapper.find('.back-btn').exists()).toBe(true)
  })

  it('ant 原生透传：未传 status 时 ant 内部默认 info', () => {
    const wrapper = mount(TmResult, { props: { title: 'x' } })
    // ant Result initDefaultProps 默认 status:'info'（TmResult 透传 undefined，ant 侧补默认）
    expect(wrapper.findComponent({ name: 'AResult' }).props('status')).toBe('info')
  })
})
