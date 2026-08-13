// packages/ui/src/components/comment/__tests__/Comment.spec.ts
// TmComment 兼容型单测：props 透传、author/avatar/content 插槽、上游废弃兼容契约
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmComment from '../src/Comment.vue'

describe('TmComment', () => {
  it('author / actions props 透传', () => {
    const wrapper = mount(TmComment, { props: { author: '张三', actions: [] } })
    const inner = wrapper.findComponent({ name: 'AComment' })
    expect(inner.exists()).toBe(true)
    expect(inner.props('author')).toBe('张三')
  })

  it('avatar / content / datetime 插槽透传', () => {
    const wrapper = mount(TmComment, {
      slots: {
        avatar: '<span class="cm-avatar">头像</span>',
        content: '<p class="cm-content">评论内容</p>',
        datetime: '<span class="cm-time">刚刚</span>',
      },
    })
    expect(wrapper.find('.cm-avatar').exists()).toBe(true)
    expect(wrapper.find('.cm-content').text()).toBe('评论内容')
    expect(wrapper.find('.cm-time').exists()).toBe(true)
  })

  it('渲染评论结构', () => {
    const wrapper = mount(TmComment, {
      props: { author: '李四' },
      slots: { content: '<p>内容</p>' },
    })
    expect(wrapper.find('.ant-comment').exists()).toBe(true)
    expect(wrapper.find('.ant-comment-content').exists()).toBe(true)
  })
})
