// packages/ui/src/components/select/__tests__/Select.spec.ts
// TmSelect 范本组件单测：验证薄封装 + remote 远程搜索扩展
// 覆盖核心机制：
// 1. props/类型透传：原生 ant options 真实下发到内部 ASelect
// 2. 公司默认值：showSearch / allowClear 真实下发；filterOption 按 remote 模式自适应
// 3. v-model 桥接：业务 modelValue ↔ ant value 双向同步（两侧都断言）
// 4. 方法透传：useForwardRef 暴露 focus，真实调用内部 ASelect.focus（非 typeof 空断言）
// 5. 扩展属性剥离：remote / modelValue / value 不下发到内部 ant Select
// 6. remote 远程搜索：触发 @search 调用 remote 填充 options 并复位 loading
// 7. onSearch 回调透传：通知事件不剥离（回归剥离边界判据）
// 8. $attrs + slots 全透传
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TmSelect from '../src/Select.vue'

/**
 * 等待微任务 + Vue 重新渲染。
 * 用于 async 远程搜索触发后，等待 Promise 解析与响应式更新完成再断言最终状态。
 */
const flush = async (): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, 0))
  await nextTick()
}

describe('TmSelect', () => {
  it('透传 ant 原生 options 到内部 ASelect', () => {
    const opts = [{ label: '苹果', value: 'apple' }]
    const wrapper = mount(TmSelect, { props: { options: opts } })
    const inner = wrapper.findComponent({ name: 'ASelect' })
    expect(inner.exists()).toBe(true)
    // 真实断言：内部 ASelect 收到了 options 数组（非空断言）
    expect(inner.props('options')).toEqual(opts)
  })

  it('公司默认 showSearch=true / allowClear=true 真实下发到内部 ant Select', () => {
    const wrapper = mount(TmSelect)
    const inner = wrapper.findComponent({ name: 'ASelect' })
    expect(inner.props('showSearch')).toBe(true)
    expect(inner.props('allowClear')).toBe(true)
  })

  it('filterOption 自适应：本地模式默认 true / 远程模式默认 false（业务显式覆盖始终生效）', () => {
    // 本地模式默认启用 ant 内置过滤（输入即过滤选项）
    const local = mount(TmSelect)
    expect(local.findComponent({ name: 'ASelect' }).props('filterOption')).toBe(true)

    // 远程模式默认禁用本地过滤（由业务/服务端负责过滤）
    const remote = mount(TmSelect, {
      props: { remote: vi.fn().mockResolvedValue([]) },
    })
    expect(remote.findComponent({ name: 'ASelect' }).props('filterOption')).toBe(false)

    // 业务显式传入始终覆盖默认（即便处于远程模式也尊重业务设置）
    const override = mount(TmSelect, {
      props: { filterOption: true, remote: vi.fn().mockResolvedValue([]) },
    })
    expect(override.findComponent({ name: 'ASelect' }).props('filterOption')).toBe(true)
  })

  it('v-model：内部 ASelect 触发 update:value 同步到业务 update:modelValue（child→parent）', async () => {
    const wrapper = mount(TmSelect, { props: { modelValue: '' } })
    const inner = wrapper.findComponent({ name: 'ASelect' })
    // 模拟 ant Select 选中某项后 emit update:value（真实事件流）
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'update:value',
      'apple',
    )
    await nextTick()
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('apple')
  })

  it('v-model：父组件更新 modelValue 同步到内部 ASelect.value（parent→child，真双向）', async () => {
    const wrapper = mount(TmSelect, { props: { modelValue: '' } })
    expect(wrapper.findComponent({ name: 'ASelect' }).props('value')).toBe('')
    await wrapper.setProps({ modelValue: 'apple' })
    expect(wrapper.findComponent({ name: 'ASelect' }).props('value')).toBe('apple')
  })

  it('扩展属性剥离：remote / modelValue 不下发到内部 ant Select，value 经桥接收到', () => {
    const wrapper = mount(TmSelect, {
      props: {
        modelValue: 'abc',
        options: [{ label: 'A', value: 'a' }],
        remote: vi.fn().mockResolvedValue([]),
      },
    })
    const inner = wrapper.findComponent({ name: 'ASelect' })
    // ant Select 不识别 modelValue / remote，应始终为 undefined（剥离成功）
    expect(inner.props('modelValue')).toBeUndefined()
    expect(inner.props('remote')).toBeUndefined()
    // value 经 v-model:value 桥接收到业务 modelValue
    expect(inner.props('value')).toBe('abc')
  })

  it('remote 远程搜索：触发 @search 调用 remote、填充 options 并复位 loading', async () => {
    const remote = vi.fn().mockResolvedValue([{ label: '苹果', value: 'apple' }])
    const wrapper = mount(TmSelect, { props: { remote } })
    const inner = wrapper.findComponent({ name: 'ASelect' })
    // 初始：远程未取数，options 为空
    expect(inner.props('options')).toEqual([])

    // 模拟用户输入触发 ant Select 的 search 事件（真实 UX 链路）
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      '苹',
    )
    // 同步阶段：remote 已被调用且参数为 query（取数链路打通）
    expect(remote).toHaveBeenCalledWith('苹')

    await flush()
    // 异步完成后：options 被填充、loading 复位为 false
    expect(inner.props('options')).toEqual([{ label: '苹果', value: 'apple' }])
    expect(inner.props('loading')).toBe(false)
  })

  it('remote 未配置时触发 @search 不调用 remote、不影响业务 options', async () => {
    const remote = vi.fn().mockResolvedValue([])
    const wrapper = mount(TmSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    const inner = wrapper.findComponent({ name: 'ASelect' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      'x',
    )
    await flush()
    // 未配置 remote：search 不触发取数，业务 options 原样保留
    expect(remote).not.toHaveBeenCalled()
    expect(inner.props('options')).toEqual([{ label: 'A', value: 'a' }])
  })

  it('loading 合并：业务传入 loading 在非远程模式下保留透传', () => {
    // 非 remote 模式下 loading 完全由业务控制（useRemoteSearch 不会介入）
    const wrapper = mount(TmSelect, { props: { loading: true } })
    expect(wrapper.findComponent({ name: 'ASelect' }).props('loading')).toBe(true)
  })

  it('onSearch 回调真实透传：业务监听 @search 能到达内部 ASelect 并被实际调用', async () => {
    // 回归剥离边界判据：onSearch 属「通知事件」，与 v-model:value 不冲突，
    // 必须保留透传，否则业务回调永远到不了内部 ASelect（静默失败无报错）
    const searchSpy = vi.fn()
    const wrapper = mount(TmSelect, {
      props: { onSearch: searchSpy as unknown as (v: string) => void },
    })
    const inner = wrapper.findComponent({ name: 'ASelect' })
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      'k',
    )
    await nextTick()
    // 真实行为断言：业务监听器被实际调用（非 typeof 空断言）
    expect(searchSpy).toHaveBeenCalledWith('k')
  })

  it('方法透传：focus() 经 useForwardRef 真实聚焦内部 Select 搜索 input', async () => {
    // attachTo:document.body 让 jsdom 能更新 document.activeElement
    // 真实行为断言：经 Proxy 透传，内部 ASelect.focus 真实聚焦了搜索 input（非 typeof 空断言）
    const wrapper = mount(TmSelect, { attachTo: document.body })
    try {
      const searchInput = wrapper.find('input.ant-select-selection-search-input').element
      expect(document.activeElement).not.toBe(searchInput)
      await (wrapper.vm as unknown as { focus: () => void }).focus()
      expect(document.activeElement).toBe(searchInput)
    } finally {
      wrapper.unmount()
    }
  })

  it('透传 $attrs 到根元素（data-testid）', () => {
    const wrapper = mount(TmSelect, { attrs: { 'data-testid': 'my-select' } })
    expect(wrapper.find('[data-testid="my-select"]').exists()).toBe(true)
  })

  it('插槽透传：placeholder 转发到内部 ant Select（空值时渲染于选择器内）', () => {
    // ant Select 的 placeholder 等具名插槽需动态透传；空值 + 关闭状态下渲染于选择器内
    const wrapper = mount(TmSelect, {
      slots: { placeholder: '请选择水果' },
    })
    expect(wrapper.text()).toContain('请选择水果')
  })
})
