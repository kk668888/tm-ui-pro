// packages/ui/src/components/layout/index.ts
// TmLayout 出口：TmLayout / TmSider / TmHeader / TmContent / TmFooter 多子组件模块，按 form 模块形态组织
// 设计要点：
// - 命名导出全部 5 个子组件：src/index.ts 聚合时分别注册，确保 app.use(@tm/ui) 后均可用。
// - default export 提供对象形态 { TmLayout, TmSider, ... }，便于整体引用。
import Layout from './src/Layout.vue'
import Sider from './src/Sider.vue'
import Header from './src/Header.vue'
import Content from './src/Content.vue'
import Footer from './src/Footer.vue'
import { withInstall } from '../../utils/withInstall'

export const TmLayout = withInstall(Layout, 'TmLayout')
export const TmSider = withInstall(Sider, 'TmSider')
export const TmHeader = withInstall(Header, 'TmHeader')
export const TmContent = withInstall(Content, 'TmContent')
export const TmFooter = withInstall(Footer, 'TmFooter')

// 类型透传：业务方可直接 import { LayoutProps, SiderProps, TmLayoutProps, ... } from '@tm/ui'
export type { LayoutProps, SiderProps } from 'ant-design-vue'
export type {
  TmLayoutProps,
  TmSiderProps,
  TmHeaderProps,
  TmContentProps,
  TmFooterProps,
} from './src/props'

export default { TmLayout, TmSider, TmHeader, TmContent, TmFooter }
