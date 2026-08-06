// packages/ui/src/components/select/src/composables/useRemoteSearch.ts
// 远程搜索 composable：单一职责 = 取数（拉取 options + 维护 loading + 竞态防护）
//
// 设计要点：
// 1. minLength 门槛：query 长度不足时清空搜索选项、不发起请求（防抖窗口不启动）。
// 2. 防抖（debounce）：连续输入在静默窗口内合并，仅最终输入触发请求，减少无效请求。
// 3. 竞态防护（Race Condition）：每次真正发请求前自增 token，仅最新请求的结果写入 options，
//    避免用户快速连续输入时旧响应覆盖新响应（A 先发、A 后到 → 旧结果覆盖新结果）。
//    防抖窗口后仍走 token 防护：防抖合并的是「发起时机」，token 防护的是「结果落位」。
// 4. loading 状态：请求期间置 true，finally 复位（无论成功失败），保证 UI 必然翻转回 idle。
// 5. currentQuery：即时同步搜索词（不经防抖），供渲染层判定「是否处于激活搜索」。
// 6. 未配置 remote 时直接 return，不副作用 options/loading（支持业务纯本地 options 模式）。
// 7. 卸载时清理防抖定时器，避免组件销毁后异步回调触发。
import { onBeforeUnmount, ref, type Ref } from 'vue'
import type { TmSelectOption, TmSelectRemote } from '../props'

/** useRemoteSearch 可选配置 */
export interface UseRemoteSearchOptions {
  /** 防抖毫秒，默认 0（不防抖，立即触发） */
  debounce?: number
  /** 最小输入长度门槛，低于则不发请求，默认 0 */
  minLength?: number
}

/**
 * useRemoteSearch 的返回结构
 * @property options   远程拉取到的选项数组（响应式，仅搜索激活时生效）
 * @property loading   是否正在请求（响应式）
 * @property search    触发一次远程搜索（由 Select 的 @search 事件驱动）
 * @property currentQuery 当前搜索词（即时更新，不经防抖；渲染层据此判定 searchActive）
 */
export interface UseRemoteSearchReturn {
  options: Ref<TmSelectOption[]>
  loading: Ref<boolean>
  currentQuery: Ref<string>
  search: (query: string) => Promise<void>
}

/**
 * 创建一个远程搜索控制器
 *
 * 必须在组件 setup 期间调用（返回的 ref 需要在响应式系统中建立依赖）。
 *
 * @param getRemote 取 remote 函数的 getter（传函数以保持响应式最新引用，避免闭包陈旧）
 * @param options   防抖 / 最小输入长度配置
 * @returns {@link UseRemoteSearchReturn}
 */
export function useRemoteSearch(
  getRemote: () => TmSelectRemote | undefined,
  config: UseRemoteSearchOptions = {},
): UseRemoteSearchReturn {
  const { debounce = 0, minLength = 0 } = config

  // 远程选项、loading 与当前搜索词：由 search 异步维护
  const options = ref<TmSelectOption[]>([])
  const loading = ref(false)
  const currentQuery = ref('')

  // 单调递增的请求序号：用于丢弃乱序到达的过期响应（race condition 防护）
  let lastToken = 0
  // 防抖定时器：连续输入时取消上一次待发请求
  let timer: ReturnType<typeof setTimeout> | undefined

  // 组件卸载时清理防抖定时器，避免回调在销毁后执行
  onBeforeUnmount(() => {
    if (timer !== undefined) clearTimeout(timer)
  })

  /**
   * 真正执行一次远程取数（带 token 竞态防护）
   * 防抖窗口到达或 debounce<=0 时调用；每次调用分配新 token，
   * 仅当 token 仍是最新时写入 options / 复位 loading。
   */
  const runFetch = async (remote: TmSelectRemote, query: string): Promise<void> => {
    const token = ++lastToken
    loading.value = true
    try {
      const result = await remote(query)
      // 仅当本次仍是「最新请求」时写入结果，避免旧响应覆盖新响应
      if (token === lastToken) {
        options.value = result
      }
    } finally {
      // 无论成功失败，仅复位「当前最新请求」的 loading
      if (token === lastToken) {
        loading.value = false
      }
    }
  }

  const search = (query: string): Promise<void> => {
    const remote = getRemote()
    // 未配置 remote：直接返回，不干扰业务 options/loading
    if (!remote) return Promise.resolve()

    // 即时同步搜索词（驱动渲染层 searchActive 判定，不经防抖）
    currentQuery.value = query

    // minLength 门槛：输入过短视为「未搜索」，清空搜索选项、不启动防抖窗口
    if (query.length < minLength) {
      options.value = []
      return Promise.resolve()
    }

    // debounce <= 0：不防抖，立即取数（无 setTimeout 宏任务延迟，语义 = 即时触发）
    if (debounce <= 0) {
      return runFetch(remote, query)
    }

    // 防抖：静默窗口内新输入取消上一次待发请求；仅最后一次输入真正发请求
    if (timer !== undefined) clearTimeout(timer)
    return new Promise<void>((resolve) => {
      timer = setTimeout(() => {
        runFetch(remote, query).then(resolve)
      }, debounce)
    })
  }

  return { options, loading, currentQuery, search }
}
