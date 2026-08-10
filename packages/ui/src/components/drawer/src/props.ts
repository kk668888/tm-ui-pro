// packages/ui/src/components/drawer/src/props.ts
// TmDrawer 类型定义：ant 原生 DrawerProps + 公司扩展
import type { DrawerProps } from 'ant-design-vue'

/** TmDrawer 在 ant Drawer 之上扩展的公司特有属性 */
export interface TmDrawerExtProps {
  /** 业务 v-model 绑定值（开关状态）；内部 computed 桥接到 ant Drawer 的 open */
  modelValue?: boolean
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmDrawerProps = DrawerProps & TmDrawerExtProps

// 类型透传：业务方可直接 import TmDrawerProps / DrawerProps
export type { DrawerProps } from 'ant-design-vue'
