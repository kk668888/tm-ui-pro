// packages/ui/src/components/affix/index.ts
// TmAffix 出口：withInstall 附加 Vue 插件 install 方法
import Affix from './src/Affix.vue'
import { withInstall } from '../../utils/withInstall'

export const TmAffix = withInstall(Affix, 'TmAffix')
// 类型再导出：业务方可直接 import { TmAffixProps, AffixProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmAffix
