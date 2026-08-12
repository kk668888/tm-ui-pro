import type { App } from 'vue';
import TmUI from '@tm/ui';

/**
 * 注册内部组件库。
 *
 * 组件库已经在自身包内封装了 Ant Design Vue / VXE Table 的二次组件注册逻辑；
 * demo 应用这里只负责挂载 @tm/ui 插件和加载组件库产物样式，避免业务页面重复关心底层依赖。
 */
export function setupTmUi(app: App): void {
  app.use(TmUI);
}
