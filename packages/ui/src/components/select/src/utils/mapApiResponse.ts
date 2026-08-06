// packages/ui/src/components/select/src/utils/mapApiResponse.ts
// 响应 → options 纯函数映射：把 api 返回的任意结构规整为 TmSelectOption[]
//
// 设计要点：
// 1. 纯函数、无副作用、无组件依赖，便于独立单测。
// 2. 映射优先级：resultMap（完全自定义）> fieldNames（字段名映射）> 常见格式智能识别。
// 3. 智能识别仅匹配「数组直接位于常见 key」的形态，不做深度递归，避免误判嵌套业务数据。
import type { TmSelectFieldNames, TmSelectOption } from '../props'

/** 智能识别的候选路径（从响应顶层逐级取数组） */
const DATA_PATHS: ReadonlyArray<ReadonlyArray<string>> = [
  [],
  ['data'],
  ['data', 'records'],
  ['data', 'list'],
  ['records'],
  ['list'],
]

/** 从任意值中按路径读取（只读安全），未命中返回 undefined */
function getByPath(source: unknown, path: readonly string[]): unknown {
  let current: unknown = source
  for (const key of path) {
    if (current === null || typeof current !== 'object') return undefined
    current = (current as Record<string, unknown>)[key]
  }
  return current
}

/** 从响应中识别出数组；未命中返回 undefined */
function extractArray(res: unknown): unknown[] | undefined {
  if (Array.isArray(res)) return res
  for (const path of DATA_PATHS) {
    const value = getByPath(res, path)
    if (Array.isArray(value)) return value
  }
  return undefined
}

/**
 * 把 api 响应映射为选项数组
 *
 * @param res         api 请求返回的原始响应
 * @param options     映射配置
 * @param options.resultMap  完全自定义映射，提供后直接以其返回值作为选项（最高优先）
 * @param options.fieldNames 响应元素字段名映射，默认 label/value
 * @returns TmSelectOption[]，无法识别时返回空数组
 */
export function mapApiResponse(
  res: unknown,
  options: { resultMap?: (res: unknown) => TmSelectOption[]; fieldNames?: TmSelectFieldNames },
): TmSelectOption[] {
  const { resultMap, fieldNames } = options

  // 1) resultMap 完全自定义：优先级最高
  if (resultMap) {
    const mapped = resultMap(res)
    return Array.isArray(mapped) ? mapped : []
  }

  // 2) 智能识别数组来源
  const arr = extractArray(res)
  if (!arr) return []

  // 3) 按字段名映射 label/value
  const labelKey = fieldNames?.label ?? 'label'
  const valueKey = fieldNames?.value ?? 'value'
  return arr.map((item) => {
    const record = (item ?? {}) as Record<string, unknown>
    return {
      label: String(record[labelKey] ?? ''),
      value: (record[valueKey] as string | number) ?? '',
    }
  })
}
