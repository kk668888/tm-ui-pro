// packages/ui/src/components/avatar/__tests__/Avatar.spec.ts
// TmAvatar 单测：props 透传、图片回退 prop 下发；TmAvatarGroup render function + maxCount
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TmAvatar from '../src/Avatar.vue'
import TmAvatarGroup from '../src/AvatarGroup.vue'

describe('TmAvatar', () => {
  it('ant 原生透传：shape / size / src 下发', () => {
    const wrapper = mount(TmAvatar, { props: { shape: 'square', size: 40, src: 'x.png' } })
    const inner = wrapper.findComponent({ name: 'AAvatar' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('shape')).toBe('square')
    expect(inner.props('size')).toBe(40)
    expect(inner.props('src')).toBe('x.png')
  })

  it('图片失败回退 icon 渲染（jsdom 无真实图片，验证结构存在）', () => {
    const wrapper = mount(TmAvatar, { slots: { default: '<span class="avatar-icon">U</span>' } })
    expect(wrapper.find('.avatar-icon').text()).toBe('U')
  })
})

// Host：TmAvatarGroup 遍历子头像 cloneElement（render function 转发真实子 VNode）
const GroupHost = defineComponent({
  setup() {
    return () =>
      h(TmAvatarGroup, { maxCount: 2 }, {
        default: () => [
          h(TmAvatar, { src: 'a.png' }),
          h(TmAvatar, { src: 'b.png' }),
          h(TmAvatar, { src: 'c.png' }),
        ],
      })
  },
})

describe('TmAvatarGroup', () => {
  it('render function 转发 default slot，ant 渲染头像组', () => {
    const wrapper = mount(GroupHost)
    const inner = wrapper.findComponent({ name: 'AAvatarGroup' })
    expect(inner.exists()).toBe(true)
    expect(wrapper.find('.ant-avatar-group').exists()).toBe(true)
  })

  it('maxCount 透传', () => {
    const wrapper = mount(GroupHost)
    expect(wrapper.findComponent({ name: 'AAvatarGroup' }).props('maxCount')).toBe(2)
  })
})
