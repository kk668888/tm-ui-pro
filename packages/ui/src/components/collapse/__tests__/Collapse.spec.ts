// packages/ui/src/components/collapse/__tests__/Collapse.spec.ts
// TmCollapse 单测：render function 转发 default slot（ant 能识别 TmCollapsePanel）、
// props 透传、点击切换
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TmCollapse from '../src/Collapse.vue'
import TmCollapsePanel from '../src/CollapsePanel.vue'

// Host 组件：验证 render function 把真实 TmCollapsePanel vnode 转发给 ant Collapse
const Host = defineComponent({
  setup() {
    return () =>
      h(TmCollapse, null, {
        default: () => [
          h(TmCollapsePanel, { key: '1', header: '面板A' }, { default: () => '内容A' }),
          h(TmCollapsePanel, { key: '2', header: '面板B', disabled: true }, { default: () => '内容B' }),
        ],
      })
  },
})

describe('TmCollapse', () => {
  it('render function 转发 default slot，ant 识别面板并渲染标题', () => {
    const wrapper = mount(Host)
    const inner = wrapper.findComponent({ name: 'ACollapse' })
    expect(inner.exists()).toBe(true)
    // 面板头渲染成功 = ant getNewChild 拿到真实 TmCollapsePanel vnode（template <slot> 虚拟节点会全丢）
    expect(wrapper.find('.ant-collapse-header').exists()).toBe(true)
    expect(wrapper.text()).toContain('面板A')
    expect(wrapper.text()).toContain('面板B')
  })

  it('面板点击切换（非受控，默认多选展开）', async () => {
    const wrapper = mount(Host)
    const item1 = wrapper.findAll('.ant-collapse-item')[0]
    expect(item1.classes()).not.toContain('ant-collapse-item-active')
    await item1.find('.ant-collapse-header').trigger('click')
    expect(wrapper.findAll('.ant-collapse-item')[0].classes()).toContain('ant-collapse-item-active')
  })

  it('disabled 面板不可展开', async () => {
    const wrapper = mount(Host)
    const item2 = wrapper.findAll('.ant-collapse-item')[1]
    await item2.find('.ant-collapse-header').trigger('click')
    expect(item2.classes()).not.toContain('ant-collapse-item-active')
  })

  it('accordion / ghost props 透传', () => {
    const wrapper = mount(TmCollapse, { props: { accordion: true, ghost: true } })
    const inner = wrapper.findComponent({ name: 'ACollapse' })
    expect(inner.props('accordion')).toBe(true)
    expect(inner.props('ghost')).toBe(true)
  })
})
