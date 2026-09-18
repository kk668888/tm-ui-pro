// packages/ui/src/components/week-picker/__tests__/WeekPicker.spec.ts
// TmWeekPicker 轻量用例：锁定 week 语义与同构契约（详细桥接行为见 MonthPicker.spec.ts）
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs, { type Dayjs } from 'dayjs'
import TmWeekPicker from '../src/WeekPicker.vue'

describe('TmWeekPicker', () => {
  it('Dayjs 直通与公司默认下发', () => {
    const wrapper = mount(TmWeekPicker, { props: { modelValue: dayjs('2026-09-14') } })
    const inner = wrapper.findComponent({ name: 'AWeekPicker' })
    expect(dayjs.isDayjs(inner.props('value'))).toBe(true)
    expect(inner.props('allowClear')).toBe(true)
  })

  // 真实往返值断言（而非仅 isDayjs）：Invalid Date 同样是 Dayjs 对象，
  // 只断言类型会漏掉「dayjs 插件未扩展 → 按格式解析失败」这类问题。
  it('valueFormat 字符串桥接：YYYY-ww 解析出正确周（2026-36）', () => {
    const wrapper = mount(TmWeekPicker, {
      props: { modelValue: '2026-36', valueFormat: 'YYYY-ww' },
    })
    const v = wrapper.findComponent({ name: 'AWeekPicker' }).props('value') as Dayjs
    expect(v.isValid()).toBe(true)
    expect(v.format('YYYY-ww')).toBe('2026-36')
  })

  it('valueFormat 回写：面板选值后 emit 两位周序号字符串', () => {
    const wrapper = mount(TmWeekPicker, { props: { modelValue: null, valueFormat: 'YYYY-ww' } })
    wrapper.findComponent({ name: 'AWeekPicker' }).vm.$emit('update:value', dayjs('2026-09-03'))
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('2026-36')
  })

  it('解析容错：宽松解析忽略额外字符，缺必需 token 时按空值处理', () => {
    // 宽松解析：customParseFormat 按 token 扫描，夹带无关字符不影响解析结果
    const loose = mount(TmWeekPicker, {
      props: { modelValue: '2026年36周', valueFormat: 'YYYY-ww' },
    })
    const lv = loose.findComponent({ name: 'AWeekPicker' }).props('value') as Dayjs
    expect(lv.isValid()).toBe(true)
    expect(lv.format('YYYY-ww')).toBe('2026-36')

    // 缺必需 token（没有年份）→ 解析失败 → 按空值下发；不抛错、不渲染 Invalid Date 文案
    const broken = mount(TmWeekPicker, {
      props: { modelValue: '第二周', valueFormat: 'YYYY-ww' },
    })
    expect(broken.findComponent({ name: 'AWeekPicker' }).props('value')).toBeUndefined()
    expect(broken.text()).not.toContain('Invalid Date')
  })
})
