// packages/ui/src/components/mentions/__tests__/Mentions.spec.ts
// TmMentions 单测：prefix/options/value 透传
// 注：ant Mentions 过滤非 Option 子节点，且选项在输入 @ 触发时才懒渲染，
// jsdom 下不可断言子选项 DOM，聚焦主组件透传与挂载。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h } from 'vue'
import TmMentions from '../src/Mentions.vue'
import TmMentionsOption from '../src/MentionsOption.vue'

describe('TmMentions', () => {
  it('渲染内部 ant Mentions 并透传 prefix', () => {
    const wrapper = mount(TmMentions, { props: { prefix: '@' } })
    const inner = wrapper.findComponent({ name: 'AMentions' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('prefix')).toBe('@')
  })

  it('ant 原生透传：value / rows / options 下发', () => {
    const options = [{ value: 'u1', label: '用户一' }]
    const wrapper = mount(TmMentions, { props: { value: 'hi', rows: 3, options } })
    const inner = wrapper.findComponent({ name: 'AMentions' })
    expect(inner.props('value')).toBe('hi')
    expect(inner.props('rows')).toBe(3)
    expect(inner.props('options')).toEqual(options)
  })

  it('default 插槽经 render 函数转发，挂载不报错', () => {
    // ant Mentions 过滤非 Option 子节点，仅验证转发与挂载
    const wrapper = mount(TmMentions, {
      slots: { default: () => h(TmMentionsOption, { value: 'u1' }, () => '用户一') },
    })
    expect(wrapper.findComponent({ name: 'AMentions' }).exists()).toBe(true)
  })
})

describe('TmMentionsOption', () => {
  // MentionsOption 需 Mentions 祖先上下文，且选项懒渲染；仅验证在宿主中挂载不报错
  it('在 Mentions 宿主中可挂载', () => {
    const wrapper = mount(TmMentions, {
      slots: { default: () => h(TmMentionsOption, { value: 'u1' }, () => '用户一') },
    })
    expect(wrapper.findComponent({ name: 'AMentions' }).exists()).toBe(true)
  })
})
