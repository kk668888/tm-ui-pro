// packages/ui/src/components/statistic/__tests__/Countdown.spec.ts
// TmCountdown 单测：value/format 透传、倒计时渲染结构、loading props
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmCountdown from '../src/Countdown.vue'

describe('TmCountdown', () => {
  it('value / format props 透传（ant 顶层导出名 StatisticCountdown）', () => {
    const wrapper = mount(TmCountdown, { props: { value: Date.now() + 60000, format: 'HH:mm:ss' } })
    const inner = wrapper.findComponent({ name: 'AStatisticCountdown' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('format')).toBe('HH:mm:ss')
  })

  it('渲染倒计时结构', () => {
    const wrapper = mount(TmCountdown, { props: { value: Date.now() + 60000 } })
    expect(wrapper.find('.ant-statistic-content').exists()).toBe(true)
  })

  it('loading props 透传（缺省幻影 false 跳过）', () => {
    const wrapper = mount(TmCountdown, { props: { value: Date.now() + 60000, loading: true } })
    expect(wrapper.findComponent({ name: 'AStatisticCountdown' }).props('loading')).toBe(true)
  })
})
