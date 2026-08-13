// packages/ui/src/components/timeline/__tests__/Timeline.spec.ts
// TmTimeline 单测：render function 转发 default slot（ant 能识别 TimelineItem 子项）、
// mode/reverse props 透传
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { TimelineItem } from 'ant-design-vue'
import TmTimeline from '../src/Timeline.vue'

// Host 组件：children 使用 ant 原生 TimelineItem（设计 Non-Goals：不注册 TmTimelineItem）
const Host = defineComponent({
  setup() {
    return () =>
      h(TmTimeline, null, {
        default: () => [
          h(TimelineItem, null, { default: () => '步骤 1' }),
          h(TimelineItem, null, { default: () => '步骤 2' }),
        ],
      })
  },
})

describe('TmTimeline', () => {
  it('render function 转发 default slot，ant 渲染 TimelineItem 子项', () => {
    const wrapper = mount(Host)
    const inner = wrapper.findComponent({ name: 'ATimeline' })
    expect(inner.exists()).toBe(true)
    // 时间轴条目渲染成功 = ant filterEmpty(slots.default()) 拿到真实 TimelineItem vnode
    expect(wrapper.findAll('.ant-timeline-item').length).toBe(2)
    expect(wrapper.text()).toContain('步骤 1')
    expect(wrapper.text()).toContain('步骤 2')
  })

  it('mode / reverse props 透传', () => {
    const wrapper = mount(TmTimeline, { props: { mode: 'left', reverse: true } })
    const inner = wrapper.findComponent({ name: 'ATimeline' })
    expect(inner.props('mode')).toBe('left')
    expect(inner.props('reverse')).toBe(true)
  })
})
