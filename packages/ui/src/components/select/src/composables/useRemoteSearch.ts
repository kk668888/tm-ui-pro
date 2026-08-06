// packages/ui/src/components/select/src/composables/useRemoteSearch.ts
// 远程搜索 composable：单一职责 = 取数（拉取 options + 维护 loading）
//
// 设计要点：
// 1. 竞态防护（Race Condition）：每次 search 自增 token，仅最新请求的结果会写入 options，
//    避免用户快速连续输入时旧响应覆盖新响应（A 先发、A 后到 → 旧结果覆盖新结果）。
// 2. loading 状态：请求期间置 true，finally 复位（无论成功失败），保证 UI 必然翻转回 idle。
// 3. 未配置 remote 时直接 return，不副作用 options/loading（支持业务纯本地 options 模式）。
// 4. 不做防抖：保持单一职责。如需防抖，由业务包装 remote 或在 ant Select 外层处理。
// 5. 错误传播：remote reject 时 finally 仍复位 loading，错误沿 await 链路向上抛出
//    （模板侧 @search 处理函数为 void 调用，不阻塞 UI；业务可在 remote 内部 try/catch）。
import { ref } from 'vue'
import type { TmSelectOption, TmSelectRemote } from '../props'

/**
 * useRemoteSearch 的返回结构
 * @property options 远程拉取到的选项数组（响应式）
 * @property loading 是否正在请求（响应式）
 * @property search  触发一次远程搜索（由 Select 的 @search 事件驱动）
 */
export interface UseRemoteSearchReturn {
  options: ReturnType<typeof ref<TmSelectOption[]>>
  loading: ReturnType<typeof ref<boolean>>
  search: (query: string) => Promise<void>
}

/**
 * 创建一个远程搜索控制器
 *
 * 必须在组件 setup 期间调用（返回的 ref 需要在响应式系统中建立依赖）。
 *
 * @param getRemote 取 remote 函数的 getter（传函数以保持响应式最新引用，避免闭包陈旧）
 * @returns {@link UseRemoteSearchReturn}
 */
export function useRemoteSearch(getRemote: () => TmSelectRemote | undefined): UseRemoteSearchReturn {
  // 远程选项与 loading 状态：由 search 异步维护
  const options = ref<TmSelectOption[]>([])
  const loading = ref(false)

  // 单调递增的请求序号：用于丢弃乱序到达的过期响应（race condition 防护）
  let lastToken = 0

  const search = async (query: string): Promise<void> => {
    const remote = getRemote()
    // 未配置 remote：直接返回，不干扰业务 options/loading
    if (!remote) return

    // 为本次请求分配唯一 token；后续若有新请求，token 会继续自增使本请求结果作废
    const token = ++lastToken
    loading.value = true
    try {
      const result = await remote(query)
      // 仅当本次仍是「最新请求」时写入结果，避免旧响应覆盖新响应
      if (token === lastToken) {
        options.value = result
      }
    } finally {
      // 无论成功失败，仅复位「当前最新请求」的 loading（避免被已作废请求的 finally 误清）
      if (token === lastToken) {
        loading.value = false
      }
    }
  }

  return { options, loading, search }
}
