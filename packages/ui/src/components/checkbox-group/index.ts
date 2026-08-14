// packages/ui/src/components/checkbox-group/index.ts
// TmCheckboxGroup 出口：withInstall 附加 Vue 插件 install 方法
import CheckboxGroup from './src/CheckboxGroup.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCheckboxGroup = withInstall(CheckboxGroup, 'TmCheckboxGroup')
// 类型再导出：业务方可直接 import { TmCheckboxGroupProps, CheckboxGroupProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmCheckboxGroup
