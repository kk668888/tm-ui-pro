// packages/ui/src/components/skeleton/index.ts
// TmSkeleton 出口：TmSkeleton / TmSkeletonAvatar / TmSkeletonImage / TmSkeletonInput / TmSkeletonButton 多子组件模块
import Skeleton from './src/Skeleton.vue'
import SkeletonAvatar from './src/SkeletonAvatar.vue'
import SkeletonImage from './src/SkeletonImage.vue'
import SkeletonInput from './src/SkeletonInput.vue'
import SkeletonButton from './src/SkeletonButton.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSkeleton = withInstall(Skeleton, 'TmSkeleton')
export const TmSkeletonAvatar = withInstall(SkeletonAvatar, 'TmSkeletonAvatar')
export const TmSkeletonImage = withInstall(SkeletonImage, 'TmSkeletonImage')
export const TmSkeletonInput = withInstall(SkeletonInput, 'TmSkeletonInput')
export const TmSkeletonButton = withInstall(SkeletonButton, 'TmSkeletonButton')
// 标题条：ant 顶层导出 SkeletonTitle 别名复用（design D2）
import { SkeletonTitle } from 'ant-design-vue'

export const TmSkeletonTitle = withInstall(SkeletonTitle, 'TmSkeletonTitle')

// 类型再导出：业务方可直接 import { TmSkeletonProps, TmSkeletonAvatarProps, SkeletonProps } from '@trustmo/tm-ui'
export * from './src/props'
export default { TmSkeleton, TmSkeletonAvatar, TmSkeletonImage, TmSkeletonInput, TmSkeletonButton }
