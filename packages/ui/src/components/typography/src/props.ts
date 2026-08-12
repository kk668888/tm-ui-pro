// packages/ui/src/components/typography/src/props.ts
// TmTypography 类型定义：ant 原生 TitleProps / ParagraphProps / TextProps / LinkProps（无公司扩展键）
// 注：ant 顶层仅导出 TypographyProps，子组件类型走深路径导入（本库 upload 已有先例）。
import type { ExtractPropTypes } from 'vue'
import type { TitleProps } from 'ant-design-vue/es/typography/Title'
import type { ParagraphProps } from 'ant-design-vue/es/typography/Paragraph'
import type { TextProps } from 'ant-design-vue/es/typography/Text'
import type { linkProps } from 'ant-design-vue/es/typography/Link'

/**
 * ant Link 原生 props（不含 AnchorHTMLAttributes）
 * 注：ant 的 `LinkProps = Partial<ExtractPropTypes<...>> & AnchorHTMLAttributes` 含 Vue DOM 属性类型，
 * compiler-sfc 无法从 extends 解析（Failed to resolve extends base type，同 TmTag 修复）。
 * 这里取 ExtractPropTypes 部分；href/target 等 DOM 属性经 $attrs 透传。
 */
type LinkBaseProps = Partial<ExtractPropTypes<ReturnType<typeof linkProps>>>

/** TmTypographyTitle = ant 原生 TitleProps（含 level / copyable / ellipsis / editable） */
export type TmTypographyTitleProps = TitleProps

/** TmTypographyParagraph = ant 原生 ParagraphProps（含 copyable / ellipsis / editable） */
export type TmTypographyParagraphProps = ParagraphProps

/** TmTypographyText = ant 原生 TextProps（含 type / mark / code / keyboard / underline） */
export type TmTypographyTextProps = TextProps

/** TmTypographyLink = ant Link 原生 props（含 copyable / ellipsis） */
export type TmTypographyLinkProps = LinkBaseProps

// 类型透传：业务可 import { TmTypographyLinkProps, LinkProps } from '@tm/ui'
//（LinkProps 为 ant 完整类型，含 AnchorHTMLAttributes）
export type { TitleProps } from 'ant-design-vue/es/typography/Title'
export type { ParagraphProps } from 'ant-design-vue/es/typography/Paragraph'
export type { TextProps } from 'ant-design-vue/es/typography/Text'
export type { LinkProps } from 'ant-design-vue/es/typography/Link'
