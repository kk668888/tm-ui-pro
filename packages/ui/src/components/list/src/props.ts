// packages/ui/src/components/list/src/props.ts
// TmList 类型定义：ant 原生 ListProps / ListItemProps / ListItemMetaProps
import type { ListProps, ListItemProps, ListItemMetaProps } from 'ant-design-vue'

/** TmList = ant 原生 ListProps */
export type TmListProps = ListProps
/** TmListItem = ant 原生 ListItemProps */
export type TmListItemProps = ListItemProps
/** TmListItemMeta = ant 原生 ListItemMetaProps */
export type TmListItemMetaProps = ListItemMetaProps

// 类型透传：业务方可直接 import TmListProps / TmListItemProps / TmListItemMetaProps / ListProps ...
export type { ListProps, ListItemProps, ListItemMetaProps } from 'ant-design-vue'
