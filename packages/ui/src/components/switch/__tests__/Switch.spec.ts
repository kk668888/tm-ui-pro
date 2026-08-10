// packages/ui/src/components/switch/__tests__/Switch.spec.ts
// TmSwitch 单测：v-model(checked) 桥接、checkedValue 透传、FormContext 级联、方法透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import TmSwitch from '../src/Switch.vue'
import TmForm from '../../form/src/Form.vue'

describe('TmSwitch', () => {
  it('v-model：内部 update:checked 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmSwitch, { props: { modelValue: false } })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    ;(inner.vm as unknown as { $emit: (e: string, ...args: unknown[]) => void }).$emit(
      'update:checked',
      true,
    )
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(true)
  })

  it('v-model：父组件更新 modelValue 同步到内部 checked（parent→child，真双向）', async () => {
    const wrapper = mount(TmSwitch, { props: { modelValue: false } })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    expect(inner.props('checked')).toBe(false)
    await wrapper.setProps({ modelValue: true })
    expect(inner.props('checked')).toBe(true)
  })

  it('自定义开合值透传：checkedValue/unCheckedValue 原样下发到内部 ant Switch', () => {
    const wrapper = mount(TmSwitch, { props: { modelValue: 'on', checkedValue: 'on', unCheckedValue: 'off' } })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    expect(inner.props('checkedValue')).toBe('on')
    expect(inner.props('unCheckedValue')).toBe('off')
  })

  it('插槽透传：checkedChildren/unCheckedChildren 插槽转发到内部 ant Switch', () => {
    const wrapper = mount(TmSwitch, {
      props: { modelValue: false },
      slots: {
        checkedChildren: '<span class="on-label">开</span>',
        unCheckedChildren: '<span class="off-label">关</span>',
      },
    })
    expect(wrapper.find('.off-label').exists()).toBe(true)
  })

  it('扩展属性剥离：modelValue/readonly 不下发到内部 ant Switch', () => {
    const wrapper = mount(TmSwitch, { props: { modelValue: true, readonly: true } })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant Switch disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmSwitch, { modelValue: false }) },
    })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('disabled 级联：业务显式 disabled=false 优先于 TmForm disabled=true', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmSwitch, { modelValue: false, disabled: false }) },
    })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    expect(inner.props('disabled')).toBe(false)
  })

  it('readonly 映射为 disabled：TmForm readonly=true 时内部 ant Switch disabled', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmSwitch, { modelValue: false }) },
    })
    const inner = wrapper.findComponent({ name: 'ASwitch' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('方法透传：exposed focus 是函数（useForwardRef 代理内部实例）', () => {
    const wrapper = mount(TmSwitch)
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })
})
