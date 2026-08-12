// packages/ui/src/components/mentions/index.ts
// TmMentions 出口：TmMentions / TmMentionsOption 多子组件模块
import Mentions from './src/Mentions.vue'
import MentionsOption from './src/MentionsOption.vue'
import { withInstall } from '../../utils/withInstall'

export const TmMentions = withInstall(Mentions, 'TmMentions')
export const TmMentionsOption = withInstall(MentionsOption, 'TmMentionsOption')

// 类型透传：业务方可直接 import { MentionsProps, TmMentionsProps, ... } from '@tm/ui'
export type { MentionsProps } from 'ant-design-vue'
export type { TmMentionsProps, TmMentionsOptionProps } from './src/props'

export default { TmMentions, TmMentionsOption }
