// packages/ui/src/components/statistic/__tests__/Statistic.spec.ts
// TmStatistic 单测：title/value 渲染、formatter/precision props 透传、前后缀插槽
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmStatistic from '../src/Statistic.vue'

describe('TmStatistic', () => {
  it('title / value 渲染', () => {
    const wrapper = mount(TmStatistic, { props: { title: '总销售额', value: 123456 } })
    expect(wrapper.find('.ant-statistic-title').text()).toBe('总销售额')
    expect(wrapper.find('.ant-statistic-content-value').text()).toContain('123,456')
  })

  it('precision / formatter props 透传', () => {
    const formatter = (value: number | string) => `¥${value}`
    const wrapper = mount(TmStatistic, { props: { value: 123.456, precision: 2, formatter } })
    const inner = wrapper.findComponent({ name: 'AStatistic' })
    expect(inner.props('precision')).toBe(2)
    expect(inner.props('formatter')).toBe(formatter)
  })

  it('prefix / suffix 插槽透传', () => {
    const wrapper = mount(TmStatistic, {
      props: { value: 100 },
      slots: { prefix: '<span class="st-prefix">¥</span>', suffix: '<span class="st-suffix">元</span>' },
    })
    expect(wrapper.find('.st-prefix').exists()).toBe(true)
    expect(wrapper.find('.st-suffix').exists()).toBe(true)
  })
})
