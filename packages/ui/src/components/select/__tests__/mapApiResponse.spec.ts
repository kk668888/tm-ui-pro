// packages/ui/src/components/select/__tests__/mapApiResponse.spec.ts
// mapApiResponse 纯函数单测：覆盖响应 → 选项映射的全部分支
// 1. 智能识别：顶层数组 / data[] / data.records[] / data.list[] / records[] / list[]
// 2. fieldNames 自定义字段名
// 3. resultMap 完全自定义（优先级最高）
// 4. 无法识别返回空数组
import { describe, it, expect, vi } from 'vitest'
import { mapApiResponse } from '../src/utils/mapApiResponse'

describe('mapApiResponse', () => {
  it('识别顶层数组并按默认字段映射', () => {
    const res = [{ label: '苹果', value: 'apple' }]
    expect(mapApiResponse(res, {})).toEqual([{ label: '苹果', value: 'apple' }])
  })

  it('识别 data 数组', () => {
    const res = { data: [{ label: 'A', value: 'a' }] }
    expect(mapApiResponse(res, {})).toEqual([{ label: 'A', value: 'a' }])
  })

  it('识别 data.records 数组（分页结构）', () => {
    const res = { data: { records: [{ label: 'R', value: 'r' }], total: 1 } }
    expect(mapApiResponse(res, {})).toEqual([{ label: 'R', value: 'r' }])
  })

  it('识别 data.list 数组（分页结构）', () => {
    const res = { data: { list: [{ label: 'L', value: 'l' }] } }
    expect(mapApiResponse(res, {})).toEqual([{ label: 'L', value: 'l' }])
  })

  it('识别顶层 records 数组', () => {
    const res = { records: [{ label: 'R2', value: 'r2' }] }
    expect(mapApiResponse(res, {})).toEqual([{ label: 'R2', value: 'r2' }])
  })

  it('识别顶层 list 数组', () => {
    const res = { list: [{ label: 'L2', value: 'l2' }] }
    expect(mapApiResponse(res, {})).toEqual([{ label: 'L2', value: 'l2' }])
  })

  it('fieldNames 自定义字段名', () => {
    const res = [{ name: '张三', id: 1 }]
    expect(mapApiResponse(res, { fieldNames: { label: 'name', value: 'id' } })).toEqual([
      { label: '张三', value: 1 },
    ])
  })

  it('resultMap 优先于 fieldNames 与智能识别', () => {
    const res = { biz: [{ n: 'X', v: 'x' }] }
    const resultMap = vi.fn((r: unknown) => {
      const arr = (r as { biz: { n: string; v: string }[] }).biz
      return arr.map((i) => ({ label: i.n, value: i.v }))
    })
    // 同时给 resultMap 和 fieldNames：resultMap 生效
    expect(
      mapApiResponse(res, {
        resultMap,
        fieldNames: { label: 'name', value: 'id' },
      }),
    ).toEqual([{ label: 'X', value: 'x' }])
    expect(resultMap).toHaveBeenCalledWith(res)
  })

  it('resultMap 返回非数组时按空数组处理', () => {
    const resultMap = vi.fn(() => 'oops' as unknown)
    expect(mapApiResponse(null, { resultMap: resultMap as never })).toEqual([])
  })

  it('无法识别返回空数组', () => {
    expect(mapApiResponse({ code: 1, msg: 'no data' }, {})).toEqual([])
    expect(mapApiResponse(null, {})).toEqual([])
    expect(mapApiResponse(undefined, {})).toEqual([])
  })

  it('缺字段的元素映射为空 label/value 兜底', () => {
    const res = [{ name: '只有名字' }, null, 42]
    expect(mapApiResponse(res, { fieldNames: { label: 'name', value: 'id' } })).toEqual([
      { label: '只有名字', value: '' },
      { label: '', value: '' },
      { label: '', value: '' },
    ])
  })
})
