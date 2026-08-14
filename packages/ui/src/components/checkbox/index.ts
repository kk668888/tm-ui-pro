// packages/ui/src/components/checkbox/index.ts
// TmCheckbox 出口：withInstall 附加 Vue 插件 install 方法
// 注意：本目录为「单 Checkbox」，与既有 checkbox-group 目录并列；组场景用 TmCheckboxGroup。
import Checkbox from './src/Checkbox.vue'
import { withInstall } from '../../utils/withInstall'

export const TmCheckbox = withInstall(Checkbox, 'TmCheckbox')
// 类型再导出：业务方可直接 import { TmCheckboxProps, CheckboxProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmCheckbox
