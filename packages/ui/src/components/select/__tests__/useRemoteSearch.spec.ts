// packages/ui/src/components/select/__tests__/useRemoteSearch.spec.ts
// useRemoteSearch 专项单测（审查 P1 测试盲区收口）：
// 1. 防抖窗口内连续输入只发一次请求
// 2. 乱序响应被 token 丢弃（A 先发、A 后到 → 旧结果不覆盖新结果）
// 3. minLength 门槛：不足不请求、清空搜索选项
// 4. 卸载时清理防抖定时器（不触发已取消回调）
// 5. 未配置 remote 时 no-op
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { defineComponent, h, onMounted } from 'vue'
import { mount } from '@vue/test-utils'
import { useRemoteSearch } from '../src/composables/useRemoteSearch'
import type { TmSelectOption } from '../src/props'

/** 受控延迟的 remote 函数：手动 resolve，模拟乱序响应 */
function createDeferredRemote() {
  const pending: Array<{
    query: string
    resolve: (opts: TmSelectOption[]) => void
  }> = []
  const remote = vi.fn((query: string) => {
    return new Promise<TmSelectOption[]>((resolve) => {
      pending.push({ query, resolve })
    })
  })
  return { remote, pending }
}

/**
 * flush 全部微任务：async 函数（runFetch 的 await 链）需要多轮微任务才能落地，
 * fake timers 下 nextTick() 单轮不够，统一用多轮 Promise.resolve。
 */
async function flushPromises(): Promise<void> {
  for (let i = 0; i < 10; i++) {
    await Promise.resolve()
  }
}

describe('useRemoteSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('防抖窗口内连续输入只发一次请求（合并为最后一次输入）', async () => {
    const { remote, pending } = createDeferredRemote()
    const composable = useRemoteSearch(() => remote, { debounce: 50, minLength: 1 })

    composable.search('a')
    composable.search('ab')
    composable.search('abc')
    await vi.advanceTimersByTimeAsync(100)

    // 防抖合并：只发出最后一次请求
    expect(remote).toHaveBeenCalledTimes(1)
    expect(remote).toHaveBeenCalledWith('abc')
    expect(pending.length).toBe(1)

    // 响应后 options 更新
    pending[0].resolve([{ label: 'abc-opt', value: 'abc' }])
    await flushPromises()
    expect(composable.options.value).toEqual([{ label: 'abc-opt', value: 'abc' }])
  })

  it('乱序响应被 token 丢弃：旧请求后到不覆盖新结果', async () => {
    const { remote, pending } = createDeferredRemote()
    const composable = useRemoteSearch(() => remote, { debounce: 0, minLength: 1 })

    // 两次无防抖请求：第一次先发（慢响应），第二次后发（快响应）
    void composable.search('first')
    void composable.search('second')
    expect(remote).toHaveBeenCalledTimes(2)

    // 第二次（新 token）先返回
    pending[1].resolve([{ label: 'second-opt', value: 'second' }])
    await flushPromises()
    expect(composable.options.value).toEqual([{ label: 'second-opt', value: 'second' }])

    // 第一次（旧 token）后返回：应被丢弃，不覆盖
    pending[0].resolve([{ label: 'first-opt', value: 'first' }])
    await flushPromises()
    expect(composable.options.value).toEqual([{ label: 'second-opt', value: 'second' }])

    // loading 只由最新请求的 finally 复位
    expect(composable.loading.value).toBe(false)
  })

  it('minLength 门槛：不足不请求，且清空搜索选项', async () => {
    const { remote, pending } = createDeferredRemote()
    const composable = useRemoteSearch(() => remote, { debounce: 0, minLength: 2 })

    composable.search('a') // 不足 2
    expect(remote).not.toHaveBeenCalled()
    expect(composable.options.value).toEqual([])

    composable.search('ab') // 达标
    expect(remote).toHaveBeenCalledTimes(1)
    pending[0].resolve([{ label: 'ab-opt', value: 'ab' }])
    await flushPromises()
    expect(composable.options.value).toEqual([{ label: 'ab-opt', value: 'ab' }])

    // 输入回退到不足：清空搜索选项（渲染层据此回到常驻列表）
    composable.search('a')
    expect(composable.options.value).toEqual([])
  })

  it('卸载时清理防抖定时器：销毁后不触发请求回调', async () => {
    const { remote } = createDeferredRemote()

    const Host = defineComponent({
      name: 'RemoteSearchUnmountHost',
      setup() {
        const composable = useRemoteSearch(() => remote, { debounce: 50, minLength: 1 })
        onMounted(() => {
          composable.search('abc')
        })
        return () => h('div')
      },
    })

    const wrapper = mount(Host)
    // 防抖窗口内卸载：timer 应被 onBeforeUnmount 清理
    wrapper.unmount()
    await vi.advanceTimersByTimeAsync(200)
    // 卸载后不应再触发 remote 调用
    expect(remote).not.toHaveBeenCalled()
  })

  it('未配置 remote 时 no-op：不请求、options/loading/currentQuery 均不受影响', async () => {
    const composable = useRemoteSearch(() => undefined, { debounce: 0, minLength: 1 })
    await composable.search('abc')
    expect(composable.options.value).toEqual([])
    expect(composable.loading.value).toBe(false)
    // 契约：未配置 remote 时 search 提前 return，不写入搜索词（无远程搜索语义）
    expect(composable.currentQuery.value).toBe('')
  })

  it('currentQuery 即时同步（不经防抖），供渲染层判定搜索激活', async () => {
    const { remote } = createDeferredRemote()
    const composable = useRemoteSearch(() => remote, { debounce: 50, minLength: 1 })

    composable.search('a')
    // 防抖窗口内 currentQuery 已更新（不等待防抖）
    expect(composable.currentQuery.value).toBe('a')
  })
})
