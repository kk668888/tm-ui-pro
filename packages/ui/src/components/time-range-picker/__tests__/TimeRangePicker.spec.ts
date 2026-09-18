// packages/ui/src/components/time-range-picker/__tests__/TimeRangePicker.spec.ts
// TmTimeRangePicker 单测：区间 v-model 契约与级联
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import dayjs, { type Dayjs } from 'dayjs'
import TmTimeRangePicker from '../src/TimeRangePicker.vue'
import { TmForm } from '../../form'

describe('TmTimeRangePicker', () => {
  it('区间 Dayjs 直通：value 为 Dayjs 对数组', () => {
    const wrapper = mount(TmTimeRangePicker, {
      props: { modelValue: [dayjs('2026-09-18 09:00'), dayjs('2026-09-18 18:00')] },
    })
    const v = wrapper.findComponent({ name: 'ATimeRangePicker' }).props('value')
    expect(Array.isArray(v)).toBe(true)
    expect(dayjs.isDayjs((v as unknown[])[0])).toBe(true)
  })

  // 真实解析值断言（而非仅 isDayjs）：Invalid Date 同样是 Dayjs 对象，
  // 只断言类型会漏掉「dayjs 插件未扩展 → 'HH:mm' 无法按格式解析」这类问题。
  it('valueFormat 模式：[string,string] 成对转换为有效 [Dayjs,Dayjs]', () => {
    const wrapper = mount(TmTimeRangePicker, {
      props: { modelValue: ['09:00', '18:00'], valueFormat: 'HH:mm' },
    })
    const v = wrapper.findComponent({ name: 'ATimeRangePicker' }).props('value') as Dayjs[]
    expect(v[0].isValid()).toBe(true)
    expect(v[0].format('HH:mm')).toBe('09:00')
    expect(v[1].format('HH:mm')).toBe('18:00')
  })

  it('valueFormat 回写：区间变更后 emit [string,string]', () => {
    const wrapper = mount(TmTimeRangePicker, {
      props: { modelValue: null, valueFormat: 'HH:mm' },
    })
    wrapper
      .findComponent({ name: 'ATimeRangePicker' })
      .vm.$emit('update:value', [dayjs('2026-09-18 09:30'), dayjs('2026-09-18 18:00')])
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['09:30', '18:00'])
  })

  it('单侧格式不匹配容错：起始侧正常解析、结束侧按空值，另一侧不受影响', () => {
    const wrapper = mount(TmTimeRangePicker, {
      props: { modelValue: ['09:30:00', '18:00'], valueFormat: 'HH:mm:ss' },
    })
    const v = wrapper.findComponent({ name: 'ATimeRangePicker' }).props('value') as unknown[]
    expect((v[0] as Dayjs).isValid()).toBe(true)
    expect((v[0] as Dayjs).format('HH:mm:ss')).toBe('09:30:00')
    expect(v[1]).toBeUndefined()
    expect(wrapper.text()).not.toContain('Invalid Date')
  })

  it('FormContext 级联：TmForm disabled 级联禁用起止两个输入框', () => {
    const wrapper = mount({
      components: { TmForm, TmTimeRangePicker },
      template: `<TmForm :disabled="true"><TmTimeRangePicker /></TmForm>`,
    })
    expect(wrapper.findComponent({ name: 'ATimeRangePicker' }).props('disabled')).toBe(true)
  })
})
