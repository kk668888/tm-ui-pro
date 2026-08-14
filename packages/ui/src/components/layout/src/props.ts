// packages/ui/src/components/layout/src/props.ts
// TmLayout 类型定义：ant 原生 LayoutProps / SiderProps（无公司扩展键）
import type { ExtractPropTypes } from 'vue'
import type { basicProps } from 'ant-design-vue/es/layout/layout'
import type { SiderProps } from 'ant-design-vue'

/**
 * ant Layout 原生 props（不含 HTMLAttributes）
 * 注：ant 的 `LayoutProps = Partial<ExtractPropTypes<...>> & HTMLAttributes` 含 Vue DOM 属性类型，
 * compiler-sfc 无法从 extends 解析（Failed to resolve extends base type，同 TmTag 修复）。
 * 这里取 ExtractPropTypes 部分；class/style 等 DOM 属性经 $attrs 透传。
 */
type LayoutBaseProps = Partial<ExtractPropTypes<ReturnType<typeof basicProps>>>

/** TmLayout = ant Layout 原生 props（含 hasSider） */
export type TmLayoutProps = LayoutBaseProps

/** TmSider = ant 原生 SiderProps（含 collapsible / collapsedWidth / breakpoint / theme） */
export type TmSiderProps = SiderProps

// Header / Content / Footer 与 Layout 同为区块组件，共用 LayoutBaseProps 结构
/** TmHeader = Layout 结构（ant Layout.Header） */
export type TmHeaderProps = LayoutBaseProps

/** TmContent = Layout 结构（ant Layout.Content） */
export type TmContentProps = LayoutBaseProps

/** TmFooter = Layout 结构（ant Layout.Footer） */
export type TmFooterProps = LayoutBaseProps

// 类型透传：业务可 import { TmLayoutProps, LayoutProps, SiderProps } from '@kibus/tm-ui-plus'
//（LayoutProps 为 ant 完整类型，含 HTMLAttributes）
export type { LayoutProps, SiderProps } from 'ant-design-vue'
