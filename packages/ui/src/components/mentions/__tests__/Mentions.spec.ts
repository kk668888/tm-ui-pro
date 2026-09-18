// packages/ui/src/components/mentions/__tests__/Mentions.spec.ts
// TmMentions 单测：prefix/options/value 透传 + 子组件选项的转发契约
// 注：ant Mentions 把 Option 子节点当**数据**消费（不在 DOM 渲染），候选在输入前缀时才出现，
// 故断言落在「转发给 ant 的 vnode」而非 DOM 上。
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

  it('default 插槽经 render 函数转发真实子组件 vnode（子组件选项写法的前提）', () => {
    // 关键：转发给 ant 的必须是真实 TmMentionsOption vnode（而非 <slot> 虚拟节点）——
    // ant 从子节点上读 value 与默认插槽文案来生成候选（同 Tree / Menu 的教训）。
    // 这条断言即文档「子组件写法」一节可用的依据。
    const wrapper = mount(TmMentions, {
      slots: { default: () => h(TmMentionsOption, { value: 'u1' }, () => '用户一') },
    })
    const inner = wrapper.findComponent({ name: 'AMentions' })
    expect(inner.exists()).toBe(true)
    const forwarded = (inner.vm.$slots.default?.() ?? []) as {
      type?: unknown
      props?: Record<string, unknown>
    }[]
    expect(forwarded).toHaveLength(1)
    expect(forwarded[0].type).toBe(TmMentionsOption)
    expect(forwarded[0].props?.value).toBe('u1')
  })
})

describe('TmMentionsOption', () => {
  it('在 Mentions 宿主中可挂载', () => {
    const wrapper = mount(TmMentions, {
      slots: { default: () => h(TmMentionsOption, { value: 'u1' }, () => '用户一') },
    })
    expect(wrapper.findComponent({ name: 'AMentions' }).exists()).toBe(true)
  })
})
