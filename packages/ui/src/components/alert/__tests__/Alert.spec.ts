// packages/ui/src/components/alert/__tests__/Alert.spec.ts
// TmAlert 单测：status 语义类型映射、显式 type 优先、ant 原生透传、扩展属性剥离、插槽透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmAlert from '../src/Alert.vue'

describe('TmAlert', () => {
  it('status: success 映射为 ant 语义类型 success', () => {
    const wrapper = mount(TmAlert, { props: { status: 'success', message: 'ok' } })
    expect(wrapper.findComponent({ name: 'AAlert' }).props('type')).toBe('success')
  })

  it('status: failed 映射为 ant 语义类型 error（业务枚举与 ant 命名差异）', () => {
    const wrapper = mount(TmAlert, { props: { status: 'failed', message: 'x' } })
    expect(wrapper.findComponent({ name: 'AAlert' }).props('type')).toBe('error')
  })

  it('status: processing 归一到 ant 语义类型 info（ant Alert 无 processing）', () => {
    const wrapper = mount(TmAlert, { props: { status: 'processing', message: 'x' } })
    expect(wrapper.findComponent({ name: 'AAlert' }).props('type')).toBe('info')
  })

  it('未知 status 回退默认（type undefined → ant 默认 info），不抛错', () => {
    // as any 明确表达「运行时注入的非法 status」，突破 TS 枚举约束是有意为之
    const wrapper = mount(TmAlert, { props: { status: 'unknown' as any, message: 'x' } })
    expect(wrapper.findComponent({ name: 'AAlert' }).props('type')).toBeUndefined()
  })

  it('显式 type 优先于 status 映射', () => {
    const wrapper = mount(TmAlert, { props: { status: 'failed', type: 'success', message: 'x' } })
    expect(wrapper.findComponent({ name: 'AAlert' }).props('type')).toBe('success')
  })

  it('扩展属性剥离：status 不下发到内部 ant Alert', () => {
    const wrapper = mount(TmAlert, { props: { status: 'success', message: 'x' } })
    expect(wrapper.findComponent({ name: 'AAlert' }).props('status')).toBeUndefined()
  })

  it('ant 原生透传：description / closable / onClose（真实 DOM 交互）', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(TmAlert, {
      props: {
        message: '标题',
        description: '描述',
        closable: true,
        onClose: closeSpy as unknown as (e: MouseEvent) => void,
      },
    })
    const inner = wrapper.findComponent({ name: 'AAlert' })
    expect(inner.props('description')).toBe('描述')
    expect(inner.props('closable')).toBe(true)
    const closeIcon = wrapper.find('.ant-alert-close-icon')
    expect(closeIcon.exists()).toBe(true)
    await closeIcon.trigger('click')
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('插槽透传：message 插槽转发到内部 ant Alert', () => {
    const wrapper = mount(TmAlert, { slots: { message: '<span class="custom-msg">自定义</span>' } })
    expect(wrapper.find('.custom-msg').exists()).toBe(true)
  })
})
