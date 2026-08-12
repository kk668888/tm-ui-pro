// packages/ui/src/components/mentions/src/props.ts
// TmMentions 类型定义：ant 原生 MentionsProps + 可移植 MentionsOptionProps
import type { MentionsProps } from 'ant-design-vue'

/** TmMentions = ant 原生 MentionsProps */
export type TmMentionsProps = MentionsProps

/**
 * TmMentionsOption = 可移植接口
 * 注：ant 顶层导出 MentionsOption，无独立导出 Props 类型。
 */
export interface TmMentionsOptionProps {
  /** 选项值（ant 原生，选中后回填） */
  value?: string | number
  /** 是否禁用（ant 原生） */
  disabled?: boolean
}

// 类型透传
export type { MentionsProps } from 'ant-design-vue'
