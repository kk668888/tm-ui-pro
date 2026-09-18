// packages/ui/src/components/input-password/__tests__/InputPassword.spec.ts
// TmInputPassword 单测：对齐 TmInput.spec.ts 范本 + 密码专属行为
// 覆盖 spec 场景：
// 1. v-model 契约：双向同步 + 清空 emit ''（不 emit undefined）
// 2. 密文默认与可见性切换：默认 type=password，点击眼睛切明文，值不丢
// 3. visibilityToggle=false：图标不渲染、恒密文（幻影 false 兜底回归锁）
// 4. 公司默认值：allowClear/size/bordered 下发（bordered 幻影 false 回归锁）
// 5. iconRender 插槽：自定义图标渲染且点击切换（组件把 ant 裸 boolean scope 包装为 { visible }）
// 6. suffix 原生限制：suffix 插槽在任何可见性配置下都不渲染（ant Password 恒以 props.suffix 覆盖）
// 7. 扩展属性剥离 + 值映射、$attrs 透传、ref focus/blur 方法透传
// 8. FormContext 级联：TmForm disabled 下发、业务显式覆盖
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmInputPassword from '../src/InputPassword.vue'
import { TmForm } from '../../form'

describe('TmInputPassword', () => {
  it('透传 ant 原生 placeholder 到内部 input 元素', () => {
    const wrapper = mount(TmInputPassword, { props: { placeholder: '请输入密码' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入密码')
  })

  it('默认密文：内部 input type=password', () => {
    const wrapper = mount(TmInputPassword)
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('公司默认 allowClear=true / size=middle 真实下发到内部 ant InputPassword', () => {
    const wrapper = mount(TmInputPassword)
    const inner = wrapper.findComponent({ name: 'AInputPassword' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('allowClear')).toBe(true)
    expect(inner.props('size')).toBe('middle')
  })

  it('公司默认 bordered=true（回归：Vue 类型化 defineProps 的 Boolean 默认陷阱）', () => {
    const wrapper = mount(TmInputPassword)
    const inner = wrapper.findComponent({ name: 'AInputPassword' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('bordered')).toBe(true)
  })

  it('公司默认 visibilityToggle=true（回归：Boolean 幻影 false 会让眼睛图标消失）', () => {
    const wrapper = mount(TmInputPassword)
    const inner = wrapper.findComponent({ name: 'AInputPassword' })
    expect(inner.props('visibilityToggle')).toBe(true)
    expect(wrapper.find('.ant-input-password-icon').exists()).toBe(true)
  })

  it('v-model：用户输入触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmInputPassword, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('secret')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('secret')
  })

  it('v-model：父组件更新 modelValue 同步到内部 input（parent→child，真双向）', async () => {
    const wrapper = mount(TmInputPassword, { props: { modelValue: '' } })
    expect(wrapper.find('input').element.value).toBe('')
    await wrapper.setProps({ modelValue: 'hello' })
    expect(wrapper.find('input').element.value).toBe('hello')
  })

  it('清空 emit 空串而非 undefined（spec 值契约）', async () => {
    const wrapper = mount(TmInputPassword, { props: { modelValue: 'abc' } })
    await wrapper.find('input').setValue('')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted?.[0]?.[0]).toBe('')
  })

  it('可见性切换：点击眼睛图标切明文，再点回密文，值不丢', async () => {
    const wrapper = mount(TmInputPassword, { props: { modelValue: 'keep' } })
    const icon = wrapper.find('.ant-input-password-icon')
    await icon.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
    expect(wrapper.find('input').element.value).toBe('keep')
    await icon.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('password')
    expect(wrapper.find('input').element.value).toBe('keep')
  })

  it('visibilityToggle=false：切换图标不渲染，恒密文', async () => {
    const wrapper = mount(TmInputPassword, { props: { visibilityToggle: false } })
    expect(wrapper.find('.ant-input-password-icon').exists()).toBe(false)
    await wrapper.find('input').setValue('still-secret')
    expect(wrapper.find('input').attributes('type')).toBe('password')
  })

  it('业务显式覆盖公司默认值：size=small 下发', () => {
    const wrapper = mount(TmInputPassword, { props: { size: 'small' } })
    const inner = wrapper.findComponent({ name: 'AInputPassword' })
    expect(inner.props('size')).toBe('small')
  })

  it('iconRender 插槽：自定义图标渲染并保留点击切换行为（scope 包装为 { visible }）', async () => {
    const wrapper = mount(TmInputPassword, {
      slots: { iconRender: '<span class="custom-eye">眼睛</span>' },
    })
    const custom = wrapper.find('.custom-eye')
    expect(custom.exists()).toBe(true)
    // ant 经 cloneElement 给插槽根元素注入点击切换，点击后切明文
    await custom.trigger('click')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('prefix 插槽正常可用（suffix 的原生限制不影响 prefix）', () => {
    const wrapper = mount(TmInputPassword, { slots: { prefix: '<i>前缀</i>' } })
    expect(wrapper.find('i').exists()).toBe(true)
  })

  it('ant 原生限制：suffix 插槽不渲染——切换开启时被眼睛图标占用（锁定防误判为缺陷）', () => {
    const wrapper = mount(TmInputPassword, { slots: { suffix: '<i>后缀</i>' } })
    expect(wrapper.find('.ant-input-password-icon').exists()).toBe(true)
    expect(wrapper.find('i').exists()).toBe(false)
  })

  it('ant 原生限制：visibilityToggle=false 下 suffix 插槽同样不渲染（props.suffix=false 仍覆盖 slots）', () => {
    const wrapper = mount(TmInputPassword, {
      props: { visibilityToggle: false },
      slots: { suffix: '<i>后缀</i>' },
    })
    expect(wrapper.find('.ant-input-password-icon').exists()).toBe(false)
    expect(wrapper.find('i').exists()).toBe(false)
  })

  it('扩展属性剥离：modelValue 不下发到内部，经映射后 value 收到业务值', () => {
    const wrapper = mount(TmInputPassword, { props: { modelValue: 'abc' } })
    const inner = wrapper.findComponent({ name: 'AInputPassword' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('value')).toBe('abc')
  })

  it('透传 $attrs 到根元素（data-testid）', () => {
    const wrapper = mount(TmInputPassword, { attrs: { 'data-testid': 'my-pwd' } })
    expect(wrapper.find('[data-testid="my-pwd"]').exists()).toBe(true)
  })

  it('方法透传：exposed focus/blur 是函数', () => {
    const wrapper = mount(TmInputPassword)
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
    expect(typeof (wrapper.vm as unknown as { blur: unknown }).blur).toBe('function')
  })

  it('方法透传：focus() 真实聚焦内部 input 元素', async () => {
    const wrapper = mount(TmInputPassword, { attachTo: document.body })
    try {
      const inputEl = wrapper.find('input').element
      expect(document.activeElement).not.toBe(inputEl)
      await (wrapper.vm as unknown as { focus: () => void }).focus()
      expect(document.activeElement).toBe(inputEl)
    } finally {
      wrapper.unmount()
    }
  })

  it('FormContext 级联：TmForm disabled 级联禁用，业务显式 false 可覆盖', () => {
    const wrapper = mount({
      components: { TmForm, TmInputPassword },
      template: `
        <TmForm :disabled="true">
          <TmInputPassword data-cascade="form" />
          <TmInputPassword :disabled="false" data-cascade="override" />
        </TmForm>
      `,
    })
    const innerForm = wrapper.findComponent({ name: 'AInputPassword' })
    const innerOverride = wrapper.findAllComponents({ name: 'AInputPassword' })[1]
    expect(innerForm.props('disabled')).toBe(true)
    expect(innerOverride.props('disabled')).toBe(false)
  })
})
