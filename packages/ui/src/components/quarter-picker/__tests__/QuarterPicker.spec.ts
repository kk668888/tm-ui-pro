// packages/ui/src/components/quarter-picker/__tests__/QuarterPicker.spec.ts
// TmQuarterPicker 轻量用例：锁定 quarter 语义与同构契约（详细桥接行为见 MonthPicker.spec.ts）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs, { type Dayjs } from 'dayjs'
import TmQuarterPicker from '../src/QuarterPicker.vue'

describe('TmQuarterPicker', () => {
  it('Dayjs 直通与公司默认下发', () => {
    const wrapper = mount(TmQuarterPicker, { props: { modelValue: dayjs('2026-07-01') } })
    const inner = wrapper.findComponent({ name: 'AQuarterPicker' })
    expect(dayjs.isDayjs(inner.props('value'))).toBe(true)
    expect(inner.props('allowClear')).toBe(true)
  })

  // 真实往返值断言（而非仅 isDayjs）：Invalid Date 同样是 Dayjs 对象，
  // 只断言类型会漏掉「dayjs 插件未扩展 → Q token 解析/输出退化」这类问题。
  it('valueFormat 字符串桥接：YYYY-[Q]Q 解析出正确季度（2026-Q3）', () => {
    const wrapper = mount(TmQuarterPicker, {
      props: { modelValue: '2026-Q3', valueFormat: 'YYYY-[Q]Q' },
    })
    const v = wrapper.findComponent({ name: 'AQuarterPicker' }).props('value') as Dayjs
    expect(v.isValid()).toBe(true)
    expect(v.format('YYYY-[Q]Q')).toBe('2026-Q3')
  })

  it('valueFormat 回写：面板选值后 emit YYYY-[Q]Q 字符串', () => {
    const wrapper = mount(TmQuarterPicker, {
      props: { modelValue: null, valueFormat: 'YYYY-[Q]Q' },
    })
    wrapper.findComponent({ name: 'AQuarterPicker' }).vm.$emit('update:value', dayjs('2026-07-01'))
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('2026-Q3')
  })

  it('格式不匹配容错：解析失败按空值处理，不抛错也不渲染 Invalid Date 文案', () => {
    const wrapper = mount(TmQuarterPicker, {
      props: { modelValue: '2026-Q', valueFormat: 'YYYY-[Q]Q' },
    })
    expect(wrapper.findComponent({ name: 'AQuarterPicker' }).props('value')).toBeUndefined()
    expect(wrapper.text()).not.toContain('Invalid Date')
  })
})
