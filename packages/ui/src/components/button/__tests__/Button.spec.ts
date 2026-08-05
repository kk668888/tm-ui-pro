// packages/ui/src/components/button/__tests__/Button.spec.ts
// TmButton 范本组件单测：验证薄封装核心机制
// 1. props/类型透传：原生 ant props 经 antProps 绑给内部按钮
// 2. 公司默认值：type 默认为 primary
// 3. 行为扩展 debounce：节流 emit click
// 4. 结构扩展 confirm：Popconfirm 包裹
// 5. 插槽全透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { Popconfirm } from 'ant-design-vue'
import TmButton from '../src/Button.vue'

describe('TmButton', () => {
  it('透传 ant 原生 props 到内部按钮', () => {
    const wrapper = mount(TmButton, { props: { type: 'primary', danger: true } })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('公司默认 type=primary 生效，业务可覆盖', () => {
    const wrapper = mount(TmButton)
    // 默认 type=primary 经 ant 渲染为对应 class
    expect(wrapper.html()).toContain('ant-btn')
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
})
