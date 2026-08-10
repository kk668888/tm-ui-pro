// packages/ui/src/components/app/index.ts
// TmApp 出口：withInstall 附加 Vue 插件 install 方法
import App from './src/App.vue'
import { withInstall } from '../../utils/withInstall'

export const TmApp = withInstall(App, 'TmApp')
export default TmApp
