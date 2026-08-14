// packages/ui/src/components/avatar/index.ts
// TmAvatar 出口：TmAvatar / TmAvatarGroup 多子组件模块
import Avatar from './src/Avatar.vue'
import AvatarGroup from './src/AvatarGroup.vue'
import { withInstall } from '../../utils/withInstall'

export const TmAvatar = withInstall(Avatar, 'TmAvatar')
export const TmAvatarGroup = withInstall(AvatarGroup, 'TmAvatarGroup')

// 类型再导出：业务方可直接 import { TmAvatarProps, TmAvatarGroupProps, AvatarProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmAvatar, TmAvatarGroup }
