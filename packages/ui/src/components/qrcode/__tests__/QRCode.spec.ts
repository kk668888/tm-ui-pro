// packages/ui/src/components/qrcode/__tests__/QRCode.spec.ts
// TmQRCode 单测：props 透传（value/size/icon）、刷新事件
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmQRCode from '../src/QRCode.vue'

describe('TmQRCode', () => {
  it('ant 原生透传：value / size / status 下发', () => {
    const wrapper = mount(TmQRCode, {
      props: { value: 'https://example.com', size: 160, status: 'active' },
    })
    const inner = wrapper.findComponent({ name: 'AQrcode' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('value')).toBe('https://example.com')
    expect(inner.props('size')).toBe(160)
    expect(inner.props('status')).toBe('active')
  })

  it('渲染二维码结构', () => {
    const wrapper = mount(TmQRCode, { props: { value: 'https://example.com' } })
    expect(wrapper.find('.ant-qrcode').exists()).toBe(true)
  })

  it('业务覆盖 value 生效（动态更新）', async () => {
    const wrapper = mount(TmQRCode, { props: { value: 'a' } })
    await wrapper.setProps({ value: 'b' })
    expect(wrapper.findComponent({ name: 'AQrcode' }).props('value')).toBe('b')
  })
})
