// packages/ui/src/components/anchor/index.ts
// TmAnchor 出口：TmAnchor / TmAnchorLink 多子组件模块
import Anchor from './src/Anchor.vue'
import AnchorLink from './src/AnchorLink.vue'
import { withInstall } from '../../utils/withInstall'

export const TmAnchor = withInstall(Anchor, 'TmAnchor')
export const TmAnchorLink = withInstall(AnchorLink, 'TmAnchorLink')

// 类型透传：业务方可直接 import { AnchorProps, AnchorLinkProps, TmAnchorProps, ... } from '@tm/ui'
export type { AnchorProps, AnchorLinkProps } from 'ant-design-vue'
export type { TmAnchorProps, TmAnchorLinkProps } from './src/props'

export default { TmAnchor, TmAnchorLink }
