// packages/ui/src/components/auto-complete/src/defaults.ts
// 公司默认 props：业务传入可覆盖
// 注：ant AutoComplete 的 filterOption 默认 false（输入不过滤，展示全部选项），
// 配合 defaultActiveFirstOption 易误选首个选项。公司默认开启按 value 过滤（大小写不敏感子串）。
import type { AutoCompleteProps } from 'ant-design-vue'

/** 公司默认过滤：按选项 value 大小写不敏感子串匹配 */
export const tmAutoCompleteDefaults = {
  filterOption: ((input: string, option?: { value?: string | number }) =>
    String(option?.value ?? '').toUpperCase().includes(input.toUpperCase())) as AutoCompleteProps['filterOption'],
} as const
