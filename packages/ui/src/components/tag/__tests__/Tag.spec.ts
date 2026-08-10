// packages/ui/src/components/tag/__tests__/Tag.spec.ts
// TmTag 单测：status 状态映射、显式 color 优先、ant 原生透传、Boolean 陷阱兜底、插槽透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTag from '../src/Tag.vue'

describe('TmTag', () => {
  it('status: success 映射为 ant 预设语义色 success', () => {
    const wrapper = mount(TmTag, { props: { status: 'success' } })
    const inner = wrapper.findComponent({ name: 'ATag' })
    expect(inner.props('color')).toBe('success')
  })

  it('status: failed 映射为 ant 预设色 error（业务枚举与 ant 命名差异）', () => {
    const wrapper = mount(TmTag, { props: { status: 'failed' } })
    const inner = wrapper.findComponent({ name: 'ATag' })
    expect(inner.props('color')).toBe('error')
  })

  it('未知 status 回退默认色（color undefined → ant 默认），不抛错', () => {
    // as any 明确表达「运行时注入的非法 status」，突破 TS 枚举约束是有意为之
    const wrapper = mount(TmTag, { props: { status: 'unknown' as any } })
    const inner = wrapper.findComponent({ name: 'ATag' })
    expect(inner.props('color')).toBeUndefined()
  })

  it('显式 color 优先于 status 映射', () => {
    const wrapper = mount(TmTag, { props: { status: 'success', color: 'purple' } })
    const inner = wrapper.findComponent({ name: 'ATag' })
    expect(inner.props('color')).toBe('purple')
  })

  it('扩展属性剥离：status 不下发到内部 ant Tag', () => {
    const wrapper = mount(TmTag, { props: { status: 'success' } })
    const inner = wrapper.findComponent({ name: 'ATag' })
    expect(inner.props('status')).toBeUndefined()
  })

  it('公司默认 bordered=true（Boolean 陷阱兜底回归）', () => {
    const wrapper = mount(TmTag)
    const inner = wrapper.findComponent({ name: 'ATag' })
    expect(inner.props('bordered')).toBe(true)
  })

  it('ant 原生 onClose 透传：点击关闭图标触发回调（真实 DOM 交互）', async () => {
    const closeSpy = vi.fn()
    const wrapper = mount(TmTag, {
      props: { onClose: closeSpy as unknown as (e: MouseEvent) => void, closable: true },
      slots: { default: '可关闭' },
    })
    const closeIcon = wrapper.find('.ant-tag-close-icon')
    expect(closeIcon.exists()).toBe(true)
    await closeIcon.trigger('click')
    expect(closeSpy).toHaveBeenCalledTimes(1)
  })

  it('未传 visible 时 ant 收到 undefined（不被 Boolean 解析为 false 导致 ant-tag-hidden）', () => {
    const wrapper = mount(TmTag)
    const inner = wrapper.findComponent({ name: 'ATag' })
    // 2026-08-10 回归：ant deprecated `visible` Boolean prop 被类型化 defineProps 默认成 false，
    // ant 内部 `if (props.visible !== undefined) visible.value = false` → 标签隐藏。
    // 剥离后 ant 收到 undefined，保持默认可见。
    expect(inner.props('visible')).toBeUndefined()
  })

  it('插槽透传：default 插槽转发到内部 ant Tag', () => {
    const wrapper = mount(TmTag, { slots: { default: '<span class="tag-label">状态</span>' } })
    expect(wrapper.find('.tag-label').exists()).toBe(true)
  })
})
