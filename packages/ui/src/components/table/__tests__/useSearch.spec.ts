// packages/ui/src/components/table/__tests__/useSearch.spec.ts
// useSearch 独立单测：声明式 ant 搜索表单的查询/重置驱动
//
// 覆盖核心机制：
// 1. handleSearch 收集非空字段为 query 并触发 fetchData(query)
// 2. 空值剔除（'' / [] / null / undefined 不计入 query）
// 3. handleSearch 前页码重置 1（resetToFirst 被调用）
// 4. resetQuery 清空字段恢复默认值并 fetchData(undefined) 重拉
// 5. 未配置 config 时返回 no-op（不调用 fetchData）
import { describe, it, expect, vi } from 'vitest'
import { useSearch } from '../src/composables/useSearch'
import type { TmTableSearchConfig } from '../src/props'

/** 构造 useSearch 依赖：记录 fetchData / resetToFirst 调用 */
function setupOptions() {
  const fetchData = vi.fn().mockResolvedValue(undefined)
  const resetToFirst = vi.fn()
  return { fetchData, resetToFirst }
}

const config: TmTableSearchConfig = {
  fields: [
    { field: 'name', label: '姓名', type: 'input' },
    { field: 'status', label: '状态', type: 'select', options: [{ label: '启用', value: 1 }] },
    { field: 'range', label: '日期', type: 'date' },
  ],
}

describe('useSearch', () => {
  it('handleSearch 收集非空字段为 query 并触发 fetchData(query)', async () => {
    const { fetchData, resetToFirst } = setupOptions()
    const search = useSearch(config, { fetchData, resetToFirst })
    search.model['name'] = 'tom'
    search.model['status'] = 1
    await search.handleSearch()
    expect(fetchData).toHaveBeenCalledWith({ name: 'tom', status: 1 })
  })

  it('handleSearch 前把页码重置为 1', async () => {
    const { fetchData, resetToFirst } = setupOptions()
    const search = useSearch(config, { fetchData, resetToFirst })
    await search.handleSearch()
    expect(resetToFirst).toHaveBeenCalledTimes(1)
  })

  it('空值剔除：空串/空数组/null/undefined 不计入 query', async () => {
    const { fetchData, resetToFirst } = setupOptions()
    const search = useSearch(config, { fetchData, resetToFirst })
    search.model['name'] = ''
    search.model['status'] = undefined
    search.model['range'] = []
    await search.handleSearch()
    expect(fetchData).toHaveBeenCalledWith({})
  })

  it('resetQuery 清空字段恢复默认值并 fetchData(undefined) 重拉', async () => {
    const { fetchData, resetToFirst } = setupOptions()
    const search = useSearch(config, { fetchData, resetToFirst })
    search.model['name'] = 'tom'
    search.model['status'] = 1
    await search.resetQuery()
    expect(search.model['name']).toBe('')
    expect(search.model['status']).toBe('')
    expect(fetchData).toHaveBeenCalledWith(undefined)
    expect(resetToFirst).toHaveBeenCalledTimes(1)
  })

  it('字段默认值初始化到 model', () => {
    const { fetchData, resetToFirst } = setupOptions()
    const cfg: TmTableSearchConfig = {
      fields: [{ field: 'status', label: '状态', defaultValue: 1 }],
    }
    const search = useSearch(cfg, { fetchData, resetToFirst })
    expect(search.model['status']).toBe(1)
  })

  it('未配置 config 时返回 no-op（fields 空、handleSearch/resetQuery 不触发 fetchData）', async () => {
    const { fetchData, resetToFirst } = setupOptions()
    const search = useSearch(undefined, { fetchData, resetToFirst })
    expect(search.fields).toEqual([])
    await search.handleSearch()
    await search.resetQuery()
    expect(fetchData).not.toHaveBeenCalled()
    expect(resetToFirst).not.toHaveBeenCalled()
  })
})
