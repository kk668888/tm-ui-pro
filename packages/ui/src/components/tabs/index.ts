// packages/ui/src/components/tabs/index.ts
// TmTabs 出口：TmTabs / TmTabPane 多子组件模块
import Tabs from './src/Tabs.vue'
import TabPane from './src/TabPane.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTabs = withInstall(Tabs, 'TmTabs')
export const TmTabPane = withInstall(TabPane, 'TmTabPane')

// 类型透传：业务方可直接 import { TabsProps, TabPaneProps, TmTabsProps, ... } from '@tm/ui'
export type { TabsProps, TabPaneProps } from 'ant-design-vue'
export type { TmTabsProps, TmTabPaneProps } from './src/props'

export default { TmTabs, TmTabPane }
