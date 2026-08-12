// packages/ui/src/components/upload/__tests__/Upload.spec.ts
// TmUpload 单测：showUploadList 默认兜底、fileList 受控透传、beforeUpload 透传、update:fileList 事件转发、插槽透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { defineComponent, ref } from 'vue'
import { Upload as AUpload } from 'ant-design-vue'
import TmUpload from '../src/Upload.vue'
import type { UploadFile } from 'ant-design-vue/es/upload'

describe('TmUpload', () => {
  it('showUploadList 默认 true（复合类型陷阱兜底，文件列表默认展示）', () => {
    const wrapper = mount(TmUpload, { slots: { default: '<button>上传</button>' } })
    expect(wrapper.findComponent({ name: 'AUpload' }).props('showUploadList')).toBe(true)
  })

  it('fileList 受控透传到内部 ant Upload', () => {
    const fileList = [{ uid: '1', name: 'a.png', status: 'done' as const }]
    const wrapper = mount(TmUpload, { props: { fileList }, slots: { default: '<button>上传</button>' } })
    expect(wrapper.findComponent({ name: 'AUpload' }).props('fileList')).toEqual(fileList)
  })

  it('beforeUpload 校验函数透传到内部 ant Upload', () => {
    const beforeUpload = vi.fn(() => true)
    const wrapper = mount(TmUpload, {
      props: { beforeUpload },
      slots: { default: '<button>上传</button>' },
    })
    expect(wrapper.findComponent({ name: 'AUpload' }).props('beforeUpload')).toBe(beforeUpload)
  })

  it('update:fileList 事件转发（v-model:file-list 双向链路）', () => {
    const wrapper = mount(TmUpload, {
      props: { fileList: [] },
      slots: { default: '<button>上传</button>' },
    })
    const inner = wrapper.findComponent({ name: 'AUpload' })
    const nextList = [{ uid: '2', name: 'b.png' }]
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'update:fileList',
      nextList,
    )
    expect(wrapper.emitted('update:fileList')?.[0]?.[0]).toEqual(nextList)
  })

  it('ant 原生透传：action / multiple / accept', () => {
    const wrapper = mount(TmUpload, {
      props: { action: '/api/upload', multiple: true, accept: '.png,.jpg' },
      slots: { default: '<button>上传</button>' },
    })
    const inner = wrapper.findComponent({ name: 'AUpload' })
    expect(inner.props('action')).toBe('/api/upload')
    expect(inner.props('multiple')).toBe(true)
    expect(inner.props('accept')).toBe('.png,.jpg')
  })

  it('插槽透传：default（触发元素）转发到内部 ant Upload', () => {
    const wrapper = mount(TmUpload, {
      slots: { default: '<button class="upload-trigger">上传</button>' },
    })
    expect(wrapper.find('.upload-trigger').exists()).toBe(true)
  })

  it('openFileDialogOnClick 不向内部透传幻影 false（Boolean 陷阱兜底：触发区可点击）', () => {
    const wrapper = mount(TmUpload, { slots: { default: '<button>上传</button>' } })
    // 业务未传时，内部 ant Upload 不应收到被强转的 false（否则 rc-upload 的 onClick 变空操作）
    expect(wrapper.findComponent({ name: 'AUpload' }).props('openFileDialogOnClick')).toBeUndefined()
  })

  it('点击触发区会触发 file input 的 click（打开文件选择框）', async () => {
    const wrapper = mount(TmUpload, {
      props: { action: '/api/upload' },
      slots: { default: '<button id="trigger">上传</button>' },
    })
    const input = wrapper.find('input[type="file"]')
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click')
    await wrapper.find('.ant-upload[role="button"]').trigger('click')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('点击内部按钮（默认插槽）事件冒泡触发 file input 的 click', async () => {
    const wrapper = mount(TmUpload, {
      props: { action: '/api/upload' },
      slots: { default: '<button id="trigger">上传</button>' },
    })
    const input = wrapper.find('input[type="file"]')
    const clickSpy = vi.spyOn(input.element as HTMLInputElement, 'click')
    await wrapper.find('#trigger').trigger('click')
    expect(clickSpy).toHaveBeenCalled()
  })

  it('onUpdate:fileList 不透传为数组监听器（模板 @ 绑定唯一通道，避免 ant 崩溃）', () => {
    // v-model:file-list 时父组件监听器进 $attrs，若同时被 forwardBindings 透传
    // 会与模板 @update:file-list 合并成数组 → ant onInternalChange 调 .call 崩溃
    const list = ref<UploadFile[]>([])
    const Wrapper = defineComponent({
      components: { TmUpload },
      setup() {
        return { list }
      },
      template: '<TmUpload v-model:file-list="list" action="/api/upload" />',
    })
    const wrapper = mount(Wrapper)
    const inner = wrapper.findComponent({ name: 'AUpload' })
    expect(Array.isArray(inner.props('onUpdate:fileList'))).toBe(false)
  })

  it('选中文件后 v-model:file-list 正常同步列表（不崩溃）', async () => {
    const list = ref<UploadFile[]>([])
    const Wrapper = defineComponent({
      components: { TmUpload },
      setup() {
        return { list }
      },
      template: '<TmUpload v-model:file-list="list" action="/api/upload" />',
    })
    const wrapper = mount(Wrapper)
    const input = wrapper.find('input[type="file"]')
    const file = new File(['hello'], 'a.txt', { type: 'text/plain' })
    Object.defineProperty(input.element, 'files', { value: [file], configurable: true })
    await input.trigger('change')
    // 等待 ant 异步上传链（processFile → onBatchStart → onInternalChange）完成后断言
    await new Promise((r) => setTimeout(r, 20))
    expect(list.value.length).toBe(1)
  })

  it('beforeUpload 返回 LIST_IGNORE：拦截超大文件（不进列表、不发请求）', async () => {
    // ant 语义：仅 `return false` 只拦 POST，文件仍会以无状态条目进列表；
    // 必须返回 LIST_IGNORE 哨兵（Upload.LIST_IGNORE）才同时不进列表不发请求。
    const sendSpy = vi.spyOn(XMLHttpRequest.prototype, 'send')
    const list = ref<UploadFile[]>([])
    const Wrapper = defineComponent({
      components: { TmUpload },
      setup() {
        const beforeUpload = (f: UploadFile): boolean | string =>
          f.size && f.size > 1024 * 1024 ? AUpload.LIST_IGNORE : true
        return { list, beforeUpload }
      },
      template: '<TmUpload v-model:file-list="list" :before-upload="beforeUpload" action="/api/upload" />',
    })
    const wrapper = mount(Wrapper)
    const input = wrapper.find('input[type="file"]')
    const big = new File([new ArrayBuffer(1024 * 1024 + 1)], 'big.bin', {
      type: 'application/octet-stream',
    })
    Object.defineProperty(input.element, 'files', { value: [big], configurable: true })
    await input.trigger('change')
    await new Promise((r) => setTimeout(r, 50))
    expect(list.value.length).toBe(0)
    expect(sendSpy).not.toHaveBeenCalled()
  })
})
