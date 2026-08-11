import type { RouteRecordRaw } from 'vue-router';

/**
 * TM 组件陈列域路由（dev-only，见 bootstrap/router.ts DEV 分支）。
 * name 用字符串字面量：ROUTE_NAMES.TmComponents 由 route-names 插件扫描本文件自动生成。
 */
export const tmComponentsRoutes: RouteRecordRaw[] = [
  {
    path: '/tm-components',
    name: 'TmComponents',
    meta: { code: 'TmComponents', title: 'TM 组件' },
    component: () => import('./pages/TmComponents.page.vue'),
  },
];
