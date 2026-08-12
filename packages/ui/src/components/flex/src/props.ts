// packages/ui/src/components/flex/src/props.ts
// TmFlex 类型定义：可移植接口（公司默认 gap 在 defaults.ts 提供）
// 注：ant 的 `FlexProps = Partial<ExtractPropTypes<...> & HTMLElement>` 含 csstype 引用，
// dts 生成时 TS2742 无法命名（FlexWrap/JustifyContent 等来自 csstype，非本库声明依赖）。
// 这里用纯接口定义（CSS 值透传为 string），保证 dts 可移植；完整 ant 类型仍 re-export。
/**
 * TmFlex = 可移植的 Flex 接口（含 company 默认 gap）
 * - wrap/justify/align/flex 为任意合法 CSS 值（ant 本身也接受自定义值）
 * - class/style 等 DOM 属性经 $attrs 透传
 */
export interface TmFlexProps {
  /** 纵向排列 */
  vertical?: boolean
  /** 换行：nowrap | wrap | wrap-reverse（ant 原生） */
  wrap?: string
  /** 主轴对齐：任意合法 CSS justify-content 值（ant 原生） */
  justify?: string
  /** 交叉轴对齐：任意合法 CSS align-items 值（ant 原生） */
  align?: string
  /** flex 简写（ant 原生） */
  flex?: string | number
  /** 间距：公司默认 middle（与 TmSpace 对齐），业务可覆盖 */
  gap?: string | number
  /** 渲染标签（ant 原生） */
  component?: string
  /** 前缀类名（ant 原生） */
  prefixCls?: string
}

// 类型透传：业务可 import { TmFlexProps, FlexProps } from '@tm/ui'（FlexProps 为 ant 完整类型）
export type { FlexProps } from 'ant-design-vue'
