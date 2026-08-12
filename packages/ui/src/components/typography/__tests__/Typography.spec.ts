// packages/ui/src/components/typography/__tests__/Typography.spec.ts
// TmTypography 单测：四子组件渲染、props 透传、插槽透传
// 注：ant Typography 子组件是函数组件（displayName），用 DOM 断言更稳：
// Title→h{level}、Paragraph→div、Text→span、Link→a
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTypographyTitle from '../src/Title.vue'
import TmTypographyParagraph from '../src/Paragraph.vue'
import TmTypographyText from '../src/Text.vue'
import TmTypographyLink from '../src/Link.vue'

describe('TmTypographyTitle', () => {
  it('level 渲染对应标题层级 + 文案', () => {
    const wrapper = mount(TmTypographyTitle, { props: { level: 3 }, slots: { default: '标题' } })
    expect(wrapper.find('h3').exists()).toBe(true)
    expect(wrapper.find('h3').text()).toBe('标题')
  })

  it('copyable 渲染复制操作按钮', () => {
    const wrapper = mount(TmTypographyTitle, { props: { copyable: true } })
    expect(wrapper.find('.ant-typography-copy').exists()).toBe(true)
  })
})

describe('TmTypographyParagraph', () => {
  it('渲染段落 div + 文案', () => {
    const wrapper = mount(TmTypographyParagraph, { slots: { default: '正文' } })
    expect(wrapper.find('div.ant-typography').exists()).toBe(true)
    expect(wrapper.find('div.ant-typography').text()).toBe('正文')
  })

  it('copyable 渲染复制操作按钮', () => {
    const wrapper = mount(TmTypographyParagraph, { props: { copyable: true } })
    expect(wrapper.find('.ant-typography-copy').exists()).toBe(true)
  })
})

describe('TmTypographyText', () => {
  it('渲染 span + 文案', () => {
    const wrapper = mount(TmTypographyText, { slots: { default: '文本' } })
    expect(wrapper.find('span.ant-typography').exists()).toBe(true)
    expect(wrapper.find('span.ant-typography').text()).toBe('文本')
  })

  it('type 透传渲染语义 class', () => {
    const wrapper = mount(TmTypographyText, { props: { type: 'secondary' } })
    expect(wrapper.find('span.ant-typography-secondary').exists()).toBe(true)
  })
})

describe('TmTypographyLink', () => {
  it('渲染链接 a + 文案', () => {
    const wrapper = mount(TmTypographyLink, { slots: { default: '链接' } })
    expect(wrapper.find('a.ant-typography').exists()).toBe(true)
    expect(wrapper.find('a.ant-typography').text()).toBe('链接')
  })

  it('href 经 attrs 透传', () => {
    const wrapper = mount(TmTypographyLink, { attrs: { href: '/x' } })
    expect(wrapper.find('a').attributes('href')).toBe('/x')
  })
})
