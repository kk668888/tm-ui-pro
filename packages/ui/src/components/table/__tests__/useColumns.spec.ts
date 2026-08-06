// packages/ui/src/components/table/__tests__/useColumns.spec.ts
// useColumns 独立单测：列配置归一化
// 不依赖 vxe 渲染，验证补默认 + 业务覆盖逻辑。
import { describe, it, expect } from 'vitest'
import { useColumns } from '../src/composables/useColumns'
import type { VxeColumnProps } from 'vxe-table'

describe('useColumns', () => {
  it('未传 columns 时返回空数组（不报错）', () => {
    const cols = useColumns(() => undefined)
    expect(cols.value).toEqual([])
  })

  it('补默认 align=left / showOverflow=true', () => {
    const cols = useColumns(() => [{ field: 'name', title: '姓名' }])
    // spread 顺序：默认在前，业务字段在后
    expect(cols.value).toEqual([
      { align: 'left', showOverflow: true, field: 'name', title: '姓名' },
    ])
  })

  it('业务显式 align / showOverflow 覆盖默认', () => {
    const cols = useColumns(() => [
      { field: 'age', align: 'center', showOverflow: false },
    ] as VxeColumnProps[])
    expect(cols.value[0].align).toBe('center')
    expect(cols.value[0].showOverflow).toBe(false)
  })

  it('多列均被归一化', () => {
    const cols = useColumns(() => [
      { field: 'a', title: 'A' },
      { field: 'b', title: 'B', align: 'right' },
    ])
    expect(cols.value).toHaveLength(2)
    expect(cols.value[0]).toMatchObject({ field: 'a', align: 'left', showOverflow: true })
    expect(cols.value[1]).toMatchObject({ field: 'b', align: 'right', showOverflow: true })
  })
})
