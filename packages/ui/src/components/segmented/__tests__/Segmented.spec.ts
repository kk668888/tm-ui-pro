// packages/ui/src/components/segmented/__tests__/Segmented.spec.ts
// TmSegmented 单测：受控值、options 透传、onChange 事件、block/disabled props
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmSegmented from '../src/Segmented.vue'

const options = ['日', '周', '月']

describe('TmSegmented', () => {
  it('options / value 透传（受控）', () => {
    const wrapper = mount(TmSegmented, { props: { options, value: '周' } })
    const inner = wrapper.findComponent({ name: 'ASegmented' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('options')).toEqual(options)
    expect(inner.props('value')).toBe('周')
  })

  it('block / disabled props 透传（缺省幻影 false 跳过）', () => {
    const wrapper = mount(TmSegmented, { props: { options, block: true, disabled: true } })
    const inner = wrapper.findComponent({ name: 'ASegmented' })
    expect(inner.props('block')).toBe(true)
    expect(inner.props('disabled')).toBe(true)
  })

  it('onChange 事件触发', async () => {
    const onChange = vi.fn()
    const wrapper = mount(TmSegmented, { props: { options, value: '日', onChange } })
    const inner = wrapper.findComponent({ name: 'ASegmented' })
    await inner.vm.$emit('change', '月')
    expect(onChange).toHaveBeenCalledWith('月')
  })
})
