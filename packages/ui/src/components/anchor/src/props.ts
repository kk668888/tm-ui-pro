// packages/ui/src/components/anchor/src/props.ts
// TmAnchor 类型定义：ant 原生 AnchorProps / AnchorLinkProps（无公司扩展键）
import type { AnchorProps } from 'ant-design-vue'
import type { AnchorLinkProps } from 'ant-design-vue'

/** TmAnchor = ant 原生 AnchorProps */
export type TmAnchorProps = AnchorProps

/** TmAnchorLink = ant 原生 AnchorLinkProps */
export type TmAnchorLinkProps = AnchorLinkProps

// 类型透传
export type { AnchorProps, AnchorLinkProps } from 'ant-design-vue'
