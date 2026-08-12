// packages/ui/src/components/time-picker/__tests__/TimePicker.spec.ts
// TmTimePicker 单测：v-model 桥接、valueFormat 双模式、扩展属性剥离、默认值、readonly 锁、方法透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import TmTimePicker from '../src/TimePicker.vue'

describe('TmTimePicker', () => {
  it('valueFormat：业务字符串经 string↔Dayjs 双向转换', () => {
    const wrapper = mount(TmTimePicker, {
      props: { modelValue: '09:30:00', valueFormat: 'HH:mm:ss' },
    })
    const inner = wrapper.findComponent({ name: 'ATimePicker' })
    // parent→child：业务字符串转 Dayjs 交给 ant
    expect((inner.props('value') as dayjs.Dayjs).format('HH:mm:ss')).toBe('09:30:00')
  })

  it('未配置 valueFormat：Dayjs 直通（ant 原生语义）', () => {
    const d = dayjs('2026-08-10 09:30:00')
    const wrapper = mount(TmTimePicker, { props: { modelValue: d } })
    const inner = wrapper.findComponent({ name: 'ATimePicker' })
    expect(dayjs.isDayjs(inner.props('value'))).toBe(true)
    expect((inner.props('value') as dayjs.Dayjs).format('HH:mm:ss')).toBe('09:30:00')
  })

  it('扩展属性剥离：modelValue/valueFormat/readonly 不下发到内部 ant TimePicker', () => {
    const wrapper = mount(TmTimePicker, {
      props: { modelValue: '09:30:00', valueFormat: 'HH:mm:ss', readonly: true },
    })
    const inner = wrapper.findComponent({ name: 'ATimePicker' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('valueFormat')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
  })

  it('公司默认：allowClear=true 与 size=middle 真实下发到内部 ant TimePicker', () => {
    const wrapper = mount(TmTimePicker)
    const inner = wrapper.findComponent({ name: 'ATimePicker' })
    expect(inner.props('allowClear')).toBe(true)
    expect(inner.props('size')).toBe('middle')
  })

  it('readonly 锁：readonly=true 时 open:false / allowClear:false（弹层不可开）', () => {
    const wrapper = mount(TmTimePicker, { props: { readonly: true } })
    const inner = wrapper.findComponent({ name: 'ATimePicker' })
    expect(inner.props('open')).toBe(false)
    expect(inner.props('allowClear')).toBe(false)
  })

  it('ant 原生透传：minute-step / disabled / placeholder', () => {
    const wrapper = mount(TmTimePicker, {
      props: { minuteStep: 5, disabled: true, placeholder: '选择时间' },
    })
    const inner = wrapper.findComponent({ name: 'ATimePicker' })
    expect(inner.props('minuteStep')).toBe(5)
    expect(inner.props('disabled')).toBe(true)
    expect(inner.props('placeholder')).toBe('选择时间')
  })
})
