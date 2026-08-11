// packages/ui/src/components/table/__tests__/usePagination.spec.ts
// usePagination 独立单测：分页状态 + 远程拉数 / 静态切片双模式驱动
// 不依赖 vxe / ant 渲染，可充分验证真实取数链路。
//
// 覆盖核心机制：
// 1. 远程模式：fetchData 首页参数 / data/total 写入 / loading 翻转
// 2. onChange（ant Pagination change）：翻页 / 切页大小触发 fetch
// 3. 未配置 request 时 fetchData no-op
// 4. query 透传 + 翻页携带 lastQuery
// 5. 竞态防护（race condition）：乱序响应被 token 守卫丢弃
// 6. 静态模式：本地切片 / total=data.length / 翻页切页不请求 / 不足一页
// 7. resetToFirst 页码重置
import { describe, it, expect, vi } from 'vitest'
import { ref } from 'vue'
import { usePagination } from '../src/composables/usePagination'
import type { TmTableResult } from '../src/props'

/**
 * 等待微任务队列：fetchData 内 await request 完成后再断言最终状态
 */
const flush = (): Promise<void> => new Promise((resolve) => setTimeout(resolve, 0))

describe('usePagination（远程模式）', () => {
  it('fetchData 首页调用 request 用 currentPage=1, pageSize=10', async () => {
    const request = vi.fn().mockResolvedValue({ data: [{ id: 1 }], total: 1 } as TmTableResult)
    const { fetchData } = usePagination({ getRequest: () => request })
    await fetchData()
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
    const { data, total, fetchData } = usePagination({ getRequest: () => request })
    await fetchData()
    expect(data.value).toEqual([{ id: 7 }])
    expect(total.value).toBe(99)
  })

  it('loading 在请求期间翻转、完成复位', async () => {
    let resolveReq!: (v: TmTableResult) => void
    const request = vi
      .fn()
      .mockReturnValue(new Promise<TmTableResult>((r) => (resolveReq = r)))
    const { loading, fetchData } = usePagination({ getRequest: () => request })
    const pending = fetchData()
    expect(loading.value).toBe(true)
    resolveReq({ data: [], total: 0 })
    await pending
    expect(loading.value).toBe(false)
  })

  it('onChange 翻页更新页码并触发 fetch（request 收到新页码参数）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 } as TmTableResult)
    const { onChange } = usePagination({ getRequest: () => request })
    await onChange(3, 20)
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ currentPage: 3, pageSize: 20 }),
    )
  })

  it('onChange 切换页大小触发 fetch 且页码更新', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 100 } as TmTableResult)
    const { page, onChange } = usePagination({ getRequest: () => request })
    await onChange(1, 20)
    expect(page.pageSize).toBe(20)
    expect(page.currentPage).toBe(1)
    expect(request).toHaveBeenLastCalledWith(
      expect.objectContaining({ currentPage: 1, pageSize: 20 }),
    )
  })

  it('未配置 request 时 fetchData 为 no-op（不影响 data/total/loading）', async () => {
    const { data, total, loading, fetchData } = usePagination({ getRequest: () => undefined })
    await fetchData()
    expect(data.value).toEqual([])
    expect(total.value).toBe(0)
    expect(loading.value).toBe(false)
  })

  it('query 参数透传到 request', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 } as TmTableResult)
    const { fetchData } = usePagination({ getRequest: () => request })
    await fetchData({ keyword: 'tom' })
    expect(request).toHaveBeenCalledWith({
      currentPage: 1,
      pageSize: 10,
      query: { keyword: 'tom' },
    })
  })

  it('翻页自动携带上次查询条件（lastQuery）', async () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 50 } as TmTableResult)
    const { fetchData, onChange } = usePagination({ getRequest: () => request })
    await fetchData({ keyword: 'tom' })
    await onChange(2, 10)
    // 翻页后 request 仍携带 query，页码更新
    expect(request).toHaveBeenLastCalledWith({
      currentPage: 2,
      pageSize: 10,
      query: { keyword: 'tom' },
    })
  })

  it('竞态防护：乱序响应被丢弃（B 先到、A 后到 → 仅 B 的结果落定）', async () => {
    let resolveA!: (v: TmTableResult) => void
    let resolveB!: (v: TmTableResult) => void
    const request = vi
      .fn()
      .mockReturnValueOnce(new Promise<TmTableResult>((r) => (resolveA = r)))
      .mockReturnValueOnce(new Promise<TmTableResult>((r) => (resolveB = r)))
    const { data, fetchData } = usePagination({ getRequest: () => request })

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

    expect(data.value).toEqual([{ id: 'B' }])
  })

  it('resetToFirst 把页码重置为 1', async () => {
    const { page, onChange, resetToFirst } = usePagination({ getRequest: () => undefined })
    await onChange(4, 10)
    expect(page.currentPage).toBe(4)
    resetToFirst()
    expect(page.currentPage).toBe(1)
  })
})

describe('usePagination（静态模式）', () => {
  it('data 为当前页本地切片，total 等于数据长度', () => {
    const staticData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const { data, total, loading } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData,
    })
    expect(data.value).toHaveLength(10)
    expect(data.value[0]).toEqual({ id: 1 })
    expect(data.value[9]).toEqual({ id: 10 })
    expect(total.value).toBe(25)
    expect(loading.value).toBe(false)
  })

  it('onChange 翻页切换切片且不发起请求', async () => {
    const staticData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const { data, onChange } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData,
    })
    await onChange(3, 10)
    expect(data.value).toHaveLength(5)
    expect(data.value[0]).toEqual({ id: 21 })
    expect(data.value[4]).toEqual({ id: 25 })
  })

  it('onChange 切换页大小后切片按新页大小', async () => {
    const staticData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const { data, total, onChange } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData,
    })
    await onChange(1, 20)
    expect(data.value).toHaveLength(20)
    expect(total.value).toBe(25)
  })

  it('数据不足单页容量时渲染全部', () => {
    const staticData = [{ id: 1 }, { id: 2 }, { id: 3 }]
    const { data, total } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData,
    })
    expect(data.value).toHaveLength(3)
    expect(total.value).toBe(3)
  })

  it('静态数据变化时切片自动响应', () => {
    // getter 读取 ref.value 建立响应式依赖，ref 重新赋值后 computed 自动重算
    const staticData = ref([{ id: 1 }, { id: 2 }, { id: 3 }])
    const { data, total } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData.value,
    })
    expect(total.value).toBe(3)
    staticData.value = [...staticData.value, { id: 4 }]
    expect(total.value).toBe(4)
    expect(data.value).toHaveLength(4)
  })

  it('getEnabled=false 时静态数据全量渲染、不按页切片', () => {
    const staticData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const { data, total, loading } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData,
      getEnabled: () => false,
    })
    expect(data.value).toHaveLength(25)
    expect(data.value[24]).toEqual({ id: 25 })
    expect(total.value).toBe(25)
    expect(loading.value).toBe(false)
  })

  it('getEnabled=false 时翻页操作不改变渲染数据（仍为全量）', () => {
    const staticData = Array.from({ length: 25 }, (_, i) => ({ id: i + 1 }))
    const { data, onChange } = usePagination({
      getRequest: () => undefined,
      getStaticData: () => staticData,
      getEnabled: () => false,
    })
    void onChange(3, 10)
    expect(data.value).toHaveLength(25)
    expect(data.value[0]).toEqual({ id: 1 })
  })
})
