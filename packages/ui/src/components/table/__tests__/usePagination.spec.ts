// packages/ui/src/components/table/__tests__/usePagination.spec.ts
// usePagination 独立单测：分页状态 + 远程拉数驱动
// 不依赖 vxe 渲染，可充分验证真实取数链路（按 brief Bug 7 策略）。
//
// 覆盖核心机制：
// 1. fetchData 首页参数（currentPage=1, pageSize=10）
// 2. data/total 写入
// 3. loading 翻转（请求中 true，完成复位）
// 4. onPageChange 翻页触发 fetch（页码更新 + request 再调）
// 5. 未配置 request 时 fetchData no-op
// 6. query 透传
// 7. 竞态防护（race condition）：乱序响应被 token 守卫丢弃（参照 Select useRemoteSearch 模式）
import { describe, it, expect, vi } from 'vitest'
import { usePagination } from '../src/composables/usePagination'
import type { TmTableResult } from '../src/props'

/**
 * 等待微任务队列：fetchData 内 await request 完成后再断言最终状态
 */
const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0))

describe('usePagination', () => {
  it('fetchData 首页调用 request 用 currentPage=1, pageSize=10', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: 1 }], total: 1 } as TmTableResult)
    const { fetchData } = usePagination(() => request)
    await fetchData()
    // 锁定首页默认分页参数（与 vxe pager 默认 pageSize=10 对齐）
    expect(request).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: undefined,
    })
  })

  it('fetchData 成功写入 data / total', async () => {
    const request = vi
      .fn()
      .mockResolvedValue({ data: [{ id: 7 }], total: 99 } as TmTableResult)
    const { data, total, fetchData } = usePagination(() => request)
    await fetchData()
    expect(data.value).toEqual([{ id: 7 }])
    expect(total.value).toBe(99)
  })

  it('loading 在请求期间翻转、完成复位', async () => {
    let resolveReq!: (v: TmTableResult) => void
    const request = vi
      .fn()
      .mockReturnValue(new Promise<TmTableResult>((r) => (resolveReq = r)))
    const { loading, fetchData } = usePagination(() => request)
    const pending = fetchData()
    // 请求中：loading=true
    expect(loading.value).toBe(true)
    resolveReq({ data: [], total: 0 })
    await pending
    // 完成：loading=false
    expect(loading.value).toBe(false)
  })

  it('onPageChange 更新页码并触发 fetch（request 收到新页码参数）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 } as TmTableResult)
    const { onPageChange } = usePagination(() => request)
    await onPageChange({ currentPage: 3, pageSize: 20 })
    // 翻页后 request 收到新页码（page 内部已更新）
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ currentPage: 3, pageSize: 20 }),
    )
  })

  it('未配置 request 时 fetchData 为 no-op（不影响 data/total/loading）', async () => {
    const { data, total, loading, fetchData } = usePagination(() => undefined)
    await fetchData()
    expect(data.value).toEqual([])
    expect(total.value).toBe(0)
    expect(loading.value).toBe(false)
  })

  it('query 参数透传到 request', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 } as TmTableResult)
    const { fetchData } = usePagination(() => request)
    await fetchData({ keyword: 'tom' })
    expect(request).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: { keyword: 'tom' },
    })
  })

  it('竞态防护：乱序响应被丢弃（B 先到、A 后到 → 仅 B 的结果落定）', async () => {
    // 锁定 usePagination 的 token 守卫：每次 fetchData 自增 lastToken，
    // 仅 token === lastToken（最新请求）的结果才写入 data/total/loading。
    // 防止用户快速翻页时旧响应覆盖新响应（A 先发、A 后到 → 旧结果污染）。
    let resolveA!: (v: TmTableResult) => void
    let resolveB!: (v: TmTableResult) => void
    const request = vi
      .fn()
      .mockReturnValueOnce(new Promise<TmTableResult>((r) => (resolveA = r)))
      .mockReturnValueOnce(new Promise<TmTableResult>((r) => (resolveB = r)))
    const { data, fetchData } = usePagination(() => request)

    // 并发两次 fetchData：A 先发（tokenA），B 立即跟上（tokenB，A 作废）
    const pendingA = fetchData()
    const pendingB = fetchData()
    expect(request).toHaveBeenCalledTimes(2)

    // B 先 resolve（tokenB === lastToken）：写入 B 的结果
    resolveB({ data: [{ id: 'B' }], total: 2 })
    await pendingB
    // A 后 resolve（tokenA !== lastToken）：乱序响应被丢弃
    resolveA({ data: [{ id: 'A' }], total: 1 })
    await pendingA
    await flush()

    // data 仍是 B 的结果，未被 A 覆盖
    expect(data.value).toEqual([{ id: 'B' }])
  })
})
