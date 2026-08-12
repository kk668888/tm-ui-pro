// packages/ui/src/components/popover/__tests__/Popover.spec.ts
// TmPopover 单测：autoAdjustOverflow 默认兜底、ant 原生透传、插槽透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmPopover from '../src/Popover.vue'

describe('TmPopover', () => {
  it('autoAdjustOverflow 默认 true（Boolean 陷阱兜底，气泡随视口调整）', () => {
    const wrapper = mount(TmPopover, { slots: { default: '<button>触发</button>' } })
    expect(wrapper.findComponent({ name: 'APopover' }).props('autoAdjustOverflow')).toBe(true)
  })

  it('显式 autoAdjustOverflow=false 覆盖默认', () => {
    const wrapper = mount(TmPopover, {
      props: { autoAdjustOverflow: false },
      slots: { default: '<button>触发</button>' },
    })
    expect(wrapper.findComponent({ name: 'APopover' }).props('autoAdjustOverflow')).toBe(false)
  })

  it('open / visible 默认 undefined（受控 prop 陷阱兜底：保持 ant 非受控，触发可弹出）', () => {
    const wrapper = mount(TmPopover, { slots: { default: '<button>触发</button>' } })
    const inner = wrapper.findComponent({ name: 'APopover' })
    expect(inner.props('open')).toBeUndefined()
    expect(inner.props('visible')).toBeUndefined()
  })

  it('ant 原生透传：title / content / trigger', () => {
    const wrapper = mount(TmPopover, {
      props: { title: '标题', content: '内容', trigger: 'click' },
      slots: { default: '<button>触发</button>' },
    })
    const inner = wrapper.findComponent({ name: 'APopover' })
    expect(inner.props('title')).toBe('标题')
    expect(inner.props('content')).toBe('内容')
    expect(inner.props('trigger')).toBe('click')
  })

  it('插槽透传：default（触发元素）转发到内部 ant Popover', () => {
    const wrapper = mount(TmPopover, {
      slots: { default: '<span class="trigger-btn">触发</span>' },
    })
    expect(wrapper.find('.trigger-btn').exists()).toBe(true)
  })
})
