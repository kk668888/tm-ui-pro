// packages/ui/src/components/float-button/index.ts
// TmFloatButton 出口：TmFloatButton / TmFloatButtonGroup / TmFloatButtonBackTop 多子组件模块
import FloatButton from './src/FloatButton.vue'
import FloatButtonGroup from './src/FloatButtonGroup.vue'
import FloatButtonBackTop from './src/FloatButtonBackTop.vue'
import { withInstall } from '../../utils/withInstall'

export const TmFloatButton = withInstall(FloatButton, 'TmFloatButton')
export const TmFloatButtonGroup = withInstall(FloatButtonGroup, 'TmFloatButtonGroup')
export const TmFloatButtonBackTop = withInstall(FloatButtonBackTop, 'TmFloatButtonBackTop')

// 类型再导出：业务方可直接 import { TmFloatButtonProps, TmFloatButtonGroupProps, TmFloatButtonBackTopProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default { TmFloatButton, TmFloatButtonGroup, TmFloatButtonBackTop }
