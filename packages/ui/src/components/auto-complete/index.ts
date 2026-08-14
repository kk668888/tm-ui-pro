// packages/ui/src/components/auto-complete/index.ts
// TmAutoComplete 出口：withInstall 附加 Vue 插件 install 方法
import AutoComplete from './src/AutoComplete.vue'
import { withInstall } from '../../utils/withInstall'

export const TmAutoComplete = withInstall(AutoComplete, 'TmAutoComplete')
// 类型再导出：业务方可直接 import { TmAutoCompleteProps, AutoCompleteProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmAutoComplete
