// packages/ui/src/components/avatar/src/props.ts
// TmAvatar 类型定义：ant 原生 AvatarProps / AvatarGroupProps
import type { AvatarProps } from 'ant-design-vue'
// AvatarGroupProps 未从 ant 顶层导出，从模块级深层导入（ant 无 exports map，路径稳定）
import type { AvatarGroupProps } from 'ant-design-vue/es/avatar'

/** TmAvatar = ant 原生 AvatarProps */
export type TmAvatarProps = AvatarProps
/** TmAvatarGroup = ant 原生 AvatarGroupProps */
export type TmAvatarGroupProps = AvatarGroupProps

// 类型透传：业务方可直接 import TmAvatarProps / TmAvatarGroupProps / AvatarProps / AvatarGroupProps
export type { AvatarProps } from 'ant-design-vue'
export type { AvatarGroupProps } from 'ant-design-vue/es/avatar'
