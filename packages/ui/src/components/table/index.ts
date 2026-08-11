// packages/ui/src/components/table/index.ts
// TmTable 出口：withInstall 附加 Vue 插件 install + 类型 re-export
import Table from './src/Table.vue'
import { withInstall } from '../../utils/withInstall'

/**
 * TmTable 组件（vxe-grid 薄封装 + request 远程扩展）
 * - 业务侧 `app.use(TmTable)` 或 `app.use(@tm/ui)` 全局注册
 * - 也可直接当组件用：`import { TmTable } from '@tm/ui'`
 */
export const TmTable = withInstall(Table, 'TmTable')

// 类型 re-export：业务侧 import type { TmTableProps, TmTableExtProps, VxeGridProps, ... } from '@tm/ui'
export * from './src/props'

export default TmTable

