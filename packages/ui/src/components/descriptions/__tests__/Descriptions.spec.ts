// packages/ui/src/components/descriptions/__tests__/Descriptions.spec.ts
// TmDescriptions 单测：render function 转发 default slot（ant 能读取 TmDescriptionsItem 的
// label/span）、column/layout props 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TmDescriptions from '../src/Descriptions.vue'
import TmDescriptionsItem from '../src/DescriptionsItem.vue'

// Host 组件：验证 render function 把真实 TmDescriptionsItem vnode 转发给 ant Descriptions
const Host = defineComponent({
  setup() {
    return () =>
      h(TmDescriptions, { column: 1, bordered: true }, {
        default: () => [
          h(TmDescriptionsItem, { label: '姓名', span: 1 }, { default: () => '张三' }),
          h(TmDescriptionsItem, { label: '年龄', span: 1 }, { default: () => 18 }),
        ],
      })
  },
})

describe('TmDescriptions', () => {
  it('render function 转发 default slot，ant 读取 TmDescriptionsItem 的 label', () => {
    const wrapper = mount(Host)
    const inner = wrapper.findComponent({ name: 'ADescriptions' })
    expect(inner.exists()).toBe(true)
    // 条目 label 渲染成功 = ant getRows 读到真实 TmDescriptionsItem 的 props（template <slot> 虚拟节点会丢 label）
    expect(wrapper.text()).toContain('姓名')
    expect(wrapper.text()).toContain('张三')
    expect(wrapper.text()).toContain('年龄')
  })

  it('column / layout props 透传', () => {
    const wrapper = mount(Host)
    const inner = wrapper.findComponent({ name: 'ADescriptions' })
    expect(inner.props('column')).toBe(1)
    expect(inner.props('bordered')).toBe(true)
  })

  it('layout 垂直布局透传', () => {
    const wrapper = mount(TmDescriptions, { props: { layout: 'vertical' } })
    expect(wrapper.findComponent({ name: 'ADescriptions' }).props('layout')).toBe('vertical')
  })
})
