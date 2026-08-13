// packages/ui/src/components/descriptions/src/props.ts
// TmDescriptions 类型定义：ant 原生 DescriptionsProps；TmDescriptionsItemProps 本地可移植接口
import type { CSSProperties, VNode } from 'vue'
import type { DescriptionsProps } from 'ant-design-vue'

/** TmDescriptions = ant 原生 DescriptionsProps */
export type TmDescriptionsProps = DescriptionsProps

/** ant VueNode 的轻量兼容：条目 label / title 支持文本或 VNode */
type TmVueNode = string | number | VNode

/**
 * TmDescriptionsItem 组件 props
 * 说明：ant 的 DescriptionsItemProps 定义在 ant-design-vue/es/descriptions 内部，
 * 跨包深层类型无法被 compiler-sfc 的 defineProps<T> 解析，故用本地可移植接口对齐其字段
 * （label / labelStyle / contentStyle / span），行为与 ant DescriptionsItem 一致
 */
export interface TmDescriptionsItemProps {
  /** 条目标题（ant label） */
  label?: TmVueNode
  /** 跨列数：数字，或 'filled'（该条目占满整行） */
  span?: number | 'filled'
  /** 条目标题内联样式 */
  labelStyle?: CSSProperties
  /** 条目内容内联样式 */
  contentStyle?: CSSProperties
}

// 类型透传：业务方可直接 import TmDescriptionsProps / DescriptionsProps
export type { DescriptionsProps } from 'ant-design-vue'
