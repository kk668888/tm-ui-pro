// packages/ui/src/components/tooltip/__tests__/Tooltip.spec.ts
// TmTooltip 单测：公司默认 placement/arrow/autoAdjustOverflow、open 幻影 false 跳过、props 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTooltip from '../src/Tooltip.vue'

describe('TmTooltip', () => {
  it('公司默认 placement=top / arrow=true / autoAdjustOverflow=true 下发', () => {
    const wrapper = mount(TmTooltip, {
      slots: { default: '<button>悬停</button>', title: '<span>提示</span>' },
    })
    const inner = wrapper.findComponent({ name: 'ATooltip' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('placement')).toBe('top')
    expect(inner.props('arrow')).toBe(true)
    expect(inner.props('autoAdjustOverflow')).toBe(true)
  })

  it('open 缺省不转发（Boolean 幻影 false 陷阱修复，不覆盖 ant 非受控默认）', () => {
    const wrapper = mount(TmTooltip, {
      slots: { default: '<button>悬停</button>', title: '<span>提示</span>' },
    })
    expect(wrapper.findComponent({ name: 'ATooltip' }).props('open')).toBeUndefined()
  })

  it('业务覆盖 placement / arrow 生效', () => {
    const wrapper = mount(TmTooltip, {
      props: { placement: 'bottom', arrow: false },
      slots: { default: '<button>悬停</button>', title: '<span>提示</span>' },
    })
    const inner = wrapper.findComponent({ name: 'ATooltip' })
    expect(inner.props('placement')).toBe('bottom')
    expect(inner.props('arrow')).toBe(false)
  })

  it('业务显式传 open=true 形成受控态（显式值转发）', () => {
    const wrapper = mount(TmTooltip, {
      props: { open: true },
      slots: { default: '<button>悬停</button>', title: '<span>提示</span>' },
    })
    expect(wrapper.findComponent({ name: 'ATooltip' }).props('open')).toBe(true)
  })
})
