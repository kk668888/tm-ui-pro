import { describe, expect, it } from 'vitest';
import { API_FALLBACK_PATH } from './fallback';

/**
 * 兜底 mock 匹配模式回归测试。
 *
 * 背景：曾用未锚定的 /\/api\/.+/ 匹配，导致含 /api/ 目录段的 Vite 模块路径
 * （如 src/pages/.../api/user.api.ts）被 MSW 当成 API 请求拦截并返回 404，
 * 进而使 UserList / RoleList 页面的动态 import 报
 * "Failed to fetch dynamically imported module"。
 * MSW 对 RegExp 按 pathname（cleanUrl）匹配，故此用例用 pathname 直接断言。
 */
describe('mock 兜底 fallback 匹配模式', () => {
  it('不应拦截含 /api/ 目录段的 Vite 模块请求', () => {
    const modulePaths = [
      '/src/pages/user-management/features/user/api/user.api.ts',
      '/src/pages/user-management/features/role/api/role.api.ts',
      '/src/modules/auth/api/auth.api.ts',
      '/src/pages/user-management/features/user/views/UserList.view.vue',
    ];
    for (const p of modulePaths) {
      expect(API_FALLBACK_PATH.test(p), `模块路径不应命中: ${p}`).toBe(false);
    }
  });

  it('应拦截 pathname 以 /api/ 开头的真实接口请求', () => {
    const apiPaths = [
      '/api/users',
      '/api/users/1',
      '/api/auth/login',
      '/api/auth/refresh',
      '/api/user-management/role/list',
    ];
    for (const p of apiPaths) {
      expect(API_FALLBACK_PATH.test(p), `接口路径应命中: ${p}`).toBe(true);
    }
  });
});
