// packages/ui/src/components/pagination/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 与 TmTable 分页配置对齐（pageSize 10 / pageSizes [10,20,50]），统一业务分页 UX。
// 注：showSizeChanger / pageSizeOptions 用函数形式——withDefaults 的 InferDefault
// 要求匹配「值或函数签名」，字符串字面量会触发 TS2345（同 basic 修复）。
import type { PaginationProps } from 'ant-design-vue'

/** 公司默认：显示每页条数切换器 */
export const DEFAULT_SHOW_SIZE_CHANGER = true
/** 公司默认分页选项：与 TmTable pagerConfig.pageSizes 对齐 */
export const DEFAULT_PAGE_SIZE_OPTIONS = ['10', '20', '50']

export const tmPaginationDefaults = {
  showSizeChanger: (): PaginationProps['showSizeChanger'] => DEFAULT_SHOW_SIZE_CHANGER,
  pageSizeOptions: (): PaginationProps['pageSizeOptions'] => [...DEFAULT_PAGE_SIZE_OPTIONS],
} as const
