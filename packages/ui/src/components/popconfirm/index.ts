// packages/ui/src/components/popconfirm/index.ts
// TmPopconfirm 出口：withInstall 附加 Vue 插件 install 方法
import Popconfirm from './src/Popconfirm.vue'
import { withInstall } from '../../utils/withInstall'

export const TmPopconfirm = withInstall(Popconfirm, 'TmPopconfirm')
// 类型再导出：业务方可直接 import { TmPopconfirmProps, PopconfirmProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmPopconfirm
