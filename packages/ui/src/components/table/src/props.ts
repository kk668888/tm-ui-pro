// packages/ui/src/components/table/src/props.ts
// TmTable 类型定义：
// - TmTableProps = VxeGridProps（vxe 原生）+ TmTableExtProps（公司扩展：request / search / density）
// - re-export vxe 原生类型，业务侧 import { TmTableProps, VxeGridProps, ... } from '@tm/ui' 即可
//
// 注意：从 VxeGridProps 继承的 pagerConfig 不再透传给 vxe-grid（vxe 不再渲染分页器），
// 其 total / currentPage / pageSize 语义改为驱动 ant-design-vue Pagination 的 props（见 design D3）。
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
 * @property total 总条数（驱动 ant Pagination 渲染总页数）
 */
export interface TmTableResult<T = Record<string, unknown>> {
  data: T[]
  total: number
}

/**
 * 搜索字段类型（ant 组件映射）
 * - input   → a-input
 * - select  → a-select（需配置 options）
 * - date    → a-date-picker
 */
export type TmTableSearchFieldType = 'input' | 'select' | 'date'

/**
 * search 扩展键的单个搜索字段声明
 * @property field        字段名（写入 query 的 key，也作为 Form model 的 key）
 * @property label        表单项标签
 * @property type         字段类型（默认 input）
 * @property placeholder  输入占位提示
 * @property options      select 类型的选项列表（value 限定 string | number 以匹配 ant Select）
 * @property defaultValue 重置后恢复的默认值（默认空字符串）
 * @property span         ant Col 栅格跨度（默认 8，一行 3 个）
 */
export interface TmTableSearchField {
  field: string
  label: string
  type?: TmTableSearchFieldType
  placeholder?: string
  options?: Array<{ label: string; value: string | number }>
  defaultValue?: unknown
  span?: number
}

/**
 * search 扩展键配置：声明式 ant 搜索表单
 * 配置后 TmTable 在表格上方渲染 a-form 栅格搜索区，
 * 「查询」收集非空字段值为 query 触发 fetchData(query)、页码重置 1；「重置」清空字段并重拉。
 */
export interface TmTableSearchConfig {
  fields: TmTableSearchField[]
}

/**
 * 行高密度档位（映射 vxe row-config.height）
 * - compact 紧凑行高
 * - default 默认行高
 * - loose   宽松行高
 */
export type TmTableDensity = 'compact' | 'default' | 'loose'

/**
 * TmTable 扩展属性（纯薄封装原则：request / search / density 均为可选扩展键）
 *
 * @property request 远程拉数函数
 *   - 传入则 TmTable 自动驱动数据加载与分页（mount 拉首页 + ant 分页器 change 自动 refetch）
 *   - 返回 { data, total }：data 写入 VxeGrid.data，total 写入 ant Pagination.total
 *   - 未传入则 TmTable 退化为静态表格（本地切片分页）
 * @property search 声明式 ant 搜索表单配置（可选）
 *   - 配置后表格上方渲染搜索区，「查询」收集字段为 query 触发 fetchData(query)
 * @property density 行高密度档位（可选）：compact / default / loose
 *   - 未配置使用 vxe 默认行高；业务显式传 row-config.height 优先于 density
 * @property pagination 是否渲染 ant 分页器（可选，默认 true）
 *   - false 时：不渲染分页器，且静态模式（未配置 request）数据全量渲染、不按页切片
 *   - 典型场景：API 文档属性表、纯展示的静态小表格（无需翻页能力）
 */
export interface TmTableExtProps {
  request?: (
    params: TmTablePageParam & { query?: Record<string, unknown> },
  ) => Promise<TmTableResult>
  search?: TmTableSearchConfig
  density?: TmTableDensity
  pagination?: boolean
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
