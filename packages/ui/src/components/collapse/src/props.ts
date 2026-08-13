// packages/ui/src/components/collapse/src/props.ts
// TmCollapse 类型定义：ant 原生 CollapseProps；TmCollapsePanelProps 本地可移植接口
import type { VNode } from 'vue'
import type { CollapseProps } from 'ant-design-vue'

/** TmCollapse = ant 原生 CollapseProps */
export type TmCollapseProps = CollapseProps

/** ant VueNode 的轻量兼容：面板标题 / 额外内容支持文本或 VNode */
type TmVueNode = string | number | VNode

/**
 * TmCollapsePanel 组件 props
 * 说明：ant 的 CollapsePanelProps 是深层 DefineComponent 泛型类型，无法被 compiler-sfc 的
 * defineProps<T> 解析，故用本地可移植接口对齐其字段（key 为 Vue 特殊属性，由 vnode key 转发处理）
 */
export interface TmCollapsePanelProps {
  /** 面板标题（ant header） */
  header?: TmVueNode
  /** 面板额外内容（右上角，ant extra） */
  extra?: TmVueNode
  /** 是否显示箭头 */
  showArrow?: boolean
  /** 折叠行为：header（点击标题）/ icon（点击图标）/ disabled（禁用折叠） */
  collapsible?: 'header' | 'icon' | 'disabled'
  /** 是否禁用面板 */
  disabled?: boolean
  /** 隐藏面板是否强制渲染内容（配合动画过渡） */
  forceRender?: boolean
}

// 类型透传：业务方可直接 import TmCollapseProps / TmCollapsePanelProps / CollapseProps / CollapsePanelProps
export type { CollapseProps, CollapsePanelProps } from 'ant-design-vue'
