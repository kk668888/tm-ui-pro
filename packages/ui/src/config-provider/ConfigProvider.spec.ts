// packages/ui/src/config-provider/ConfigProvider.spec.ts
// TmConfigProvider 单测：验证插槽渲染 + vxe CSS 变量桥接通道存在
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfigProvider from './ConfigProvider.vue'

describe('TmConfigProvider', () => {
  it('默认渲染插槽内容', () => {
    const wrapper = mount(ConfigProvider, {
      slots: { default: '<div class="inner">hi</div>' },
    })
    expect(wrapper.html()).toContain('hi')
  })

  it('注入 vxe 视觉对齐 CSS 变量（以 ant token 为源）', () => {
    const wrapper = mount(ConfigProvider)
    // AConfigProvider 内部走 fragment 样渲染，导致 wrapper 根是 mount 容器；
    // 故定位到内部真正承载 vxe 变量的 .tm-config-provider div 验证桥接通道
    const style = wrapper.find('.tm-config-provider').attributes('style') || ''
    // 桥接通道存在即可（具体值由 ant token 运行时决定）
    expect(style).toMatch(/--vxe-ui-/)
    expect(style).toContain('--vxe-ui-primary-color')
    expect(style).toContain('--vxe-ui-font-family')
    expect(style).toContain('--vxe-ui-border-radius')
  })
})
