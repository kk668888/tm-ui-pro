// packages/ui/src/components/cascader/index.ts
// TmCascader 出口：withInstall 附加 Vue 插件 install 方法
import Cascader from './src/Cascader.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCascader = withInstall(Cascader, 'TmCascader')
// 类型再导出：业务方可直接 import { TmCascaderProps, CascaderProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmCascader
