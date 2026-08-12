// packages/ui/src/components/tree/__tests__/Tree.spec.ts
// TmTree 单测：treeData 透传、checkable/selectedKeys 透传、DirectoryTree
// 注：ant Tree 的遗留子组件 API（<TreeNode/>）经 wrapper 会被 treeUtil 递归处理破坏，
// 故 TmTree 只用 treeData 配置驱动（Node 移除，见 index.ts 注释）。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTree from '../src/Tree.vue'
import TmDirectoryTree from '../src/DirectoryTree.vue'

describe('TmTree', () => {
  it('渲染内部 ant Tree 并透传 treeData', () => {
    const treeData = [{ key: 'n1', title: '节点一' }]
    const wrapper = mount(TmTree, { props: { treeData } })
    const inner = wrapper.findComponent({ name: 'ATree' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('treeData')).toEqual(treeData)
  })

  it('ant 原生透传：checkable / selectedKeys 下发', () => {
    const wrapper = mount(TmTree, { props: { checkable: true, selectedKeys: ['n1'] } })
    const inner = wrapper.findComponent({ name: 'ATree' })
    expect(inner.props('checkable')).toBe(true)
    expect(inner.props('selectedKeys')).toEqual(['n1'])
  })

  it('treeData 渲染树节点 DOM', () => {
    const wrapper = mount(TmTree, {
      props: { treeData: [{ key: 'n1', title: '节点一' }], defaultExpandAll: true },
    })
    expect(wrapper.find('.ant-tree-treenode').exists()).toBe(true)
  })
})

describe('TmDirectoryTree', () => {
  it('渲染内部 ant DirectoryTree 并透传 treeData', () => {
    const treeData = [{ key: 'n1', title: '目录一' }]
    const wrapper = mount(TmDirectoryTree, { props: { treeData } })
    expect(wrapper.findComponent({ name: 'ADirectoryTree' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ADirectoryTree' }).props('treeData')).toEqual(treeData)
  })

  it('treeData 渲染目录树节点 DOM', () => {
    const wrapper = mount(TmDirectoryTree, {
      props: { treeData: [{ key: 'n1', title: '目录一' }], defaultExpandAll: true },
    })
    expect(wrapper.find('.ant-tree-treenode').exists()).toBe(true)
  })
})
