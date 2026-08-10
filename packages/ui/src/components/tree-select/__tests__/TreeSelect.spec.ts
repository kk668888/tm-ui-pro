// packages/ui/src/components/tree-select/__tests__/TreeSelect.spec.ts
// TmTreeSelect 单测：v-model 桥接、treeData/fieldNames 透传、readonly 锁（含 showSearch）、disabled 级联
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import TmTreeSelect from '../src/TreeSelect.vue'
import TmForm from '../../form/src/Form.vue'

const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [{ title: 'Child Node1', value: '0-0-1' }],
  },
]

describe('TmTreeSelect', () => {
  it('v-model：内部 update:value 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmTreeSelect, { props: { modelValue: '0-0', treeData } })
    const inner = wrapper.findComponent({ name: 'ATreeSelect' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'update:value',
      '0-0-1',
    )
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('0-0-1')
  })

  it('v-model：父组件更新 modelValue 同步到内部 value（parent→child，真双向）', async () => {
    const wrapper = mount(TmTreeSelect, { props: { modelValue: '0-0', treeData } })
    const inner = wrapper.findComponent({ name: 'ATreeSelect' })
    expect(inner.props('value')).toBe('0-0')
    await wrapper.setProps({ modelValue: '0-0-1' })
    expect(inner.props('value')).toBe('0-0-1')
  })

  it('treeData/fieldNames 原生透传到内部 ant TreeSelect', () => {
    const wrapper = mount(TmTreeSelect, {
      props: { modelValue: '0-0', treeData, fieldNames: { label: 'title', value: 'id' } },
    })
    const inner = wrapper.findComponent({ name: 'ATreeSelect' })
    expect(inner.props('treeData')).toEqual(treeData)
    expect(inner.props('fieldNames')).toEqual({ label: 'title', value: 'id' })
  })

  it('扩展属性剥离：modelValue/readonly 不下发到内部 ant TreeSelect', () => {
    const wrapper = mount(TmTreeSelect, { props: { modelValue: '0-0', readonly: true } })
    const inner = wrapper.findComponent({ name: 'ATreeSelect' })
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('readonly')).toBeUndefined()
  })

  it('readonly 锁：TmForm readonly=true 时 open:false / allowClear:false / showSearch:false（searchable）', () => {
    const wrapper = mount(TmForm, {
      props: { readonly: true },
      slots: { default: () => h(TmTreeSelect, { modelValue: '0-0', treeData }) },
    })
    const inner = wrapper.findComponent({ name: 'ATreeSelect' })
    expect(inner.props('open')).toBe(false)
    expect(inner.props('allowClear')).toBe(false)
    expect(inner.props('showSearch')).toBe(false)
  })

  it('disabled 级联：TmForm disabled=true 时内部 ant TreeSelect disabled', () => {
    const wrapper = mount(TmForm, {
      props: { disabled: true },
      slots: { default: () => h(TmTreeSelect, { modelValue: '0-0', treeData }) },
    })
    const inner = wrapper.findComponent({ name: 'ATreeSelect' })
    expect(inner.props('disabled')).toBe(true)
  })

  it('方法透传：exposed focus 是函数', () => {
    const wrapper = mount(TmTreeSelect, { props: { modelValue: '0-0', treeData } })
    expect(typeof (wrapper.vm as unknown as { focus: unknown }).focus).toBe('function')
  })
})
