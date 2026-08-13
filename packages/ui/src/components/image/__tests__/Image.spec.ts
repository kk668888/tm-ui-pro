// packages/ui/src/components/image/__tests__/Image.spec.ts
// TmImage 单测：props 透传、插槽透传；TmImagePreviewGroup provide/inject 渲染
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import TmImage from '../src/Image.vue'
import TmImagePreviewGroup from '../src/ImagePreviewGroup.vue'

describe('TmImage', () => {
  it('ant 原生透传：src / width 下发（alt 非 ant Image prop，透传到内部 img）', () => {
    const wrapper = mount(TmImage, { props: { src: 'x.png', width: 100 } })
    const inner = wrapper.findComponent({ name: 'AImage' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('src')).toBe('x.png')
    expect(inner.props('width')).toBe(100)
  })

  it('preview 禁用透传（false 显式传值生效）', () => {
    const wrapper = mount(TmImage, { props: { src: 'x.png', preview: false } })
    expect(wrapper.findComponent({ name: 'AImage' }).props('preview')).toBe(false)
  })

  it('placeholder 插槽透传', () => {
    const wrapper = mount(TmImage, {
      props: { src: 'x.png' },
      slots: { placeholder: '<div class="img-placeholder">占位</div>' },
    })
    expect(wrapper.find('.img-placeholder').exists()).toBe(true)
  })
})

// Host：TmImagePreviewGroup 子项 TmImage 通过 provide/inject 注册到预览组
const GroupHost = defineComponent({
  setup() {
    return () =>
      h(TmImagePreviewGroup, null, {
        default: () => [h(TmImage, { src: 'a.png' }), h(TmImage, { src: 'b.png' })],
      })
  },
})

describe('TmImagePreviewGroup', () => {
  it('default slot 透传，子 TmImage 正常渲染', () => {
    const wrapper = mount(GroupHost)
    const inner = wrapper.findComponent({ name: 'AImagePreviewGroup' })
    expect(inner.exists()).toBe(true)
    expect(wrapper.findAll('img').length).toBe(2)
  })
})
