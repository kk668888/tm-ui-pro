// packages/ui/src/components/transfer/__tests__/Transfer.spec.ts
// TmTransfer 单测：公司默认标题、业务覆盖、props 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTransfer from '../src/Transfer.vue'

describe('TmTransfer', () => {
  it('公司默认 titles 下发（源列表/目标列表）', () => {
    const wrapper = mount(TmTransfer, { props: { dataSource: [] } })
    const inner = wrapper.findComponent({ name: 'ATransfer' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('titles')).toEqual(['源列表', '目标列表'])
  })

  it('业务覆盖 titles 生效', () => {
    const wrapper = mount(TmTransfer, { props: { dataSource: [], titles: ['未选', '已选'] } })
    const inner = wrapper.findComponent({ name: 'ATransfer' })
    expect(inner.props('titles')).toEqual(['未选', '已选'])
  })

  it('render 公司默认显示 item.title（ant 默认 render 为 null 无文字）', () => {
    const wrapper = mount(TmTransfer, { props: { dataSource: [] } })
    const render = wrapper.findComponent({ name: 'ATransfer' }).props('render')
    expect(typeof render).toBe('function')
    expect(render({ key: 'k1', title: '项一' })).toBe('项一')
  })

  it('业务覆盖 render 生效', () => {
    const render = (item: { title?: string }) => `【${item.title}】`
    const wrapper = mount(TmTransfer, { props: { dataSource: [], render } })
    expect(wrapper.findComponent({ name: 'ATransfer' }).props('render')).toBe(render)
  })

  it('ant 原生透传：dataSource / showSearch / disabled 下发', () => {
    const dataSource = [{ key: 'k1', title: '项一' }]
    const wrapper = mount(TmTransfer, { props: { dataSource, showSearch: true, disabled: false } })
    const inner = wrapper.findComponent({ name: 'ATransfer' })
    expect(inner.props('dataSource')).toEqual(dataSource)
    expect(inner.props('showSearch')).toBe(true)
    expect(inner.props('disabled')).toBe(false)
  })
})
