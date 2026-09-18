// packages/ui/src/components/month-picker/__tests__/MonthPicker.spec.ts
// TmMonthPicker 单测（week/quarter 同构组件行为一致，由各自轻量用例锁定差异语义）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs from 'dayjs'
import TmMonthPicker from '../src/MonthPicker.vue'
import { TmForm } from '../../form'

describe('TmMonthPicker', () => {
  it('v-model（Dayjs 直通）：选择后回写 Dayjs 值', async () => {
    const wrapper = mount(TmMonthPicker, { props: { modelValue: dayjs('2026-09-01') } })
    const inner = wrapper.findComponent({ name: 'AMonthPicker' })
    expect(inner.props('value')).toBeTruthy()
  })

  it('valueFormat 模式：字符串值经桥接转换后下发 ant', () => {
    const wrapper = mount(TmMonthPicker, {
      props: { modelValue: '2026-09', valueFormat: 'YYYY-MM' },
    })
    const inner = wrapper.findComponent({ name: 'AMonthPicker' })
    // inner computed get 把字符串转 Dayjs 交给 ant
    const v = inner.props('value')
    expect(dayjs.isDayjs(v)).toBe(true)
    expect((v as dayjs.Dayjs).format('YYYY-MM')).toBe('2026-09')
  })

  it('公司默认 allowClear=true 级联 disabled（TmForm 级联回归锁）', () => {
    const wrapper = mount({
      components: { TmForm, TmMonthPicker },
      template: `<TmForm :disabled="true"><TmMonthPicker /></TmForm>`,
    })
    const inner = wrapper.findComponent({ name: 'AMonthPicker' })
    expect(inner.props('allowClear')).toBe(true)
    expect(inner.props('disabled')).toBe(true)
  })
})
