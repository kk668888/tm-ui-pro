// packages/ui/src/components/select/src/composables/useApiLoader.ts
// api 挂载加载 composable：单一职责 = 挂载时调用 api 获取初始列表并映射为 options
//
// 设计要点：
// 1. 「获取数据」模式：仅挂载时调用一次 api({})，固定参数由业务闭包捕获，组件不注入搜索词。
// 2. 响应映射：复用 mapApiResponse 纯函数（resultMap > fieldNames > 智能识别）。
// 3. 失败处理：catch 后仅复位 loading、不抛出未捕获错误，下拉保持为空；
//    与 useRemoteSearch 的「错误由业务闭包自行处理」哲学一致。
// 4. 未配置 api 时 onMounted 直接 return，不副作用 options/loading。
import { onMounted, ref, type Ref } from 'vue'
import type { TmSelectApi, TmSelectFieldNames, TmSelectOption } from '../props'
import { mapApiResponse } from '../utils/mapApiResponse'

/** useApiLoader 的可选映射配置 */
export interface UseApiLoaderMapping {
  /** 响应数组字段名映射（透传给 mapApiResponse） */
  fieldNames?: TmSelectFieldNames
  /** 完全自定义响应 → 选项映射（透传给 mapApiResponse，优先级最高） */
  resultMap?: (res: unknown) => TmSelectOption[]
}

/**
 * useApiLoader 的返回结构
 * @property options api 拉取并映射后的选项数组（响应式）
 * @property loading 是否正在加载（响应式）
 */
export interface UseApiLoaderReturn {
  options: Ref<TmSelectOption[]>
  loading: Ref<boolean>
}

/**
 * 创建一个 api 挂载加载控制器
 *
 * 必须在组件 setup 期间调用（onMounted 注册 + ref 响应式依赖）。
 *
 * @param getApi  取 api 请求函数的 getter（传函数以保持响应式最新引用）
 * @param mapping 响应映射配置
 * @returns {@link UseApiLoaderReturn}
 */
export function useApiLoader(
  getApi: () => TmSelectApi | undefined,
  mapping: UseApiLoaderMapping = {},
): UseApiLoaderReturn {
  const { fieldNames, resultMap } = mapping

  // api 拉取并映射后的选项与 loading 状态：由 onMounted 异步维护
  const options = ref<TmSelectOption[]>([])
  const loading = ref(false)

  onMounted(async () => {
    const api = getApi()
    // 未配置 api：不发起请求，不副作用 options/loading
    if (!api) return

    loading.value = true
    try {
      const res = await api({})
      options.value = mapApiResponse(res, { fieldNames, resultMap })
    } catch {
      // 失败静默：不抛未捕获错误、下拉保持为空；业务可在 api 闭包内自行处理
      options.value = []
    } finally {
      loading.value = false
    }
  })

  return { options, loading }
}
