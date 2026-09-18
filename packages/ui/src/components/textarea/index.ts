// packages/ui/src/components/textarea/index.ts
// TmTextarea 出口：通过 withInstall 附加 Vue 插件 install 方法
import Textarea from './src/Textarea.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTextarea = withInstall(Textarea, 'TmTextarea')
// 类型再导出：业务方可直接 import { TmTextareaProps, TextAreaProps } from '@trustmo/tm-ui'
export * from './src/props'
export default TmTextarea
