// packages/ui/src/components/modal/Modal.spec.ts
// TmModal 组件式单测：v-model:open 桥接、命令式方法合并
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import { TmModal } from '../index'

describe('TmModal 组件式', () => {
  it('v-model：父组件 modelValue=true 时内部 ant Modal open=true（parent→child）', async () => {
    const wrapper = mount(TmModal, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'AModal' })
      expect(inner.props('open')).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })

  it('v-model：内部 update:open 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmModal, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'AModal' })
      ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('update:open', false)
      await nextTick()
      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('公司默认 closable/mask=true 真实下发（Boolean 陷阱兜底回归，2026-08-10）', () => {
    const wrapper = mount(TmModal, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'AModal' })
      // ant 默认 true 的 Boolean prop 被类型化 defineProps 默认成 false → 关闭 X 与遮罩消失
      expect(inner.props('closable')).toBe(true)
      expect(inner.props('mask')).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })

  it('扩展属性剥离：modelValue/visible 不下发到内部 ant Modal', () => {
    const wrapper = mount(TmModal, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'AModal' })
      expect(inner.props('modelValue')).toBeUndefined()
      // visible 是 deprecated Boolean prop（类型化 defineProps 默认 false 会锁死），必须剥离
      expect(inner.props('visible')).toBeUndefined()
    } finally {
      wrapper.unmount()
    }
  })

  it('命令式静态方法合并到同一对象（TmModal.confirm 可用）', () => {
    expect(typeof (TmModal as unknown as { confirm: unknown }).confirm).toBe('function')
  })
})
