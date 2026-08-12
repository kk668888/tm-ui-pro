// packages/ui/src/components/tabs/src/props.ts
// TmTabs 类型定义：ant 原生 TabsProps / TabPaneProps（无公司扩展键）
import type { TabsProps } from 'ant-design-vue'
import type { TabPaneProps } from 'ant-design-vue'

/** TmTabs = ant 原生 TabsProps */
export type TmTabsProps = TabsProps

/** TmTabPane = ant 原生 TabPaneProps */
export type TmTabPaneProps = TabPaneProps

// 类型透传
export type { TabsProps, TabPaneProps } from 'ant-design-vue'
