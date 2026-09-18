// packages/ui/src/components/auto-complete/index.ts
// TmAutoComplete 出口：withInstall 附加 Vue 插件 install 方法
import AutoComplete from './src/AutoComplete.vue'
import { withInstall } from '../../utils/withInstall'

export const TmAutoComplete = withInstall(AutoComplete, 'TmAutoComplete')
// 模板子组件写法：ant 顶层导出别名复用（同 select/src/options.ts 的 D2 决策）
export { TmAutoCompleteOption, TmAutoCompleteOptGroup } from './src/options'
// 类型再导出：业务方可直接 import { TmAutoCompleteProps, AutoCompleteProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmAutoComplete
