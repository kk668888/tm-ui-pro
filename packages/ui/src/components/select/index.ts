// packages/ui/src/components/select/index.ts
// TmSelect 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmSelect) 整体注册，也可直接当组件用
import Select from './src/Select.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSelect = withInstall(Select, 'TmSelect')
// 类型再导出：业务方可直接 import { TmSelectProps, TmSelectExtProps, SelectProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmSelect
