// packages/ui/src/components/grid/index.ts
// TmGrid 出口：TmRow / TmCol 多子组件模块，按 form 模块形态组织
// 设计要点：
// - 命名导出 TmRow / TmCol：src/index.ts 聚合时分别注册，确保 app.use(@kibus/tm-ui-plus) 后两者均可用。
// - default export 提供对象形态 { TmRow, TmCol }，便于直接 import grid from '.../grid' 后解构使用。
import Row from './src/Row.vue'
import Col from './src/Col.vue'
import { withInstall } from '../../utils/withInstall'

export const TmRow = withInstall(Row, 'TmRow')
export const TmCol = withInstall(Col, 'TmCol')

// 类型透传：业务方可直接 import { RowProps, ColProps, TmRowProps, TmColProps } from '@kibus/tm-ui-plus'
export type { RowProps, ColProps } from 'ant-design-vue'
export type { TmRowProps, TmColProps } from './src/props'

export default { TmRow, TmCol }
