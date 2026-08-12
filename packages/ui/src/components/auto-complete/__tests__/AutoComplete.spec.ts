// packages/ui/src/components/auto-complete/__tests__/AutoComplete.spec.ts
// TmAutoComplete 单测：options 透传、受控值、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmAutoComplete from '../src/AutoComplete.vue'

describe('TmAutoComplete', () => {
  it('渲染内部 ant AutoComplete 并透传 options', () => {
    const options = [{ value: 'a', label: '选项A' }]
    const wrapper = mount(TmAutoComplete, { props: { options } })
    const inner = wrapper.findComponent({ name: 'AAutoComplete' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('options')).toEqual(options)
  })

  it('ant 原生透传：value / placeholder / allowClear 下发', () => {
    const wrapper = mount(TmAutoComplete, { props: { value: 'a', placeholder: '请输入', allowClear: true } })
    const inner = wrapper.findComponent({ name: 'AAutoComplete' })
    expect(inner.props('value')).toBe('a')
    expect(inner.props('placeholder')).toBe('请输入')
    expect(inner.props('allowClear')).toBe(true)
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmAutoComplete, { slots: { default: '<span class="ac-child">x</span>' } })
    expect(wrapper.find('.ac-child').exists()).toBe(true)
  })

  it('filterOption 公司默认开启（按 value 大小写不敏感子串过滤）', () => {
    const wrapper = mount(TmAutoComplete, { props: { options: [] } })
    const fn = wrapper.findComponent({ name: 'AAutoComplete' }).props('filterOption')
    expect(typeof fn).toBe('function')
    // 输入 o 匹配 Orange，不匹配 Apple（修复：ant 默认 filterOption=false 易误选首项）
    expect(fn('o', { value: 'Orange' })).toBe(true)
    expect(fn('o', { value: 'Apple' })).toBe(false)
  })

  it('业务传 filterOption=false 关闭过滤', () => {
    const wrapper = mount(TmAutoComplete, { props: { filterOption: false } })
    expect(wrapper.findComponent({ name: 'AAutoComplete' }).props('filterOption')).toBe(false)
  })
})
