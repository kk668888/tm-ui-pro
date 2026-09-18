// packages/ui/src/components/checkable-tag/__tests__/CheckableTag.spec.ts
// TmCheckableTag 单测：v-model:checked 双向、change 透传、选中样式
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TmCheckableTag from '../src/CheckableTag.vue'

describe('TmCheckableTag', () => {
  it('v-model:checked：点击切换触发 update:checked（child→parent）', async () => {
    const wrapper = mount(TmCheckableTag, { props: { checked: false }, slots: { default: 'Vue' } })
    expect(wrapper.text()).toContain('Vue')
    await wrapper.find('.ant-tag-checkable').trigger('click')
    expect(wrapper.emitted('update:checked')?.[0]?.[0]).toBe(true)
  })

  it('v-model:checked：父组件更新同步选中样式（parent→child）', async () => {
    const wrapper = mount(TmCheckableTag, { props: { checked: false } })
    expect(wrapper.find('.ant-tag-checkable-checked').exists()).toBe(false)
    await wrapper.setProps({ checked: true })
    expect(wrapper.find('.ant-tag-checkable-checked').exists()).toBe(true)
  })

  it('change 事件同时透传（ant emit change(checked)）', async () => {
    const changeSpy = vi.fn()
    const wrapper = mount(TmCheckableTag, {
      props: { checked: false, onChange: changeSpy as unknown as (...a: unknown[]) => void },
    })
    const inner = wrapper.findComponent({ name: 'ACheckableTag' })
    expect(inner.props('onChange')).toBe(changeSpy)
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('change', true)
    await nextTick()
    expect(changeSpy).toHaveBeenCalledWith(true)
  })
})
