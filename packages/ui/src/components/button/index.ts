// packages/ui/src/components/button/index.ts
// TmButton 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmButton) 整体注册，也可直接当组件用
import Button from './src/Button.vue'
import { withInstall } from '../../utils/withInstall'

export const TmButton = withInstall(Button, 'TmButton')
// 按钮组：ant 顶层导出 ButtonGroup 别名复用（design D2）
import { ButtonGroup } from 'ant-design-vue'

export const TmButtonGroup = withInstall(ButtonGroup, 'TmButtonGroup')
// 类型再导出：业务方可直接 import { TmButtonProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmButton
