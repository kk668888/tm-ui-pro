// packages/ui/src/components/drawer/index.ts
// TmDrawer 出口：withInstall 附加 Vue 插件 install 方法
import Drawer from './src/Drawer.vue'
import { withInstall } from '../../utils/withInstall'

export const TmDrawer = withInstall(Drawer, 'TmDrawer')
// 类型再导出：业务方可直接 import { TmDrawerProps, DrawerProps } from '@tm/ui'
export * from './src/props'
export default TmDrawer
