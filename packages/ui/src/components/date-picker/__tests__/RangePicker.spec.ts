// packages/ui/src/components/date-picker/__tests__/RangePicker.spec.ts
// TmRangePicker 单测：区间 v-model 桥接、valueFormat 成对转换、readonly 锁、disabled 级联
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import dayjs from 'dayjs'
import TmRangePicker from '../src/RangePicker.vue'
import TmForm from '../../form/src/Form.vue'

describe('TmRangePicker', () => {
  it('v-model：内部 update:value 触发 update:modelValue（child→parent，Dayjs 直通）', async () => {
    const wrapper = mount(TmRangePicker, {
      props: { modelValue: [dayjs('2026-08-10'), dayjs('2026-08-12')] },
    })
    const inner = wrapper.findComponent({ name: 'ARangePicker' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('update:value', [
      dayjs('2026-08-11'),
      dayjs('2026-08-13'),
    ])
    await nextTick()
    const emitted = wrapper.emitted('update:modelValue')?.[0]?.[0] as [dayjs.Dayjs, dayjs.Dayjs]
    expect(emitted[0].format('YYYY-MM-DD')).toBe('2026-08-11')
    expect(emitted[1].format('YYYY-MM-DD')).toBe('2026-08-13')
  })

  it('v-model：父组件更新 modelValue 同步到内部 value（parent→child）', async () => {
    const wrapper = mount(TmRangePicker, {
      props: { modelValue: [dayjs('2026-08-10'), dayjs('2026-08-12')] },
    })
    const inner = wrapper.findComponent({ name: 'ARangePicker' })
    expect((inner.props('value') as [dayjs.Dayjs, dayjs.Dayjs])[0].format('YYYY-MM-DD')).toBe(
      '2026-08-10',
    )
    await wrapper.setProps({ modelValue: [dayjs('2026-08-11'), dayjs('2026-08-13')] })
    expect((inner.props('value') as [dayjs.Dayjs, dayjs.Dayjs])[1].format('YYYY-MM-DD')).toBe(
      '2026-08-13',
    )
  })

  it('valueFormat：区间字符串成对双向转换', async () => {
    const wrapper = mount(TmRangePicker, {
      props: { modelValue: ['2026-08-10', '2026-08-12'], valueFormat: 'YYYY-MM-DD' },
    })
    const inner = wrapper.findComponent({ name: 'ARangePicker' })
    // parent→child：业务 [string,string] 转 [Dayjs,Dayjs]
    const v = inner.props('value') as [dayjs.Dayjs, dayjs.Dayjs]
    expect(v[0].format('YYYY-MM-DD')).toBe('2026-08-10')
    expect(v[1].format('YYYY-MM-DD')).toBe('2026-08-12')
    // child→parent：ant [Dayjs,Dayjs] 转回 [string,string]
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('update:value', [
      dayjs('2026-08-11'),
      dayjs('2026-08-13'),
    ])
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['2026-08-11', '2026-08-13'])
  })

  it('valueFormat 任一端为空容错：emit null 不抛错', async () => {
    const wrapper = mount(TmRangePicker, {
      props: { modelValue: ['2026-08-10', null] as unknown as [string, string], valueFormat: 'YYYY-MM-DD' },
    })
    const inner = wrapper.findComponent({ name: 'ARangePicker' })
    const v = inner.props('value') as [dayjs.Dayjs | undefined, dayjs.Dayjs | undefined]
    expect(v[0]?.format('YYYY-MM-DD')).toBe('2026-08-10')
    expect(v[1]).toBeUndefined()
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('update:value', [
      dayjs('2026-08-11'),
      null,
    ])
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['2026-08-11', null])
  })

  it('readonly 锁：TmForm readonly=true 时 open:false / allowClear:false', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: {
        default: () => h(TmRangePicker, { modelValue: [dayjs('2026-08-10'), dayjs('2026-08-12')] }),
      },
    })
    const inner = wrapper.findComponent({ name: 'ARangePicker' })
    expect(inner.props('open')).toBe(false)
    expect(inner.props('allowClear')).toBe(false)
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant RangePicker disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: {
        default: () => h(TmRangePicker, { modelValue: [dayjs('2026-08-10'), dayjs('2026-08-12')] }),
      },
    })
    const inner = wrapper.findComponent({ name: 'ARangePicker' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('方法透传：exposed focus 是函数', () => {
    const wrapper = mount(TmRangePicker, {
      props: { modelValue: [dayjs('2026-08-10'), dayjs('2026-08-12')] },
    })
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })
})
