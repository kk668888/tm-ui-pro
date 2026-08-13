// packages/ui/src/components/tour/__tests__/Tour.spec.ts
// TmTour 单测：open / current / steps 透传、default 插槽透传（open=false 避免 jsdom 浮层渲染）
import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import TmTour from '../src/Tour.vue'

const steps = [
  { title: '第一步', description: '引导内容一' },
  { title: '第二步', description: '引导内容二' },
]

describe('TmTour', () => {
  it('open / current / steps 等 props 透传', () => {
    const wrapper = mount(TmTour, { props: { open: false, current: 0, steps } })
    const inner = wrapper.findComponent({ name: 'ATour' })
    expect(inner.props('open')).toBe(false)
    expect(inner.props('current')).toBe(0)
    expect(inner.props('steps')).toEqual(steps)
  })

  it('未传 open 时不注入 open（缺省幻影 false 跳过，避免受控 false）', () => {
    const wrapper = mount(TmTour, { props: { steps } })
    const inner = wrapper.findComponent({ name: 'ATour' })
    expect(inner.props('open')).toBeUndefined()
  })

  it('open=true 挂载不报错（浮层渲染路径留给浏览器 demo 验证）', () => {
    const wrapper = mount(TmTour, { props: { open: true, steps } })
    expect(wrapper.findComponent({ name: 'ATour' }).exists()).toBe(true)
  })

  it('ant 关闭回调桥接为 update:open=false 并透传 close', async () => {
    const wrapper = mount(TmTour, { props: { open: true, steps } })
    const onClose = wrapper.findComponent({ name: 'ATour' }).props('onClose') as (cur: number) => void
    expect(typeof onClose).toBe('function')
    onClose(1)
    await nextTick()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.emitted('close')).toEqual([[1]])
  })

  it('ant 完成回调桥接为 update:open=false 并透传 finish', async () => {
    const wrapper = mount(TmTour, { props: { open: true, steps } })
    const onFinish = wrapper.findComponent({ name: 'ATour' }).props('onFinish') as () => void
    expect(typeof onFinish).toBe('function')
    onFinish()
    await nextTick()
    expect(wrapper.emitted('update:open')).toEqual([[false]])
    expect(wrapper.emitted('finish')).toHaveLength(1)
  })

  it('业务 @close 监听经桥接单次触发（onClose 已剔除透传，不重复不丢失）', async () => {
    const spy = vi.fn()
    const wrapper = mount(TmTour, {
      props: { open: true, steps },
      attrs: { onClose: spy },
    })
    // 内部 ant 的 onClose prop 应为桥接函数（业务监听已被剔除，非数组）
    const onClose = wrapper.findComponent({ name: 'ATour' }).props('onClose') as (cur: number) => void
    expect(typeof onClose).toBe('function')
    onClose(0)
    await nextTick()
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenCalledWith(0)
  })
})
