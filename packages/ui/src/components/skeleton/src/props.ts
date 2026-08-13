// packages/ui/src/components/skeleton/src/props.ts
// TmSkeleton 类型定义：ant 原生 SkeletonProps / SkeletonAvatarProps 等
import type { SkeletonProps } from 'ant-design-vue'
// 子组件类型从模块级深层导入（ant 无 exports map，路径稳定），与运行时命名空间子组件注册对齐
import type {
  SkeletonAvatarProps,
  SkeletonImageProps,
  SkeletonInputProps,
  SkeletonButtonProps,
} from 'ant-design-vue/es/skeleton'

/** TmSkeleton = ant 原生 SkeletonProps */
export type TmSkeletonProps = SkeletonProps
/** TmSkeletonAvatar = ant 原生 SkeletonAvatarProps */
export type TmSkeletonAvatarProps = SkeletonAvatarProps
/** TmSkeletonImage = ant 原生 SkeletonImageProps */
export type TmSkeletonImageProps = SkeletonImageProps
/** TmSkeletonInput = ant 原生 SkeletonInputProps */
export type TmSkeletonInputProps = SkeletonInputProps
/** TmSkeletonButton = ant 原生 SkeletonButtonProps */
export type TmSkeletonButtonProps = SkeletonButtonProps

// 类型透传：业务方可直接 import 上述 Tm*Props / ant 原生类型
export type { SkeletonProps } from 'ant-design-vue'
export type {
  SkeletonAvatarProps,
  SkeletonImageProps,
  SkeletonInputProps,
  SkeletonButtonProps,
} from 'ant-design-vue/es/skeleton'
