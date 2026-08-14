// packages/ui/src/components/pagination/index.ts
// TmPagination 出口：withInstall 附加 Vue 插件 install 方法
import Pagination from './src/Pagination.vue'
import { withInstall } from '../../utils/withInstall'

export const TmPagination = withInstall(Pagination, 'TmPagination')
// 类型再导出：业务方可直接 import { TmPaginationProps, PaginationProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmPagination
