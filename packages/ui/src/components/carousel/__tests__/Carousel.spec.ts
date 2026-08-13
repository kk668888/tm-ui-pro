// packages/ui/src/components/carousel/__tests__/Carousel.spec.ts
// TmCarousel 单测：props 透传、公开方法（CarouselRef next/goTo）经 useForwardRef 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmCarousel from '../src/Carousel.vue'

describe('TmCarousel', () => {
  it('ant 原生透传：autoplay / dots / effect 下发', () => {
    const wrapper = mount(TmCarousel, {
      props: { autoplay: true, dots: false, effect: 'fade' },
      slots: { default: '<div>1</div><div>2</div>' },
    })
    const inner = wrapper.findComponent({ name: 'ACarousel' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('autoplay')).toBe(true)
    expect(inner.props('dots')).toBe(false)
    expect(inner.props('effect')).toBe('fade')
  })

  it('公开方法透传：next / prev / goTo 可通过 ref 访问', () => {
    const wrapper = mount(TmCarousel, { slots: { default: '<div>1</div><div>2</div>' } })
    const vm = wrapper.vm as unknown as { next?: unknown; prev?: unknown; goTo?: unknown }
    expect(typeof vm.next).toBe('function')
    expect(typeof vm.prev).toBe('function')
    expect(typeof vm.goTo).toBe('function')
  })
})
