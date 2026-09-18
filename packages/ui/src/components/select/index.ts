// packages/ui/src/components/select/index.ts
// TmSelect 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmSelect) 整体注册，也可直接当组件用
import Select from './src/Select.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSelect = withInstall(Select, 'TmSelect')

// 模板子组件写法：ant 顶层导出别名复用（见 src/options.ts 的 D2 决策注释）
export { TmSelectOption, TmSelectOptGroup } from './src/options'

// 类型再导出：显式列举（不能用 `export *`，与组件值导出混排时语义不清）。
// 注：选项项数据结构类型为 TmSelectOptionItem（原名 TmSelectOption 与下方组件值导出撞名，
// 同一模块不允许同名值与类型并列导出，TS2300——已按「组件名对齐 ant 生态」优先更名）
export type {
  TmSelectOptionItem,
  TmSelectRemote,
  TmSelectApi,
  TmSelectFieldNames,
  TmSelectProps,
  TmSelectExtProps,
  SelectProps,
} from './src/props'

export default TmSelect
