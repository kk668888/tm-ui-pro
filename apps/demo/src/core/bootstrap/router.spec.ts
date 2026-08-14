import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';

/**
 * 守卫端到端回归测试。
 *
 * 守卫依赖 auth store（pinia）与 auth.api.getUserInfo（fetchUser 内部调用）。
 * 这里 mock auth.api、用真实 router 实例触发导航，验证「登录后落地页」决策：
 *   - 已登录访问根 / → 必须重定向到首个业务菜单（修复登录后白屏）；
 *   - 已登录但无任何菜单 → 跳 /403（避免落到 / 内容区空白，或与自身形成重定向死循环）。
 *
 * 说明：业务页面为懒加载 `() => import(...)`，vue-router 在导航阶段只更新 matched 记录、
 * 不实例化组件（组件在 <router-view> 渲染时才解析），故 push 不会触发重量级页面加载，测试轻量稳定。
 */
vi.mock('@/modules/auth/api/auth.api', () => ({
  login: vi.fn(),
  getUserInfo: vi.fn(),
  logout: vi.fn(),
  refreshAccessToken: vi.fn(),
  setCaptchaAnswer: vi.fn(),
}));

import { getUserInfo } from '@/modules/auth/api/auth.api';
import { router } from './router';
import type { MenuItem } from '@/modules/app/config/menuTypes';

// 构造后端下发的菜单树（仅守卫关心的字段）
const buildMenus = (items: Partial<MenuItem>[]): MenuItem[] => items as MenuItem[];

// 让 getUserInfo 返回指定菜单树（fetchUser 成功路径：code === 0）
function mockUserInfo(menus: MenuItem[], permissions: string[] = []) {
  (getUserInfo as unknown as { mockResolvedValue: (v: unknown) => void }).mockResolvedValue({
    code: 0,
    data: { user: { id: 1, username: 'admin' }, menus, permissions },
  });
}

describe('router 全局守卫 —— 登录后落地页决策', () => {
  beforeEach(() => {
    // 每个用例独立 pinia：守卫内 useAuthStore() 据此取全新 store（initialized=false → 重新 fetchUser）
    setActivePinia(createPinia());
    vi.clearAllMocks();
    // 关闭研发免登录分支：本组用例验证真实守卫决策（mock 后端菜单树驱动），
    // 而非 dev bypass 的本地菜单兜底（否则「无菜单 → /403」等用例永远被 bypass 覆盖）。
    vi.stubEnv('VITE_DEV_AUTH_BYPASS', 'false');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // 注意：全量并发（32 个 spec 同跑）时本文件含真实 router + 懒加载路由的导航链路，
  // 单用例可能超过 vitest 默认 5s 超时（实测单文件 ~2s、并发下偶发 >5s），统一放宽到 15s。
  const ROUTER_SPEC_TIMEOUT = 15_000;

  it('已登录访问根 / 时，重定向到首个业务菜单（修复登录后 / 白屏）', async () => {
    mockUserInfo(
      buildMenus([
        { label: '用户管理', code: 'UserManagement', routeName: 'UserManagement' },
        { label: '主题预览', code: 'ThemePreview', routeName: 'ThemePreview' },
      ]),
      ['UserManagement', 'ThemePreview'],
    );

    await router.push('/');

    // 期望落到首个菜单 UserManagement，而非停留在空白的 /
    expect(router.currentRoute.value.name).toBe('UserManagement');
    expect(router.currentRoute.value.path).toBe('/user-management');
  }, ROUTER_SPEC_TIMEOUT);

  it('已登录但无任何菜单时，访问 / 跳 /403（避免 / 白屏与重定向死循环）', async () => {
    mockUserInfo([], []);

    await router.push('/');

    expect(router.currentRoute.value.path).toBe('/403');
  }, ROUTER_SPEC_TIMEOUT);

  it('已登录访问具体业务路由时，正常放行、不做重定向', async () => {
    mockUserInfo(
      buildMenus([{ label: '用户管理', code: 'UserManagement', routeName: 'UserManagement' }]),
      ['UserManagement'],
    );

    await router.push('/user-management');

    expect(router.currentRoute.value.name).toBe('UserManagement');
    expect(router.currentRoute.value.path).toBe('/user-management');
  }, ROUTER_SPEC_TIMEOUT);

  it('有 token 但 fetchUser 非 401 失败时 → /403（而非误送登录页）', async () => {
    // 回归背景：守卫原判定顺序「未登录 → login」先于「拉取失败 → /403」，
    // 导致 fetchUser 非 401 失败（user=null + error 设置）时被误送登录页，/403 分支不可达。
    (getUserInfo as unknown as { mockRejectedValue: (v: unknown) => void }).mockRejectedValue(
      new Error('服务器错误'),
    );

    // 先导航到其他路径，避免与上一用例的 currentRoute 相同触发 vue-router duplicated navigation
    // （重复导航不执行守卫，无法验证本用例）。
    await router.push('/login');
    await router.push('/user-management');

    expect(router.currentRoute.value.path).toBe('/403');
  }, ROUTER_SPEC_TIMEOUT);
});
