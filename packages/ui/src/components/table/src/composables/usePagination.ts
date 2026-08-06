// packages/ui/src/components/table/src/composables/usePagination.ts
// 分页状态 + 远程拉数驱动 composable（单一职责 = 取数 + 维护分页/loading 状态）
//
// 设计要点（参照 Select useRemoteSearch 模式）：
// 1. 竞态防护（race condition）：每次 fetchData 自增 lastToken，仅最新请求的结果才写入
//    data/total/loading，避免快速翻页时旧响应覆盖新响应（A 先发、A 后到 → 旧结果污染）。
// 2. loading 状态：请求期间 true，finally 复位（仅最新请求复位，避免过期请求 finally 误清）。
// 3. 未配置 request 时 fetchData 为 no-op，不副作用 data/total/loading。
// 4. query 透传：业务可在 fetchData(query) 传查询参数（如搜索条件）。
// 5. 不做错误吞咽：request reject 时 finally 仍复位 loading，错误沿 await 链向上抛
//    （调用方为 void 调用，不阻塞 UI；业务可在 request 内部 try/catch）。
import { reactive, ref } from 'vue'
import type { TmTableExtProps, TmTableResult } from '../props'

/**
 * usePagination 的返回结构
 * @property page        分页状态（reactive：currentPage/pageSize）
 * @property data        远程拉取的数据行（ref）
 * @property total       总条数（ref，写入 vxe pagerConfig.total）
 * @property loading     是否正在请求（ref）
 * @property fetchData   主动触发一次拉数（由 onMounted 与 onPageChange 内部驱动）
 * @property onPageChange vxe-grid 的 page-change 事件回调（更新页码 + refetch）
 */
export interface UsePaginationReturn {
  page: { currentPage: number; pageSize: number }
  data: ReturnType<typeof ref<TmTableResult['data']>>
  total: ReturnType<typeof ref<number>>
  loading: ReturnType<typeof ref<boolean>>
  fetchData: (query?: Record<string, unknown>) => Promise<void>
  onPageChange: (p: { currentPage: number; pageSize: number }) => void
}

/**
 * 创建分页 + 远程拉数控制器
 *
 * 必须在组件 setup 期间调用（返回的 ref/reactive 需要在响应式系统中建立依赖）。
 *
 * @param getRequest 取 request 函数的 getter（传函数以保持响应式最新引用，避免闭包陈旧）
 * @returns {@link UsePaginationReturn}
 */
export function usePagination(
  getRequest: () => TmTableExtProps['request'],
): UsePaginationReturn {
  // 分页状态：reactive 通过 mutate 触发响应（Vue 响应式系统的标准用法，
  // 与「immutability（针对函数式纯数据）」规则不冲突——reactive 本身就是为 mutate 设计）
  const page = reactive({ currentPage: 1, pageSize: 10 })
  const data = ref<TmTableResult['data']>([])
  const total = ref(0)
  const loading = ref(false)

  // 单调递增的请求序号：用于丢弃乱序到达的过期响应（race condition 防护）
  let lastToken = 0

  const fetchData = async (query?: Record<string, unknown>): Promise<void> => {
    const request = getRequest()
    // 未配置 request：no-op，保留 data/total/loading 原值
    if (!request) return

    // 为本次请求分配唯一 token；后续若有新请求，token 自增使本请求结果作废
    const token = ++lastToken
    loading.value = true
    try {
      const res = await request({
        currentPage: page.currentPage,
        pageSize: page.pageSize,
        query,
      })
      // 仅当本次仍是「最新请求」时写入结果，避免旧响应覆盖新响应
      if (token === lastToken) {
        data.value = res.data
        total.value = res.total
      }
    } finally {
      // 无论成功失败，仅复位「当前最新请求」的 loading（避免被已作废请求的 finally 误清）
      if (token === lastToken) {
        loading.value = false
      }
    }
  }

  /**
   * vxe-grid page-change 事件回调
   * 更新内部 page 状态后触发 refetch；不返回 Promise（事件回调 void 调用，由内部 finally 复位 loading）
   */
  const onPageChange = (p: { currentPage: number; pageSize: number }): void => {
    page.currentPage = p.currentPage
    page.pageSize = p.pageSize
    void fetchData()
  }

  return { page, data, total, loading, fetchData, onPageChange }
}
