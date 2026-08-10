// packages/ui/src/components/date-picker/__tests__/DatePicker.spec.ts
// TmDatePicker 单测：v-model 桥接、valueFormat 双模式、readonly 锁、disabled 级联、方法透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import dayjs from 'dayjs'
import TmDatePicker from '../src/DatePicker.vue'
import TmForm from '../../form/src/Form.vue'

describe('TmDatePicker', () => {
  it('v-model：内部 update:value 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmDatePicker, { props: { modelValue: dayjs('2026-08-10') } })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'update:value',
      dayjs('2026-08-11'),
    )
    await nextTick()
    expect(dayjs.isDayjs(wrapper.emitted('update:modelValue')?.[0]?.[0])).toBe(true)
    expect((wrapper.emitted('update:modelValue')?.[0]?.[0] as dayjs.Dayjs).format('YYYY-MM-DD')).toBe(
      '2026-08-11',
    )
  })

  it('v-model：父组件更新 modelValue 同步到内部 value（parent→child，真双向）', async () => {
    const wrapper = mount(TmDatePicker, { props: { modelValue: dayjs('2026-08-10') } })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    expect((inner.props('value') as dayjs.Dayjs).format('YYYY-MM-DD')).toBe('2026-08-10')
    await wrapper.setProps({ modelValue: dayjs('2026-08-12') })
    expect((inner.props('value') as dayjs.Dayjs).format('YYYY-MM-DD')).toBe('2026-08-12')
  })

  it('valueFormat：业务字符串经 string↔Dayjs 双向转换', async () => {
    const wrapper = mount(TmDatePicker, {
      props: { modelValue: '2026-08-10', valueFormat: 'YYYY-MM-DD' },
    })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    // parent→child：业务字符串转 Dayjs 交给 ant
    expect((inner.props('value') as dayjs.Dayjs).format('YYYY-MM-DD')).toBe('2026-08-10')
    // child→parent：ant Dayjs 转回业务字符串
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'update:value',
      dayjs('2026-08-11'),
    )
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('2026-08-11')
  })

  it('扩展属性剥离：modelValue/valueFormat/readonly 不下发到内部 ant DatePicker', () => {
    const wrapper = mount(TmDatePicker, {
      props: { modelValue: '2026-08-10', valueFormat: 'YYYY-MM-DD', readonly: true },
    })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('valueFormat')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
  })

  it('公司默认：allowClear=true 真实下发到内部 ant DatePicker', () => {
    const wrapper = mount(TmDatePicker, { props: { modelValue: dayjs('2026-08-10') } })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    expect(inner.props('allowClear')).toBe(true)
  })

  it('显式 open=false 保留为受控关闭（非只读，业务主动锁弹层）', () => {
    const wrapper = mount(TmDatePicker, { props: { modelValue: dayjs('2026-08-10'), open: false } })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    expect(inner.props('open')).toBe(false)
  })

  it('readonly 锁：TmForm readonly=true 时 open:false / allowClear:false（弹层不可开）', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmDatePicker, { modelValue: dayjs('2026-08-10') }) },
    })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    expect(inner.props('open')).toBe(false)
    expect(inner.props('allowClear')).toBe(false)
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant DatePicker disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmDatePicker, { modelValue: dayjs('2026-08-10') }) },
    })
    const inner = wrapper.findComponent({ name: 'ADatePicker' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('方法透传：exposed focus 是函数（useForwardRef 代理内部实例）', () => {
    const wrapper = mount(TmDatePicker, { props: { modelValue: dayjs('2026-08-10') } })
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })
})
