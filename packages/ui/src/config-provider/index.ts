// packages/ui/src/config-provider/index.ts
// TmConfigProvider 出口：通过 withInstall 包装，使其可被 app.use 整体注册
import ConfigProvider from './ConfigProvider.vue'
import { withInstall } from '../utils/withInstall'

/**
 * TmConfigProvider：带 install 方法的 ConfigProvider 组件
 *
 * 用法：
 *   import { TmConfigProvider } from '@tm/ui'
 *   app.use(TmConfigProvider)            // 全局注册
 *   // 或在模板中直接使用 <TmConfigProvider>...</TmConfigProvider>
 */
export const TmConfigProvider = withInstall(ConfigProvider, 'TmConfigProvider')

export default TmConfigProvider
