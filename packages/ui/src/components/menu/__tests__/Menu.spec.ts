// packages/ui/src/components/menu/__tests__/Menu.spec.ts
// TmMenu 单测：菜单渲染、items/mode/theme 透传、子组件族渲染
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TmMenu from '../src/Menu.vue'
import TmMenuItem from '../src/MenuItem.vue'
import TmSubMenu from '../src/SubMenu.vue'
import TmMenuItemGroup from '../src/MenuItemGroup.vue'
import TmMenuDivider from '../src/MenuDivider.vue'

describe('TmMenu', () => {
  it('渲染内部 ant Menu 并透传 items', () => {
    const items = [{ key: 'a', label: '菜单A' }]
    const wrapper = mount(TmMenu, { props: { items } })
    const inner = wrapper.findComponent({ name: 'AMenu' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('items')).toEqual(items)
  })

  it('ant 原生透传：mode / theme 下发', () => {
    const wrapper = mount(TmMenu, { props: { mode: 'inline', theme: 'dark' } })
    const inner = wrapper.findComponent({ name: 'AMenu' })
    expect(inner.props('mode')).toBe('inline')
    expect(inner.props('theme')).toBe('dark')
  })

  it('default 插槽透传', () => {
    const wrapper = mount(TmMenu, { slots: { default: '<span class="menu-child">项</span>' } })
    expect(wrapper.find('.menu-child').exists()).toBe(true)
  })

  it('内联模式点击单项仅该菜单项选中（key 传导）', async () => {
    // 回归（Bug 2026-08-12）：vnode key 必须传导到内部 AMenuItem，否则多项同时高亮
    const wrapper = mount(TmMenu, {
      props: { mode: 'inline' },
      slots: {
        default: () => [
          h(TmMenuItem, { key: 'a' }, () => 'A'),
          h(TmMenuItem, { key: 'b' }, () => 'B'),
        ],
      },
    })
    await wrapper.findAll('li')[1].trigger('click')
    await new Promise((resolve) => setTimeout(resolve, 50))
    const selected = wrapper
      .findAll('.ant-menu-item')
      .map((li) => li.element.className.includes('ant-menu-item-selected'))
    expect(selected).toEqual([false, true])
  })
})

describe('TmMenu 子组件族', () => {
  // Menu 子组件需 Menu 祖先上下文（provide/inject），用 TmMenu 宿主包裹后断言内部 ant 组件
  const host = (child: unknown): ReturnType<typeof defineComponent> =>
    defineComponent({
      render() {
        return h(TmMenu, { mode: 'inline' }, () => [child])
      },
    })

  it('渲染内部 ant 子组件', () => {
    expect(mount(host(h(TmMenuItem, null, () => '项'))).findComponent({ name: 'AMenuItem' }).exists()).toBe(true)
    expect(mount(host(h(TmMenuItemGroup, null, () => '组'))).findComponent({ name: 'AMenuItemGroup' }).exists()).toBe(true)
    expect(mount(host(h(TmMenuDivider))).findComponent({ name: 'AMenuDivider' }).exists()).toBe(true)
  })

  it('菜单项插槽透传', () => {
    const w = mount(host(h(TmMenuItem, null, () => h('span', { class: 'mi-child' }, '菜单项'))))
    expect(w.find('.mi-child').exists()).toBe(true)
  })
})

// 模板子组件写法（文档「子组件写法」一节的依据）：SubMenu / ItemGroup / Divider 真实渲染
describe('TmMenu 子组件写法', () => {
  it('SubMenu 标题与嵌套项、ItemGroup 组标题、Divider 分割线均渲染', () => {
    const wrapper = mount({
      components: { TmMenu, TmMenuItem, TmSubMenu, TmMenuItemGroup, TmMenuDivider },
      template: `<TmMenu mode="inline">
        <TmMenuItemGroup title="基础数据">
          <TmMenuItem key="g1">仓库</TmMenuItem>
        </TmMenuItemGroup>
        <TmMenuDivider />
        <TmSubMenu key="sys" title="系统管理">
          <TmMenuItem key="u1">用户管理</TmMenuItem>
        </TmSubMenu>
      </TmMenu>`,
    })
    expect(wrapper.find('.ant-menu-item-group-title').text()).toBe('基础数据')
    expect(wrapper.find('.ant-menu-item-divider').exists()).toBe(true)
    expect(wrapper.find('.ant-menu-submenu-title').text()).toContain('系统管理')
    expect(wrapper.text()).toContain('用户管理')
  })

  it('传了 items 后子组件被整体忽略（ant itemsNodes 优先，文档已注明）', () => {
    const wrapper = mount({
      components: { TmMenu, TmMenuItem },
      template: `<TmMenu mode="inline" :items="[{ key: 'a', label: '来自 items' }]">
        <TmMenuItem key="b">来自子组件</TmMenuItem>
      </TmMenu>`,
    })
    expect(wrapper.text()).toContain('来自 items')
    expect(wrapper.text()).not.toContain('来自子组件')
  })
})
