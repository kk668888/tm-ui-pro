// packages/ui/src/components/drawer/Drawer.spec.ts
// TmDrawer 组件式单测：v-model:open 桥接、扩展属性剥离
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TmDrawer from './index'

describe('TmDrawer', () => {
  it('v-model：父组件 modelValue=true 时内部 ant Drawer open=true（parent→child）', async () => {
    const wrapper = mount(TmDrawer, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'ADrawer' })
      expect(inner.props('open')).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })

  it('v-model：内部 update:open 触发 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmDrawer, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'ADrawer' })
      ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit('update:open', false)
      await nextTick()
      expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe(false)
    } finally {
      wrapper.unmount()
    }
  })

  it('公司默认 closable/mask=true 真实下发（Boolean 陷阱兜底回归，2026-08-10）', () => {
    const wrapper = mount(TmDrawer, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'ADrawer' })
      // ant 默认 true 的 Boolean prop 被类型化 defineProps 默认成 false → 关闭 X 与遮罩消失
      expect(inner.props('closable')).toBe(true)
      expect(inner.props('mask')).toBe(true)
    } finally {
      wrapper.unmount()
    }
  })

  it('扩展属性剥离：modelValue/visible 不下发到内部 ant Drawer', () => {
    const wrapper = mount(TmDrawer, { props: { modelValue: true }, attachTo: document.body })
    try {
      const inner = wrapper.findComponent({ name: 'ADrawer' })
      expect(inner.props('modelValue')).toBeUndefined()
      // visible 是 deprecated Boolean prop（类型化 defineProps 默认 false 会锁死），必须剥离
      expect(inner.props('visible')).toBeUndefined()
    } finally {
      wrapper.unmount()
    }
  })
})
