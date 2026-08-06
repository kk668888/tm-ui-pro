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
// 9. 竞态防护（race condition）：快速连续输入下乱序响应被 token 守卫丢弃（锁定最复杂并发逻辑）
// 10. loading 合并（remote）：业务 loading 与远程 loading 合并保留，远程完成不被覆盖
// 11. filterOption edge case：options + remote 同存时默认 false（服务端过滤模式锁定）
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import TmSelect from '../src/Select.vue'
import type { TmSelectOption } from '../src/props'

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

  it('filterOption edge case：业务同时传 options + remote 时默认 false（服务端过滤模式）', () => {
    // 锁定 Select.vue 的 filterOption 自适应：props.filterOption ?? (props.remote ? false : true)
    // 业务同时配置 options 与 remote 时，mergedOptions 走 remoteOptions 分支（远程优先），
    // filterOption 默认 false——避免本地 ant 内置过滤与服务端过滤逻辑冲突。
    const wrapper = mount(TmSelect, {
      props: {
        options: [{ label: '本地兜底', value: 'local' }],
        remote: vi.fn().mockResolvedValue([]),
      },
    })
    expect(wrapper.findComponent({ name: 'ASelect' }).props('filterOption')).toBe(false)
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

  it('竞态防护（race condition）：快速连续输入下旧响应晚到被丢弃，新 token 结果最终落定', async () => {
    // 本测锁定 useRemoteSearch 的 token 守卫（packages/ui/src/components/select/src/composables/useRemoteSearch.ts）：
    // 每次 search 自增 lastToken，仅 token === lastToken（最新请求）的写入与 loading 复位才生效，
    // 避免用户快速连续输入时旧响应覆盖新响应（A 先发、A 后到 → 旧结果污染）。
    //
    // 设计：用可控 promise 手动决定 resolve 顺序，模拟「B 先到、A 后到」的乱序场景。
    let resolveA!: (v: TmSelectOption[]) => void
    let resolveB!: (v: TmSelectOption[]) => void
    const promiseA = new Promise<TmSelectOption[]>((r) => (resolveA = r))
    const promiseB = new Promise<TmSelectOption[]>((r) => (resolveB = r))
    // remote 第 1 次（query='A'）→ promiseA；第 2 次（query='B'）→ promiseB
    const remote = vi
      .fn()
      .mockReturnValueOnce(promiseA)
      .mockReturnValueOnce(promiseB)

    const wrapper = mount(TmSelect, { props: { remote } })
    const inner = wrapper.findComponent({ name: 'ASelect' })

    // 1) 并发触发两次 search：A 先发得到 tokenA，B 立即跟上使 lastToken 自增到 tokenB（A 作废）
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      'A',
    )
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      'B',
    )

    // 同步阶段：两次 remote 都已发起，参数与 query 一一对应（取数链路按序打通）
    expect(remote).toHaveBeenCalledTimes(2)
    expect(remote).toHaveBeenNthCalledWith(1, 'A')
    expect(remote).toHaveBeenNthCalledWith(2, 'B')

    // 2) B 先 resolve（tokenB === lastToken）：写入 B 的结果，loading 复位为 false
    resolveB([{ label: '香蕉', value: 'banana' }])
    await flush()
    expect(inner.props('options')).toEqual([{ label: '香蕉', value: 'banana' }])
    expect(inner.props('loading')).toBe(false)

    // 3) A 后 resolve（tokenA !== lastToken）：乱序响应被丢弃
    //    - options 不被 A 覆盖（仍保持 B 的结果）
    //    - loading 不被过期请求的 finally 误清（守卫同时保护 loading 复位通道）
    resolveA([{ label: '苹果', value: 'apple' }])
    await flush()
    expect(inner.props('options')).toEqual([{ label: '香蕉', value: 'banana' }])
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

  it('loading 合并：业务 loading 与远程 loading 同时为 true 时合并保留（远程完成不被覆盖）', async () => {
    // 锁定 Select.vue 的 loading 合并逻辑：Boolean(props.loading) || loadingState.value
    // 业务侧通过 loading prop 显式置 true 时，即便远程请求 in flight / 完成，
    // 合并后始终为 true（业务 loading 不被远程 loading 复位覆盖）。
    let resolveRemote!: (v: TmSelectOption[]) => void
    const remote = vi
      .fn()
      .mockReturnValue(new Promise<TmSelectOption[]>((r) => (resolveRemote = r)))
    const wrapper = mount(TmSelect, { props: { remote, loading: true } })
    const inner = wrapper.findComponent({ name: 'ASelect' })

    // 业务 loading 单独已为 true（合并前基线）
    expect(inner.props('loading')).toBe(true)

    // 触发远程搜索：loadingState 翻 true，与业务 loading 合并后仍为 true
    ;(inner.vm as unknown as { $emit: (e: string, ...a: unknown[]) => void }).$emit(
      'search',
      'x',
    )
    await nextTick()
    expect(inner.props('loading')).toBe(true)

    // 远程完成：loadingState 复位 false，但业务 loading 仍 true → 合并后保持 true（不被覆盖）
    resolveRemote([{ label: 'X', value: 'x' }])
    await flush()
    expect(inner.props('loading')).toBe(true)
    expect(inner.props('options')).toEqual([{ label: 'X', value: 'x' }])
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
