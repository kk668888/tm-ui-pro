// packages/ui/src/components/table-columns/index.ts
// ant Table 模板写法五件套：列 / 列分组 / 总结栏容器 / 行 / 单元格
//
// 为什么独立目录：components/table/ 是 vxe-table 封装（@trustmo/tm-ui/table 子入口），
// ant 的模板列子组件放进去会混淆两套表格体系；本目录仅承载 ant Table 模板写法能力，
// 注册进主入口（@trustmo/tm-ui）。
//
// 实现方式：ant 顶层导出的别名复用（design D2）——withInstall 原对象附加 install 返回同一引用，
// ant Table 对模板列子组件的识别（vnode.type 全等）不受影响，行为与原生写法一致。
import {
  TableColumn,
  TableColumnGroup,
  TableSummary,
  TableSummaryRow,
  TableSummaryCell,
} from 'ant-design-vue'
import { withInstall } from '../../utils/withInstall'

export const TmTableColumn = withInstall(TableColumn, 'TmTableColumn')
export const TmTableColumnGroup = withInstall(TableColumnGroup, 'TmTableColumnGroup')
export const TmTableSummary = withInstall(TableSummary, 'TmTableSummary')
export const TmTableSummaryRow = withInstall(TableSummaryRow, 'TmTableSummaryRow')
export const TmTableSummaryCell = withInstall(TableSummaryCell, 'TmTableSummaryCell')

export default {
  TmTableColumn,
  TmTableColumnGroup,
  TmTableSummary,
  TmTableSummaryRow,
  TmTableSummaryCell,
}
