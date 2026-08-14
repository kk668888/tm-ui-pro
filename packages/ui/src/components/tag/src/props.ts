// packages/ui/src/components/tag/src/props.ts
// TmTag 类型定义：ant 原生 TagProps + 公司扩展 props
import type { ExtractPropTypes } from 'vue'
import type { tagProps } from 'ant-design-vue/es/tag'

/**
 * ant Tag 原生 props（不含 HTMLAttributes）
 * 注：ant 的 `TagProps = HTMLAttributes & Partial<ExtractPropTypes<...>>` 含 Vue DOM 属性类型，
 * compiler-sfc 无法从 extends 解析（Failed to resolve extends base type）。
 * 这里取 ExtractPropTypes 部分（与其他组件一致）；class/style 等 DOM 属性经 $attrs 透传。
 */
type TagBaseProps = Partial<ExtractPropTypes<ReturnType<typeof tagProps>>>

/** TmTag 在 ant Tag 之上扩展的公司特有属性 */
export interface TmTagExtProps {
  /**
   * 状态枚举：映射为公司统一的语义色（success→绿 / processing→蓝 / failed→红 / warning→橙黄）
   * 业务无需手写颜色值；显式传 color 时优先于 status 映射
   */
  status?: 'success' | 'processing' | 'failed' | 'warning'
}

/** ant 原生（ExtractPropTypes）+ 公司扩展（IDE 提示 ant 原生属性与 status） */
export type TmTagProps = TagBaseProps & TmTagExtProps

// 类型透传：业务可 import { TmTagProps, TagProps } from '@kibus/tm-ui-plus'（TagProps 为 ant 完整类型）
export type { TagProps } from 'ant-design-vue'
