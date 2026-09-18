// packages/ui/src/components/upload-dragger/__tests__/UploadDragger.spec.ts
// TmUploadDragger 单测：拖拽区渲染、v-model:fileList 契约、beforeUpload 透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TmUploadDragger from '../src/UploadDragger.vue'

describe('TmUploadDragger', () => {
  it('渲染为拖拽上传区（ant dragger 类名）并展示插槽提示内容', () => {
    const wrapper = mount(TmUploadDragger, { slots: { default: '点击或拖拽上传' } })
    expect(wrapper.find('.ant-upload-drag').exists()).toBe(true)
    expect(wrapper.text()).toContain('点击或拖拽上传')
  })

  it('v-model:file-list：ant 更新 fileList 经转发回写父组件', async () => {
    const wrapper = mount(TmUploadDragger, { props: { fileList: [] } })
    const inner = wrapper.findComponent({ name: 'AUploadDragger' })
    const newList = [{ uid: '1', name: 'a.png', status: 'done' }]
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'update:fileList',
      newList,
    )
    await nextTick()
    expect(wrapper.emitted('update:fileList')?.[0]?.[0]).toEqual(newList)
  })

  it('公司默认 showUploadList=true 下发（复合类型幻影 false 回归锁）', () => {
    const inner = mount(TmUploadDragger).findComponent({ name: 'AUploadDragger' })
    expect(inner.props('showUploadList')).toBe(true)
  })

  it('beforeUpload / accept / multiple 经 $attrs 显式透传', () => {
    const beforeUpload = vi.fn()
    const wrapper = mount(TmUploadDragger, {
      attrs: { beforeUpload, accept: '.png', multiple: true },
    })
    const inner = wrapper.findComponent({ name: 'AUploadDragger' })
    expect(inner.props('beforeUpload')).toBe(beforeUpload)
    expect(inner.props('accept')).toBe('.png')
    expect(inner.props('multiple')).toBe(true)
  })
})
