// packages/ui/src/components/calendar/__tests__/Calendar.spec.ts
// TmCalendar 单测：渲染结构、value/fullscreen/mode props 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import TmCalendar from '../src/Calendar.vue'

describe('TmCalendar', () => {
  it('渲染日历结构', () => {
    const wrapper = mount(TmCalendar, { props: { value: dayjs('2026-08-12') } })
    expect(wrapper.findComponent({ name: 'ACalendar' }).exists()).toBe(true)
    expect(wrapper.find('.ant-picker-calendar').exists()).toBe(true)
  })

  it('value / fullscreen props 透传', () => {
    const value = dayjs('2026-08-12')
    const wrapper = mount(TmCalendar, { props: { value, fullscreen: false } })
    const inner = wrapper.findComponent({ name: 'ACalendar' })
    expect(inner.props('fullscreen')).toBe(false)
    expect((inner.props('value') as dayjs.Dayjs).isSame(value)).toBe(true)
  })

  it('mode 月/年面板切换透传', () => {
    const wrapper = mount(TmCalendar, { props: { mode: 'year' } })
    expect(wrapper.findComponent({ name: 'ACalendar' }).props('mode')).toBe('year')
  })
})
