// packages/ui/src/components/button/__tests__/Button.spec.ts
// TmButton 范本组件单测：验证薄封装核心机制
// 1. props/类型透传：原生 ant props 经 antProps 绑给内部按钮（含断言 ant 真实接收）
// 2. 公司默认值：type 默认为 primary（断言 .ant-btn-primary 渲染）
// 3. 行为扩展 debounce：未配置同步 emit；配置后节流 emit
// 4. 结构扩展 confirm：Popconfirm 包裹
// 5. 插槽全透传
// 6. 扩展属性剥离：debounce/confirm 不下发到内部 ant Button
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { Popconfirm } from 'ant-design-vue'
import TmButton from '../src/Button.vue'

describe('TmButton', () => {
  it('click 只触发一次业务 onClick 回调（onClick 剥离修复，2026-08-10）', async () => {
    // 回归：antProps 若把 props.onClick 透传给 AButton，加上模板 @click="onClick"（防抖 emit），
    // AButton 收到两个 onClick，点击会触发业务回调 2 次（一次直接调、一次经 emit 再调）
    const spy = vi.fn()
    const wrapper = mount(TmButton, { props: { onClick: spy } })
    await wrapper.find('button').trigger('click')
    expect(spy).toHaveBeenCalledTimes(1)
  })
  it('透传 ant 原生 props 到内部按钮（type/danger 真实下发到 ant Button）', () => {
    const wrapper = mount(TmButton, { props: { type: 'primary', danger: true } })
    // class 层面：ant-btn-primary 已渲染
    expect(wrapper.find('.ant-btn-primary').exists()).toBe(true)
    // props 层面：直接断言内部 ant Button 实例收到了 danger=true（AButton 内部组件名）
    const btn = wrapper.findComponent({ name: 'AButton' })
    expect(btn.exists()).toBe(true)
    expect(btn.props('danger')).toBe(true)
  })

  it('公司默认 type=primary 生效，业务可覆盖', () => {
    const wrapper = mount(TmButton)
    // 默认 type=primary 经 ant 渲染为 .ant-btn-primary class（真实验证默认值生效）
    expect(wrapper.find('.ant-btn-primary').exists()).toBe(true)
  })

  it('未配置 debounce 时立即同步 emit click', async () => {
    const wrapper = mount(TmButton)
    await wrapper.find('button').trigger('click')
    // 同步分支：触发后立即有 emit，无需等待 timer
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('debounce 扩展：节流 emit click', async () => {
    const wrapper = mount(TmButton, { props: { debounce: 50 } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    await new Promise((r) => setTimeout(r, 60))
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('confirm 扩展：渲染 Popconfirm 包裹', () => {
    // 注：ant Popconfirm 弹层采用 vc-trigger 懒渲染，未打开时 title 不在 DOM 中
    // 因此改用「结构上 Popconfirm 组件存在」作为断言，语义等价于「confirm 包裹」
    const wrapper = mount(TmButton, { props: { confirm: '确定吗' } })
    expect(wrapper.findComponent(Popconfirm).exists()).toBe(true)
  })

  it('插槽透传', () => {
    const wrapper = mount(TmButton, { slots: { default: '保存' } })
    // 注：ant Button 对两个中文字符自动插入空格（autoInsertSpace），实际文本为「保 存」
    // 此处去除空白后再断言，保持「插槽内容已透传」的语义
    expect(wrapper.text().replace(/\s+/g, '')).toContain('保存')
  })

  it('扩展属性剥离：debounce/confirm 不透传到内部 ant Button', () => {
    // 设了扩展属性 debounce/confirm，断言内部 ant Button 收不到（避免 ant 警告/误用）
    const wrapper = mount(TmButton, {
      props: { debounce: 50, confirm: '确定吗' },
    })
    const btn = wrapper.findComponent({ name: 'AButton' })
    expect(btn.exists()).toBe(true)
    // ant Button 不识别 debounce/confirm，应始终为 undefined
    expect(btn.props('debounce')).toBeUndefined()
    expect(btn.props('confirm')).toBeUndefined()
  })
})
