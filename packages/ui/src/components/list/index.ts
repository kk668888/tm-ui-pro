// packages/ui/src/components/list/index.ts
// TmList 出口：TmList / TmListItem / TmListItemMeta 多子组件模块
import List from './src/List.vue'
import ListItem from './src/ListItem.vue'
import ListItemMeta from './src/ListItemMeta.vue'
import { withInstall } from '../../utils/withInstall'

export const TmList = withInstall(List, 'TmList')
export const TmListItem = withInstall(ListItem, 'TmListItem')
export const TmListItemMeta = withInstall(ListItemMeta, 'TmListItemMeta')

// 类型再导出：业务方可直接 import { TmListProps, TmListItemProps, TmListItemMetaProps, ListProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmList, TmListItem, TmListItemMeta }
