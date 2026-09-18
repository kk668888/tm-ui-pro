// packages/ui/src/components/input-search/__tests__/InputSearch.spec.ts
// TmInputSearch 单测：v-model 契约、search 事件、enterButton 透传、默认值与级联
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TmInputSearch from '../src/InputSearch.vue'
import { TmForm } from '../../form'

describe('TmInputSearch', () => {
  it('v-model：输入触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmInputSearch, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('tm')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('tm')
  })

  it('公司默认 allowClear/size/bordered 下发（与 TmInput 同源）', () => {
    const inner = mount(TmInputSearch).findComponent({ name: 'AInputSearch' })
    expect(inner.props('allowClear')).toBe(true)
    expect(inner.props('size')).toBe('middle')
    expect(inner.props('bordered')).toBe(true)
  })

  it('回车触发 search 事件并携带当前值（事件经 $attrs 透传到内部 ant）', async () => {
    const searchSpy = vi.fn()
    const wrapper = mount(TmInputSearch, {
      props: { modelValue: 'kw', onSearch: searchSpy as unknown as (...a: unknown[]) => void },
    })
    const inner = wrapper.findComponent({ name: 'AInputSearch' })
    expect(inner.props('onSearch')).toBe(searchSpy)
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      'kw',
      { source: 'input' },
    )
    await nextTick()
    expect(searchSpy).toHaveBeenCalledTimes(1)
    expect(searchSpy.mock.calls[0][0]).toBe('kw')
  })

  it('enterButton 显式透传（复合类型不声明 prop，走 $attrs）', () => {
    const wrapper = mount(TmInputSearch, { attrs: { enterButton: true } })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('FormContext 级联：TmForm disabled 级联禁用', () => {
    const wrapper = mount({
      components: { TmForm, TmInputSearch },
      template: `<TmForm :disabled="true"><TmInputSearch /></TmForm>`,
    })
    expect(wrapper.findComponent({ name: 'AInputSearch' }).props('disabled')).toBe(true)
  })
})
