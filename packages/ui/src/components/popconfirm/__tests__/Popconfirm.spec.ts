// packages/ui/src/components/popconfirm/__tests__/Popconfirm.spec.ts
// TmPopconfirm 单测：默认文案、显式文案覆盖、danger 危险确认、扩展属性剥离、插槽透传、事件透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmPopconfirm from '../src/Popconfirm.vue'

describe('TmPopconfirm', () => {
  it('默认确认/取消文案「确定/取消」', () => {
    const wrapper = mount(TmPopconfirm, { props: { title: '确定？' } })
    const inner = wrapper.findComponent({ name: 'APopconfirm' })
    expect(inner.props('okText')).toBe('确定')
    expect(inner.props('cancelText')).toBe('取消')
  })

  it('显式 okText / cancelText 覆盖默认值', () => {
    const wrapper = mount(TmPopconfirm, {
      props: { title: '确定？', okText: '删除', cancelText: '再想想' },
    })
    const inner = wrapper.findComponent({ name: 'APopconfirm' })
    expect(inner.props('okText')).toBe('删除')
    expect(inner.props('cancelText')).toBe('再想想')
  })

  it('danger 置位时 okButtonProps 注入 danger:true', () => {
    const wrapper = mount(TmPopconfirm, { props: { title: '危险操作', danger: true } })
    const inner = wrapper.findComponent({ name: 'APopconfirm' })
    expect(inner.props('okButtonProps')).toMatchObject({ danger: true })
  })

  it('未置位 danger 时不注入 okButtonProps（保持 undefined）', () => {
    const wrapper = mount(TmPopconfirm, { props: { title: '普通' } })
    const inner = wrapper.findComponent({ name: 'APopconfirm' })
    expect(inner.props('okButtonProps')).toBeUndefined()
  })

  it('showCancel 默认 true（Boolean 陷阱兜底，取消按钮不消失）', () => {
    const wrapper = mount(TmPopconfirm, { props: { title: 'x' } })
    expect(wrapper.findComponent({ name: 'APopconfirm' }).props('showCancel')).toBe(true)
  })

  it('open 默认 undefined（受控 prop 陷阱兜底：保持 ant 非受控，点击可弹出）', () => {
    const wrapper = mount(TmPopconfirm, { props: { title: 'x' } })
    expect(wrapper.findComponent({ name: 'APopconfirm' }).props('open')).toBeUndefined()
  })

  it('danger + 业务显式 okButtonProps 并存（合并而非覆盖业务字段）', () => {
    const wrapper = mount(TmPopconfirm, {
      props: { title: '危险', danger: true, okButtonProps: { size: 'small' } },
    })
    const inner = wrapper.findComponent({ name: 'APopconfirm' })
    expect(inner.props('okButtonProps')).toMatchObject({ danger: true, size: 'small' })
  })

  it('扩展属性剥离：danger 不下发到内部 ant Popconfirm', () => {
    const wrapper = mount(TmPopconfirm, { props: { title: 'x', danger: true } })
    expect(wrapper.findComponent({ name: 'APopconfirm' }).props('danger')).toBeUndefined()
  })

  it('插槽透传：default（触发元素）转发到内部 ant Popconfirm', () => {
    const wrapper = mount(TmPopconfirm, {
      props: { title: 'x' },
      slots: { default: '<button class="trigger-btn">触发</button>' },
    })
    expect(wrapper.find('.trigger-btn').exists()).toBe(true)
  })

  it('onConfirm 事件透传（ant 原生透传链路）', () => {
    const confirmSpy = vi.fn()
    const wrapper = mount(TmPopconfirm, {
      props: { title: 'x', onConfirm: confirmSpy as unknown as (e: MouseEvent) => void },
    })
    // 事件以 props 形式透传给内部 ant Popconfirm
    expect(wrapper.findComponent({ name: 'APopconfirm' }).props('onConfirm')).toBe(confirmSpy)
  })
})
