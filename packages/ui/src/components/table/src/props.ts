// packages/ui/src/components/table/src/props.ts
// TmTable 类型定义：
// - TmTableProps = VxeGridProps（vxe 原生）+ TmTableExtProps（公司仅 request 一个扩展键）
// - re-export vxe 原生类型，业务侧 import { TmTableProps, VxeGridProps, ... } from '@tm/ui' 即可
//
// vxe-table 4.20 类型导出路径已实测（brief Bug 6）：
// 从 'vxe-table' 主入口可拿到 VxeGridProps / VxeGridInstance / VxeColumnProps / VxeGridListeners。
import type { VxeGridProps } from 'vxe-table'

/**
 * 分页参数（与 vxe-pager 标准字段对齐）
 * @property currentPage 当前页码（1-based）
 * @property pageSize     每页条数
 */
export interface TmTablePageParam {
  currentPage: number
  pageSize: number
}

/**
 * 远程拉数返回值
 * @property data  当前页数据行
 * @property total 总条数（用于 vxe pager 渲染总页数）
 */
export interface TmTableResult<T = Record<string, unknown>> {
  data: T[]
  total: number
}

/**
 * TmTable 扩展属性（仅 request 一个键，纯薄封装原则）
 *
 * @property request 远程拉数函数
 *   - 传入则 TmTable 自动驱动数据加载与分页（mount 拉首页 + page-change 自动 refetch）
 *   - 返回 { data, total }：data 写入 VxeGrid.data，total 写入 VxeGrid.pagerConfig.total
 *   - 未传入则 TmTable 退化为静态表格（直接透传业务 data prop）
 */
export interface TmTableExtProps {
  request?: (
    params: TmTablePageParam & { query?: Record<string, unknown> },
  ) => Promise<TmTableResult>
}

/**
 * 完整 props：vxe 原生 props + 公司扩展
 * @template D 行数据类型（vxe 原生支持泛型）
 */
export type TmTableProps<D = any> = VxeGridProps<D> & TmTableExtProps

// re-export vxe 原生类型，业务侧无需直接依赖 vxe-table 也能拿到类型
export type {
  VxeGridProps,
  VxeGridInstance,
  VxeColumnProps,
  VxeGridListeners,
} from 'vxe-table'
