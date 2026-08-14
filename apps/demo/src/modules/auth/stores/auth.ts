import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { COPY } from '@/shared/constants/copy';
import { getUserInfo, login as loginApi, logout as logoutApi } from '../api/auth.api';
import type { UserInfo, LoginParams } from '../models/Auth';
import type { MenuItem } from '@/modules/app/config/menuTypes';
import { menuConfig } from '@/modules/app/config/menu.config';

// 本地持久化键：与 core/http 的默认实现（getToken / isTokenExpiring）保持一致
const TOKEN_KEY = 'token';
const REFRESH_TOKEN_KEY = 'refreshToken';
const TOKEN_EXPIRES_AT_KEY = 'tokenExpiresAt';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<UserInfo | null>(null);
  /** 后端下发的菜单树（侧边栏唯一渲染源，取代前端 menu.config 双源） */
  const menus = ref<MenuItem[]>([]);
  const permissionCodes = ref<Set<string>>(new Set());
  const loading = ref(false);
  const error = ref<string | null>(null);
  const initialized = ref(false);

  const isLoggedIn = computed(() => user.value !== null);

  function collectMenuPermissionCodes(items: MenuItem[]): string[] {
    // 研发免登录时复用菜单配置生成路由权限，避免新增页面后还要同步维护一份 dev 权限清单。
    return items.flatMap((item) => {
      const current = item.code ? [item.code] : [];
      const children = item.children ? collectMenuPermissionCodes(item.children) : [];
      return [...current, ...children];
    });
  }

  function setupDevSession() {
    // 该能力只服务本地研发环境。生产环境仍然必须依赖后端登录态、菜单和权限返回值。
    if (!import.meta.env.DEV) return;

    const devPermissions = [
      ...collectMenuPermissionCodes(menuConfig),
      // 按钮级权限不一定都出现在菜单树里，研发环境默认给常用演示按钮权限，方便联调页面交互。
      'UserManagement:delete',
    ];

    user.value = { id: 'dev-user', username: 'dev', avatar: '' };
    menus.value = menuConfig;
    permissionCodes.value = new Set(devPermissions);
    loading.value = false;
    error.value = null;
    initialized.value = true;
  }

  async function fetchUser() {
    if (initialized.value) return;
    loading.value = true;
    error.value = null;
    try {
      // 封装后请求直接返回 ApiResponse<AuthData>，无需再解 axios 外壳
      const res = await getUserInfo();
      if (res.code !== 0) {
        throw new Error(`${COPY.LOGIN.API_ERROR}: ${res.code}`);
      }
      const { user: userInfo, menus: menuTree, permissions } = res.data;
      user.value = userInfo;
      menus.value = menuTree;
      // permissions 含路由 code + 按钮 code，直接作为权限集合（RBAC：菜单管可见，权限管可做）
      permissionCodes.value = new Set(permissions);
    } catch (e: unknown) {
      // 响应拦截器已将 HTTP 401 归一为 HttpError（含 status 字段）；
      // 续期失败时协调器会触发 onUnauthorized，这里仅置空本地用户态
      const err = e as { status?: number; message?: string } | undefined;
      if (err?.status === 401) {
        user.value = null;
      } else {
        error.value = err?.message || COPY.LOGIN.FETCH_USER_FAILED;
      }
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  }

  async function login(params: LoginParams) {
    loading.value = true;
    error.value = null;
    try {
      const res = await loginApi(params);
      if (res.code !== 0) {
        throw new Error(res.message || `${COPY.LOGIN.LOGIN_FAILED}: ${res.code}`);
      }
      // 持久化双 token + 绝对过期时间戳：
      // - accessToken → 请求拦截器附加 Authorization 头；
      // - refreshToken → 续期协调器换取新 accessToken；
      // - tokenExpiresAt → 请求拦截器判断是否临近过期、主动刷新。
      const { accessToken, refreshToken, expiresIn } = res.data;
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      localStorage.setItem(TOKEN_EXPIRES_AT_KEY, String(Date.now() + expiresIn * 1000));
      initialized.value = false;
      await fetchUser();
    } catch (e: unknown) {
      error.value =
        (e as { message?: string } | undefined)?.message || COPY.LOGIN.LOGIN_FAILED;
      throw e;
    } finally {
      loading.value = false;
    }
  }

  /**
   * 同步清空本地会话（凭证 + 用户态），不发起服务端登出请求。
   * 供 onUnauthorized（token 续期失败）等「必须立即失效本地态」的场景使用：
   * 先同步清态保证 UI 不再使用旧 token，服务端登出通知由 logout() 后台完成。
   */
  function clearLocalSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRES_AT_KEY);
    user.value = null;
    menus.value = [];
    permissionCodes.value = new Set();
    loading.value = false;
    initialized.value = false;
    error.value = null;
  }

  async function logout() {
    try {
      await logoutApi();
    } catch {
      // ignore：登出接口失败不阻断本地清态
    }
    // 清除本地全部凭证，避免下次请求仍携带失效 token
    clearLocalSession();
  }

  function hasPermission(code: string): boolean {
    return permissionCodes.value.has(code);
  }

  return {
    user,
    menus,
    permissionCodes,
    loading,
    error,
    initialized,
    isLoggedIn,
    setupDevSession,
    fetchUser,
    login,
    logout,
    clearLocalSession,
    hasPermission,
  };
});
