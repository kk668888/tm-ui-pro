// packages/ui/src/components/button/index.ts
// TmButton 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmButton) 整体注册，也可直接当组件用
import Button from './src/Button.vue'
import { withInstall } from '../../utils/withInstall'

export const TmButton = withInstall(Button, 'TmButton')
// 类型再导出：业务方可直接 import { TmButtonProps } from '@kibus/tm-ui-plus'
export * from './src/props'
export default TmButton
