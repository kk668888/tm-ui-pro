// packages/ui/src/components/comment/src/props.ts
// TmComment 类型定义：ant 原生 CommentProps（兼容型封装，上游已标记废弃）
import type { CommentProps } from 'ant-design-vue'

/** TmComment = ant 原生 CommentProps */
export type TmCommentProps = CommentProps

// 类型透传：业务方可直接 import TmCommentProps / CommentProps
export type { CommentProps } from 'ant-design-vue'
