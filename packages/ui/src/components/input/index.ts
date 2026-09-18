// packages/ui/src/components/input/index.ts
// TmInput 出口：通过 withInstall 附加 Vue 插件 install 方法
// 既可 app.use(TmInput) 整体注册，也可直接当组件用
import Input from './src/Input.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInput = withInstall(Input, 'TmInput')
// 组合容器：ant 顶层导出 InputGroup 别名复用（design D2）
import { InputGroup } from 'ant-design-vue'

export const TmInputGroup = withInstall(InputGroup, 'TmInputGroup')
// 类型再导出：业务方可直接 import { TmInputProps, InputProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmInput
