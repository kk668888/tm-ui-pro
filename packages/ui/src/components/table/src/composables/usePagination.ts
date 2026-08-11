// packages/ui/src/components/table/src/composables/usePagination.ts
// 分页状态 + 数据驱动 composable（单一职责 = 分页状态 + 数据切片/远程拉数）
//
// v2 重构（table-ant-pagination-search）：
// 1. 由 ant Pagination 的 change 事件驱动（替代 vxe page-change）——分页器改为 ant 生态。
// 2. 双模式：
//    - 远程模式（配置 request）：fetchData 拉数，data/total 为服务端结果，loading 合并
//    - 静态模式（未配置 request）：data 为当前页本地切片，total = 静态数据长度，loading 恒 false
// 3. 竞态防护（race condition）：每次 fetchData 自增 lastToken，仅最新请求的结果才写入
//    data/total/loading，避免快速翻页时旧响应覆盖新响应（A 先发、A 后到 → 旧结果污染）。
// 4. 查询条件记忆：fetchData(query) 记录 lastQuery，翻页 onChange 自动携带当前查询条件。
// 5. 未配置 request 时 fetchData 为 no-op，不副作用 data/total/loading。
// 6. 不做错误吞咽：request reject 时 finally 仍复位 loading，错误沿 await 链向上抛
//    （调用方为 void 调用，不阻塞 UI；业务可在 request 内部 try/catch）。
import { computed, reactive, ref, type ComputedRef } from 'vue'
import type { TmTableExtProps, TmTableResult } from '../props'

/**
 * usePagination 输入配置
 * @property getRequest    取 request 函数的 getter（传函数以保持响应式最新引用，避免闭包陈旧）
 * @property getStaticData 取静态数据的 getter（未配置 request 时用于本地切片；可省略）
 * @property getEnabled    分页是否启用的 getter（响应式跟随；默认 true）
 *   - false 时静态模式数据不切片、全量渲染（配合隐藏分页器，避免数据被截断）
 */
export interface UsePaginationOptions {
  getRequest: () => TmTableExtProps['request']
  getStaticData?: () => unknown[] | undefined
  getEnabled?: () => boolean
}

/**
 * usePagination 的返回结构
 * @property page        分页状态（reactive：currentPage/pageSize）
 * @property data        渲染数据（ComputedRef）：远程 = 拉取结果；静态 = 当前页切片
 * @property total       总条数（ComputedRef）：远程 = 服务端总数；静态 = 数据长度
 * @property loading     是否正在请求（ComputedRef）：静态模式恒 false
 * @property fetchData   主动触发一次拉数（由查询/翻页内部驱动）
 * @property onChange    ant Pagination 的 change 事件回调（页码/页大小变化 → 更新状态 + 触发拉数）
 * @property resetToFirst 把页码重置为 1（查询条件变化后回到首页）
 */
export interface UsePaginationReturn {
  page: { currentPage: number; pageSize: number }
  data: ComputedRef<unknown[]>
  total: ComputedRef<number>
  loading: ComputedRef<boolean>
  fetchData: (query?: Record<string, unknown>) => Promise<void>
  onChange: (page: number, pageSize: number) => void
  resetToFirst: () => void
}

/**
 * 创建分页 + 数据驱动控制器
 *
 * 必须在组件 setup 期间调用（返回的 ref/reactive 需要在响应式系统中建立依赖）。
 *
 * @param options {@link UsePaginationOptions}
 * @returns {@link UsePaginationReturn}
 */
export function usePagination(options: UsePaginationOptions): UsePaginationReturn {
  const { getRequest, getStaticData, getEnabled } = options

  // 分页状态：reactive 通过 mutate 触发响应（Vue 响应式系统的标准用法，
  // 与「immutability（针对函数式纯数据）」规则不冲突——reactive 本身就是为 mutate 设计）
  const page = reactive({ currentPage: 1, pageSize: 10 })

  // 远程模式的真实数据源（静态模式不用）
  const remoteData = ref<unknown[]>([])
  const remoteTotal = ref(0)
  const remoteLoading = ref(false)

  // 单调递增的请求序号：用于丢弃乱序到达的过期响应（race condition 防护）
  let lastToken = 0
  // 最近一次查询条件：翻页时自动携带，避免翻页丢查询
  let lastQuery: Record<string, unknown> | undefined

  const fetchData = async (query?: Record<string, unknown>): Promise<void> => {
    const request = getRequest()
    // 记忆查询条件：即使 request 未配置（静态模式），查询状态也保留
    lastQuery = query
    // 未配置 request：no-op，保留 data/total/loading 原值（静态模式数据由 computed 派生）
    if (!request) return

    // 为本次请求分配唯一 token；后续若有新请求，token 自增使本请求结果作废
    const token = ++lastToken
    remoteLoading.value = true
    try {
      const res = await request({
        currentPage: page.currentPage,
        pageSize: page.pageSize,
        query,
      })
      // 仅当本次仍是「最新请求」时写入结果，避免旧响应覆盖新响应
      if (token === lastToken) {
        remoteData.value = res.data
        remoteTotal.value = res.total
      }
    } finally {
      // 无论成功失败，仅复位「当前最新请求」的 loading（避免被已作废请求的 finally 误清）
      if (token === lastToken) {
        remoteLoading.value = false
      }
    }
  }

  /**
   * ant Pagination change 事件回调：`(page, pageSize) => void`
   * 页码或页大小变化时更新内部状态并触发 refetch（携带上次查询条件）
   */
  const onChange = (pageNum: number, pageSize: number): void => {
    page.currentPage = pageNum
    page.pageSize = pageSize
    void fetchData(lastQuery)
  }

  /** 页码重置为 1：查询/重置条件变化后回到首页 */
  const resetToFirst = (): void => {
    page.currentPage = 1
  }

  // 静态数据源：getStaticData getter 每次求值取最新（业务 data 变化时自动响应）
  const staticData = computed<unknown[]>(() => getStaticData?.() ?? [])
  // 是否静态模式：request 未配置即静态
  const isStatic = computed<boolean>(() => !getRequest())
  // 分页是否启用：false 时静态数据不切片、全量渲染（配合隐藏分页器，避免数据被截断）
  const enabled = computed<boolean>(() => getEnabled?.() ?? true)

  /**
   * 渲染数据：
   * - 静态模式 + 分页关闭：直接返回全量静态数据（不切片）
   * - 静态模式 + 分页开启：按当前页切片（page 变化时 computed 自动重算）
   * - 远程模式：直接返回拉取结果
   */
  const data = computed<unknown[]>(() => {
    if (isStatic.value) {
      if (!enabled.value) return staticData.value
      const start = (page.currentPage - 1) * page.pageSize
      return staticData.value.slice(start, start + page.pageSize)
    }
    return remoteData.value
  })

  /** 总条数：静态模式 = 数据长度；远程模式 = 服务端总数 */
  const total = computed<number>(() =>
    isStatic.value ? staticData.value.length : remoteTotal.value,
  )

  /** loading：静态模式恒 false；远程模式合并远程请求状态 */
  const loading = computed<boolean>(() => (isStatic.value ? false : remoteLoading.value))

  return { page, data, total, loading, fetchData, onChange, resetToFirst }
}
