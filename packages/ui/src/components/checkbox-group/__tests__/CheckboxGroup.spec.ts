// packages/ui/src/components/checkbox-group/__tests__/CheckboxGroup.spec.ts
// TmCheckboxGroup 单测：v-model 数组桥接、options 透传、FormContext 级联、方法透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import TmCheckboxGroup from '../src/CheckboxGroup.vue'
import TmForm from '../../form/src/Form.vue'

describe('TmCheckboxGroup', () => {
  it('options 透传到内部 ant CheckboxGroup', () => {
    const options = [
      { label: 'A', value: 1 },
      { label: 'B', value: 2 },
    ]
    const wrapper = mount(TmCheckboxGroup, { props: { modelValue: [1], options } })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('options')).toEqual(options)
  })

  it('v-model：内部 update:value 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmCheckboxGroup, { props: { modelValue: [1] } })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    ;(inner.vm as unknown as { $emit: (e: string, ...args: unknown[]) => void }).$emit(
      'update:value',
      [1, 2],
    )
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toEqual([1, 2])
  })

  it('v-model：父组件更新 modelValue 同步到内部 value（parent→child，真双向）', async () => {
    const wrapper = mount(TmCheckboxGroup, { props: { modelValue: [1] } })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    expect(inner.props('value')).toEqual([1])
    await wrapper.setProps({ modelValue: [1, 2] })
    expect(inner.props('value')).toEqual([1, 2])
  })

  it('扩展属性剥离：modelValue/readonly 不下发到内部 ant CheckboxGroup', () => {
    const wrapper = mount(TmCheckboxGroup, { props: { modelValue: [1], readonly: true } })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant CheckboxGroup disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmCheckboxGroup, { modelValue: [1] }) },
    })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('disabled 级联：业务显式 disabled=false 优先于 TmForm disabled=true', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmCheckboxGroup, { modelValue: [1], disabled: false }) },
    })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    expect(inner.props('disabled')).toBe(false)
  })

  it('readonly 映射为 disabled：TmForm readonly=true 时内部 ant CheckboxGroup disabled', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmCheckboxGroup, { modelValue: [1] }) },
    })
    const inner = wrapper.findComponent({ name: 'ACheckboxGroup' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('插槽透传：default 插槽转发到内部 ant CheckboxGroup', () => {
    const wrapper = mount(TmCheckboxGroup, {
      slots: { default: '<span class="custom-checkbox">自定义</span>' },
    })
    expect(wrapper.find('.custom-checkbox').exists()).toBe(true)
  })

  it('透传接口访问安全：ant CheckboxGroup 无公共实例方法时访问返回 undefined 不抛错', () => {
    // ant CheckboxGroup 源码未暴露 focus/blur 等公共方法，useForwardRef 的 Proxy
    // 访问未挂载/不存在的方法应安全返回 undefined（不抛错），保持挂载前调用安全契约
    const wrapper = mount(TmCheckboxGroup)
    expect((wrapper.vm as unknown as { blur: unknown }).blur).toBeUndefined()
  })
})
