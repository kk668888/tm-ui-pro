// packages/ui/src/components/cascader/__tests__/Cascader.spec.ts
// TmCascader 单测：v-model 桥接、options/fieldNames 透传、readonly 锁、disabled 级联、方法透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import TmCascader from '../src/Cascader.vue'
import TmForm from '../../form/src/Form.vue'

const options = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [{ value: 'hangzhou', label: '杭州' }],
  },
]

describe('TmCascader', () => {
  it('v-model：内部 update:value 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmCascader, { props: { modelValue: ['zhejiang'], options } })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('update:value', [
      'zhejiang',
      'hangzhou',
    ])
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual(['zhejiang', 'hangzhou'])
  })

  it('v-model：父组件更新 modelValue 同步到内部 value（parent→child，真双向）', async () => {
    const wrapper = mount(TmCascader, { props: { modelValue: ['zhejiang'], options } })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    expect(inner.props('value')).toEqual(['zhejiang'])
    await wrapper.setProps({ modelValue: ['zhejiang', 'hangzhou'] })
    expect(inner.props('value')).toEqual(['zhejiang', 'hangzhou'])
  })

  it('options/fieldNames 原生透传到内部 ant Cascader', () => {
    const wrapper = mount(TmCascader, {
      props: { modelValue: ['zhejiang'], options, fieldNames: { label: 'name', value: 'id' } },
    })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    expect(inner.props('options')).toEqual(options)
    expect(inner.props('fieldNames')).toEqual({ label: 'name', value: 'id' })
  })

  it('扩展属性剥离：modelValue/readonly 不下发到内部 ant Cascader', () => {
    const wrapper = mount(TmCascader, { props: { modelValue: ['zhejiang'], readonly: true } })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
  })

  it('公司默认：allowClear=true 真实下发', () => {
    const wrapper = mount(TmCascader, { props: { modelValue: ['zhejiang'], options } })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    expect(inner.props('allowClear')).toBe(true)
  })

  it('readonly 锁：TmForm readonly=true 时 open:false / allowClear:false', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmCascader, { modelValue: ['zhejiang'], options }) },
    })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    expect(inner.props('open')).toBe(false)
    expect(inner.props('allowClear')).toBe(false)
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant Cascader disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmCascader, { modelValue: ['zhejiang'], options }) },
    })
    const inner = wrapper.findComponent({ name: 'ACascader' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('方法透传：exposed focus 是函数', () => {
    const wrapper = mount(TmCascader, { props: { modelValue: ['zhejiang'], options } })
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })
})
