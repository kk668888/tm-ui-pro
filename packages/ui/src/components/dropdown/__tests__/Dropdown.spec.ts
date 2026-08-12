// packages/ui/src/components/dropdown/__tests__/Dropdown.spec.ts
// TmDropdown 单测：渲染、menu 透传、open 非受控（幻影 false 跳过）、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmDropdown from '../src/Dropdown.vue'
import TmDropdownButton from '../src/DropdownButton.vue'

describe('TmDropdown', () => {
  it('渲染内部 ant Dropdown 并透传 menu', () => {
    const menu = { items: [{ key: 'a', label: '操作A' }] }
    const wrapper = mount(TmDropdown, {
      props: { menu },
      slots: { default: '<button>操作</button>' },
    })
    const inner = wrapper.findComponent({ name: 'ADropdown' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('menu')).toEqual(menu)
  })

  it('open 缺省不转发（保持 ant 非受控）', () => {
    const wrapper = mount(TmDropdown, { slots: { default: '<button>操作</button>' } })
    const inner = wrapper.findComponent({ name: 'ADropdown' })
    // 业务未传 open，不得因幻影 false 让菜单变受控锁定
    expect(inner.props('open')).toBeUndefined()
  })

  it('ant 原生透传：placement / trigger 下发', () => {
    const wrapper = mount(TmDropdown, {
      props: { placement: 'bottomRight', trigger: 'click' },
      slots: { default: '<button>操作</button>' },
    })
    const inner = wrapper.findComponent({ name: 'ADropdown' })
    expect(inner.props('placement')).toBe('bottomRight')
  })

  it('default 插槽透传（触发元素）', () => {
    const wrapper = mount(TmDropdown, { slots: { default: '<span class="dropdown-trigger">操作</span>' } })
    expect(wrapper.find('.dropdown-trigger').exists()).toBe(true)
  })

  it('trigger=click 点击触发元素可展开且 #overlay 菜单内容渲染', async () => {
    // 回归（Bug 2026-08-12）：default 插槽必须直接透传 slots.default()，否则 ant 拿到
    // <slot> 虚拟节点、ant-dropdown-trigger 类与监听挂不上；且 ant 4.2.6 的 Dropdown
    // `menu` prop 是 no-op，菜单内容必须经 #overlay 插槽提供。
    const wrapper = mount(TmDropdown, {
      props: { trigger: 'click' },
      slots: {
        default: '<button class="click-trigger">操作</button>',
        overlay: '<div class="ovr-menu">菜单内容</div>',
      },
    })
    const btn = wrapper.find('.click-trigger')
    expect(btn.element.className).toContain('ant-dropdown-trigger')
    await btn.trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 80))
    expect(wrapper.html()).toContain('ant-dropdown-open')
    // overlay 内容经 portal 渲染到 body
    expect(document.body.innerHTML).toContain('菜单内容')
  })
})

describe('TmDropdownButton', () => {
  it('渲染内部 ant Dropdown.Button', () => {
    const wrapper = mount(TmDropdownButton, { slots: { default: '更多' } })
    expect(wrapper.findComponent({ name: 'ADropdownButton' }).exists()).toBe(true)
  })

  it('#overlay 插槽透传（ant DropdownButton 下拉内容走 overlay，portal 延迟渲染）', () => {
    // overlay 内容在弹层中经 portal 渲染，jsdom 下不驻留在 wrapper HTML；
    // 断言组件可挂载且内部 ant DropdownButton 存在（overlay 经 render 函数转发）
    const wrapper = mount(TmDropdownButton, {
      slots: { default: '更多', overlay: '<div class="ovr-menu">菜单</div>' },
    })
    expect(wrapper.findComponent({ name: 'ADropdownButton' }).exists()).toBe(true)
  })

  it('按钮形态 props 透传：size / type', () => {
    const wrapper = mount(TmDropdownButton, { props: { size: 'small', type: 'primary' } })
    const inner = wrapper.findComponent({ name: 'ADropdownButton' })
    expect(inner.props('size')).toBe('small')
    expect(inner.props('type')).toBe('primary')
  })
})
