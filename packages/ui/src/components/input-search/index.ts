// packages/ui/src/components/input-search/index.ts
// TmInputSearch 出口：通过 withInstall 附加 Vue 插件 install 方法
import InputSearch from './src/InputSearch.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInputSearch = withInstall(InputSearch, 'TmInputSearch')
// 类型再导出：业务方可直接 import { TmInputSearchProps, InputProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmInputSearch
