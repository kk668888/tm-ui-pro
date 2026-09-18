// packages/ui/src/components/input-password/index.ts
// TmInputPassword 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmInputPassword) 整体注册，也可直接当组件用
import InputPassword from './src/InputPassword.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInputPassword = withInstall(InputPassword, 'TmInputPassword')
// 类型再导出：业务方可直接 import { TmInputPasswordProps, InputProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmInputPassword
