// packages/ui/src/components/input-number/__tests__/InputNumber.spec.ts
// TmInputNumber 单测：v-model 数值桥接、默认值/边界透传、readonly/disabled 级联、方法透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import TmInputNumber from '../src/InputNumber.vue'
import TmForm from '../../form/src/Form.vue'

describe('TmInputNumber', () => {
  it('v-model：内部 update:value 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmInputNumber, { props: { modelValue: 1 } })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    ;(inner.vm as unknown as { $emit: (e: string, ...args: unknown[]) => void }).$emit(
      'update:value',
      2,
    )
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(2)
  })

  it('v-model：父组件更新 modelValue 同步到内部 value（parent→child，真双向）', async () => {
    const wrapper = mount(TmInputNumber, { props: { modelValue: 1 } })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('value')).toBe(1)
    await wrapper.setProps({ modelValue: 2 })
    expect(inner.props('value')).toBe(2)
  })

  it('公司默认：size=middle / bordered=true / controls=true / keyboard=true 真实下发', () => {
    // bordered/controls/keyboard 回归：Vue 类型化 defineProps 的 Boolean 默认陷阱，
    // 必须在 withDefaults 显式兜底 true，否则 ant InputNumber 渲染成 borderless/无步进/不可键盘
    const wrapper = mount(TmInputNumber)
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('size')).toBe('middle')
    expect(inner.props('bordered')).toBe(true)
    expect(inner.props('controls')).toBe(true)
    expect(inner.props('keyboard')).toBe(true)
  })

  it('边界与显示能力透传：min/max/precision 原样下发到内部 ant InputNumber', () => {
    const wrapper = mount(TmInputNumber, {
      props: { modelValue: 5, min: 0, max: 100, precision: 2 },
    })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('min')).toBe(0)
    expect(inner.props('max')).toBe(100)
    expect(inner.props('precision')).toBe(2)
  })

  it('扩展属性剥离：modelValue 不下发到内部 ant InputNumber', () => {
    const wrapper = mount(TmInputNumber, { props: { modelValue: 5 } })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('modelValue')).toBeUndefined()
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant InputNumber disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmInputNumber, { modelValue: 1 }) },
    })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('disabled 级联：业务显式 disabled=false 优先于 TmForm disabled=true', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmInputNumber, { modelValue: 1, disabled: false }) },
    })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('disabled')).toBe(false)
  })

  it('readonly 级联：TmForm readonly=true 时内部 ant InputNumber 收到原生 readonly', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmInputNumber, { modelValue: 1 }) },
    })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('readonly')).toBe(true)
  })

  it('readonly 级联：业务显式 readonly=false 优先于 TmForm readonly=true', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmInputNumber, { modelValue: 1, readonly: false }) },
    })
    const inner = wrapper.findComponent({ name: 'AInputNumber' })
    expect(inner.props('readonly')).toBe(false)
  })

  it('方法透传：exposed focus 是函数（useForwardRef 代理内部实例）', () => {
    const wrapper = mount(TmInputNumber)
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })
})
