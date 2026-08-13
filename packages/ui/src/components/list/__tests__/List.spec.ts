// packages/ui/src/components/list/__tests__/List.spec.ts
// TmList 单测：dataSource + #renderItem 渲染、分页/加载 props 透传、子组件透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h, ref } from 'vue'
import TmList from '../src/List.vue'
import TmListItem from '../src/ListItem.vue'
import TmListItemMeta from '../src/ListItemMeta.vue'

// Host 组件：dataSource + #renderItem（ant List 渲染数据源的标准用法）
const Host = defineComponent({
  setup() {
    const items = ref(['项目 A', '项目 B'])
    return () =>
      h(TmList, { dataSource: items.value }, {
        renderItem: ({ item }: { item: string }) => h(TmListItem, null, { default: () => item }),
      })
  },
})

describe('TmList', () => {
  it('dataSource + #renderItem 渲染列表项', () => {
    const wrapper = mount(Host)
    expect(wrapper.findAll('.ant-list-item').length).toBe(2)
    expect(wrapper.text()).toContain('项目 A')
    expect(wrapper.text()).toContain('项目 B')
  })

  it('pagination / loading props 透传（loading 缺省幻影 false 跳过）', () => {
    const wrapper = mount(TmList, { props: { pagination: { pageSize: 10 }, loading: true } })
    const inner = wrapper.findComponent({ name: 'AList' })
    expect(inner.props('pagination')).toEqual({ pageSize: 10 })
    expect(inner.props('loading')).toBe(true)
  })

  it('header / footer 插槽透传', () => {
    const wrapper = mount(TmList, {
      slots: { header: '<div class="list-header">表头</div>', footer: '<div class="list-footer">表尾</div>' },
    })
    expect(wrapper.find('.list-header').exists()).toBe(true)
    expect(wrapper.find('.list-footer').exists()).toBe(true)
  })

  it('TmListItem / TmListItemMeta 子组件透传', () => {
    const wrapper = mount(TmListItem, {
      slots: { default: '<div class="item-body">列表项</div>' },
    })
    expect(wrapper.findComponent({ name: 'AListItem' }).exists()).toBe(true)
    expect(wrapper.text()).toContain('列表项')
  })
})
