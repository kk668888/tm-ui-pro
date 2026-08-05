// packages/ui/src/components/input/__tests__/Input.spec.ts
// TmInput 范本组件单测：验证 v-model 受控透传 + ref 方法透传
// 覆盖核心机制：
// 1. props/类型透传：原生 ant placeholder 等真实下发到内部 input 元素
// 2. 公司默认值：allowClear / size 真实生效（断言内部 AButton 收到）
// 3. v-model 桥接：业务 modelValue ↔ ant value 双向同步（真双向，两侧都断言）
// 4. 方法透传：useForwardRef 暴露 focus/blur/select，真实影响 DOM activeElement
// 5. 扩展属性剥离：modelValue 不下发到内部 ant Input（避免 ant 警告/误用）
// 6. $attrs + slots 全透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmInput from '../src/Input.vue'

describe('TmInput', () => {
  it('透传 ant 原生 placeholder 到内部 input 元素', () => {
    const wrapper = mount(TmInput, { props: { placeholder: '请输入' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })

  it('公司默认 allowClear=true / size=middle 真实下发到内部 ant Input', () => {
    const wrapper = mount(TmInput)
    const inner = wrapper.findComponent({ name: 'AInput' })
    // 直接断言内部 AInput 收到公司默认值（真实验证 defaults 生效）
    expect(inner.exists()).toBe(true)
    expect(inner.props('allowClear')).toBe(true)
    expect(inner.props('size')).toBe('middle')
  })

  it('v-model：用户输入触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('hello')
  })

  it('v-model：父组件更新 modelValue 同步到内部 input（parent→child，真双向）', async () => {
    const wrapper = mount(TmInput, { props: { modelValue: '' } })
    expect(wrapper.find('input').element.value).toBe('')
    await wrapper.setProps({ modelValue: 'world' })
    expect(wrapper.find('input').element.value).toBe('world')
  })

  it('方法透传：exposed focus 是函数', () => {
    const wrapper = mount(TmInput)
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })

  it('方法透传：focus() 真实聚焦内部 input 元素', async () => {
    // attachTo:document.body 让 jsdom 能更新 document.activeElement
    const wrapper = mount(TmInput, { attachTo: document.body })
    try {
      const inputEl = wrapper.find('input').element
      expect(document.activeElement).not.toBe(inputEl)
      await (wrapper.vm as unknown as { focus: () => void }).focus()
      expect(document.activeElement).toBe(inputEl)
    } finally {
      wrapper.unmount()
    }
  })

  it('方法透传：blur() 真实让内部 input 失焦', async () => {
    const wrapper = mount(TmInput, { attachTo: document.body })
    try {
      const inputEl = wrapper.find('input').element
      await (wrapper.vm as unknown as { focus: () => void }).focus()
      expect(document.activeElement).toBe(inputEl)
      await (wrapper.vm as unknown as { blur: () => void }).blur()
      expect(document.activeElement).not.toBe(inputEl)
    } finally {
      wrapper.unmount()
    }
  })

  it('扩展属性剥离：modelValue 不下发到内部 ant Input，经映射后 value 收到值', () => {
    // 设了扩展属性 modelValue，断言内部 AInput 收不到 modelValue（避免 ant 警告）
    // 同时验证 modelValue 经 antProps 映射后内部 value 收到了业务值
    const wrapper = mount(TmInput, { props: { modelValue: 'abc' } })
    const inner = wrapper.findComponent({ name: 'AInput' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('value')).toBe('abc')
  })

  it('透传 $attrs 到根元素（data-testid）', () => {
    const wrapper = mount(TmInput, { attrs: { 'data-testid': 'my-input' } })
    expect(wrapper.find('[data-testid="my-input"]').exists()).toBe(true)
  })

  it('插槽透传：prefix/suffix 转发到内部 ant Input', () => {
    const wrapper = mount(TmInput, { slots: { prefix: '前缀', suffix: '后缀' } })
    expect(wrapper.text()).toContain('前缀')
    expect(wrapper.text()).toContain('后缀')
  })
})
