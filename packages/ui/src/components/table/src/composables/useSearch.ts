// packages/ui/src/components/table/src/composables/useSearch.ts
// 声明式 ant 搜索表单 composable：字段配置 → Form model + 查询/重置驱动
//
// 设计要点（design D4）：
// 1. 字段配置驱动：fields 数组声明字段，渲染层（Table.vue）按 type 分发 ant 组件。
// 2. model 为 reactive 对象，v-model 绑定各字段值（表单项值变化即时响应）。
// 3. handleSearch：收集「非空」字段值为 query → 页码重置 1 → fetchData(query)。
//    - 空值剔除：'' / [] / null / undefined 不计入 query，避免脏参数。
// 4. resetQuery：恢复各字段 defaultValue（默认空串）→ 页码重置 1 → fetchData(undefined) 重拉。
// 5. 未配置 search（config 为 undefined）时：fields 为空数组，handleSearch/resetQuery 为 no-op。
import { reactive } from 'vue'
import type { TmTableSearchConfig } from '../props'

/**
 * 搜索表单 model 的值类型：ant Form model 生态惯例的宽松映射。
 * 模板 v-model 动态索引绑定（a-input string / a-select SelectValue / a-date-picker Dayjs）
 * 需要 any 才能通过 vue-tsc 的严格双向类型检查；显式联合反而会因组件 value 类型
 * 各异而报错。这里保留 any 并集中豁免一处（含 Table.vue 模板三处 v-model 绑定）。
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SearchFormModel = Record<string, any>

/**
 * useSearch 输入依赖（由 Table.vue 注入 usePagination 的控制器）
 * @property fetchData     远程拉数函数（来自 usePagination）
 * @property resetToFirst  页码重置 1（来自 usePagination，查询后回到首页）
 */
export interface UseSearchOptions {
  fetchData: (query?: Record<string, unknown>) => Promise<void>
  resetToFirst: () => void
}

/**
 * useSearch 的返回结构
 * @property fields        搜索字段配置（渲染层遍历生成 ant 表单项）
 * @property model         Form model（reactive，字段值 v-model 绑定）
 * @property handleSearch  查询：收集非空字段 → 页码置 1 → fetchData(query)
 * @property resetQuery    重置：清空字段 → 页码置 1 → 重拉
 */
export interface UseSearchReturn {
  fields: NonNullable<TmTableSearchConfig>['fields']
  // 承载业务任意声明的字段值（input string / select number / date Dayjs...）。
  // 类型见 SearchFormModel：ant Form model 生态惯例，模板 v-model 动态索引需宽松读写。
  model: SearchFormModel
  handleSearch: () => void
  resetQuery: () => void
}

/** 判断字段值是否为「空」（空串 / 空数组 / null / undefined 均视为空） */
function isEmpty(value: unknown): boolean {
  return value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)
}

/**
 * 创建搜索控制器
 *
 * 必须在组件 setup 期间调用（model 需要在响应式系统中建立依赖）。
 *
 * @param config  search 扩展键配置；未配置时返回 no-op 控制器
 * @param options {@link UseSearchOptions}
 * @returns {@link UseSearchReturn}
 */
export function useSearch(
  config: TmTableSearchConfig | undefined,
  options: UseSearchOptions,
): UseSearchReturn {
  const { fetchData, resetToFirst } = options
  const fields = config?.fields ?? []
  // 未配置 search 时，handleSearch/resetQuery 为 no-op（不触发任何拉数）
  const configured = Boolean(config)

  // Form model：以字段默认值初始化（reactive，表单项 v-model 双向绑定）
  const model = reactive<SearchFormModel>(
    Object.fromEntries(fields.map((f) => [f.field, f.defaultValue ?? ''])),
  )

  /** 收集所有非空字段值为查询对象（空值剔除） */
  const collectQuery = (): Record<string, unknown> => {
    const query: Record<string, unknown> = {}
    for (const field of fields) {
      const value = model[field.field]
      if (isEmpty(value)) continue
      query[field.field] = value
    }
    return query
  }

  /** 查询：页码重置 1 → 携带查询条件拉数（未配置 search 时 no-op） */
  const handleSearch = (): void => {
    if (!configured) return
    resetToFirst()
    void fetchData(collectQuery())
  }

  /** 重置：字段恢复默认值 → 页码重置 1 → 不带查询条件重拉（未配置 search 时 no-op） */
  const resetQuery = (): void => {
    if (!configured) return
    for (const field of fields) {
      model[field.field] = field.defaultValue ?? ''
    }
    resetToFirst()
    void fetchData(undefined)
  }

  return { fields, model, handleSearch, resetQuery }
}
