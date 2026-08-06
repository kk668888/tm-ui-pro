// packages/ui/src/components/table/src/composables/useColumns.ts
// 列配置归一化：补公司默认（align / showOverflow），保证业务侧最少配置即可获得规范视觉。
//
// 设计要点：
// 1. 不 mutate 业务原数组（map 返回新对象，遵循 immutability）
// 2. spread 顺序：默认在前、业务字段在后，业务显式 align/showOverflow 始终覆盖默认
// 3. 未传 columns 时返回空数组，避免 undefined.map 报错
import { computed, type ComputedRef } from 'vue'
import type { VxeColumnProps } from 'vxe-table'

/**
 * 创建列配置归一化 computed
 *
 * @param getColumns 取 columns 的 getter（传函数保持响应式最新引用，避免闭包陈旧）
 * @returns 归一化后的 columns（响应式）
 */
export function useColumns(
  getColumns: () => VxeColumnProps[] | undefined,
): ComputedRef<VxeColumnProps[]> {
  return computed(() => {
    const cols = getColumns() ?? []
    // 浅复制 + 浅合并默认值；不修改原对象
    return cols.map((c) => ({ align: 'left', showOverflow: true, ...c }))
  })
}
