// packages/ui/src/components/input/__tests__/Input.spec.ts
// TmInput 范本组件单测：验证 v-model 受控透传 + ref 方法透传
// 覆盖核心机制：
// 1. props/类型透传：原生 ant placeholder 等真实下发到内部 input 元素
// 2. 公司默认值：allowClear / size 真实生效（断言内部 AButton 收到）
// 3. v-model 桥接：业务 modelValue ↔ ant value 双向同步（真双向，两侧都断言）
// 4. 方法透传：useForwardRef 暴露 focus/blur/select，真实影响 DOM activeElement
// 5. 扩展属性剥离：modelValue 不下发到内部 ant Input（避免 ant 警告/误用）
// 6. $attrs + slots 全透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
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

  it('onChange 回调真实透传：剥离修复后 @change 回调能到达内部 AInput 并触发', async () => {
    // 回归 Important #1：早期 antProps 错误剥离了 onChange/onInput，
    // ant-design-vue 把 onChange 定义为可选 listener prop，Vue 因此把
    // <TmInput @change="foo"> 路由到 props.onChange（而非 $attrs），剥离后回调永远到不了
    // 内部 AInput——静默失败无报错。该测试锁定 onChange 真实透传 + 回调被实际调用
    const changeSpy = vi.fn()
    const wrapper = mount(TmInput, {
      props: { onChange: changeSpy as unknown as (e: Event) => void },
    })
    const inner = wrapper.findComponent({ name: 'AInput' })
    expect(inner.exists()).toBe(true)
    // 步骤 1：onChange 真实下发到内部 AInput 的 props（剥离修复后应存在）
    expect(inner.props('onChange')).toBe(changeSpy)
    // 步骤 2：模拟 ant Input 触发 change 事件，断言业务回调被实际调用（非空断言）
    // 通过内部 AInput 实例 $emit 触发，Vue 会查找 AInput vnode.props 上的 onChange 调用
    ;(inner.vm as unknown as { $emit: (event: string, ...args: unknown[]) => void }).$emit(
      'change',
      { target: { value: 'new' } },
    )
    await nextTick()
    expect(changeSpy).toHaveBeenCalledTimes(1)
  })

  it('onInput 回调同样真实透传并触发（与 onChange 同源剥离问题）', async () => {
    // 回归 Important #1：onInput 与 onChange 同属通知事件，与 v-model:value 不冲突，
    // 必须保留透传。该测试覆盖 onInput 分支，确保修复完整
    const inputSpy = vi.fn()
    const wrapper = mount(TmInput, {
      props: { onInput: inputSpy as unknown as (e: Event) => void },
    })
    const inner = wrapper.findComponent({ name: 'AInput' })
    expect(inner.props('onInput')).toBe(inputSpy)
    ;(inner.vm as unknown as { $emit: (event: string, ...args: unknown[]) => void }).$emit(
      'input',
      { target: { value: 'new' } },
    )
    await nextTick()
    expect(inputSpy).toHaveBeenCalledTimes(1)
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
