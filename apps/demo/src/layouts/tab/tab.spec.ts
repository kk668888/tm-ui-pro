import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTabStore } from './tab';
import type { RouteLocationNormalizedLoaded, Router } from 'vue-router';

function mockRoute(
  overrides: Partial<RouteLocationNormalizedLoaded> & { name: string; path: string },
): RouteLocationNormalizedLoaded {
  return {
    fullPath: overrides.fullPath ?? overrides.path,
    hash: '',
    matched: [],
    meta: overrides.meta ?? { title: overrides.name },
    name: overrides.name,
    params: overrides.params ?? {},
    path: overrides.path,
    query: overrides.query ?? {},
    // 测试构造的 RouteLocation 与真实类型不完全重叠，经 unknown 中转断言
  } as unknown as RouteLocationNormalizedLoaded;
}

// 仅 mock push 的 Router：tab store 的 actions 只消费 router.push。
// 用 vi.mocked 包装以保留 mock 方法类型（mockClear 等）。
const router = { push: vi.fn() } as unknown as Router;
const mockedPush = vi.mocked(router.push);

beforeEach(() => {
  setActivePinia(createPinia());
  mockedPush.mockClear();
});

describe('useTabStore — key as route.path', () => {
  it('addTab uses route.path as key', () => {
    const store = useTabStore();
    const route = mockRoute({ name: 'UserDetail', path: '/user/123' });
    store.addTab(route);
    expect(store.tabs[0].key).toBe('/user/123');
    expect(store.tabs[0].name).toBe('UserDetail');
  });

  it('same route name different path creates separate tabs', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'UserDetail', path: '/user/1' }));
    store.addTab(mockRoute({ name: 'UserDetail', path: '/user/2' }));
    expect(store.tabs).toHaveLength(2);
    expect(store.tabs[0].key).toBe('/user/1');
    expect(store.tabs[1].key).toBe('/user/2');
  });

  it('same path does not duplicate tab', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    expect(store.tabs).toHaveLength(1);
  });

  it('title uses _tabTitle query param when present', () => {
    const store = useTabStore();
    const route = mockRoute({
      name: 'OrderDetail',
      path: '/order/123',
      query: { _tabTitle: '订单 #123 详情' },
      meta: { title: '订单详情' },
    });
    store.addTab(route);
    expect(store.tabs[0].title).toBe('订单 #123 详情');
  });

  it('title falls back to meta.title', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home', meta: { title: '首页' } }));
    expect(store.tabs[0].title).toBe('首页');
  });

  it('title falls back to route.name', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home', meta: {} }));
    expect(store.tabs[0].title).toBe('Home');
  });
});

describe('useTabStore — closeTab visitedOrder navigation', () => {
  it('closeTab navigates to previously visited tab', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'User', path: '/user' }));
    store.addTab(mockRoute({ name: 'Order', path: '/order' }));

    store.closeTab('/order', router);
    expect(store.activeTab).toBe('/user');
    expect(mockedPush).toHaveBeenCalledWith('/user');
  });

  it('closeTab skips removed tabs in visitedOrder', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'User', path: '/user' }));
    store.addTab(mockRoute({ name: 'Order', path: '/order' }));
    store.closeTab('/user', router);

    store.addTab(mockRoute({ name: 'User', path: '/user' }));
    store.addTab(mockRoute({ name: 'Order', path: '/order' }));

    store.closeTab('/order', router);
    expect(store.activeTab).toBe('/user');
  });

  it('closeTab falls back to / when no tabs remain', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.closeTab('/home', router);
    expect(mockedPush).toHaveBeenCalledWith('/');
  });

  it('closeLeftTabs removes tabs to the left', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'User', path: '/user' }));
    store.addTab(mockRoute({ name: 'Order', path: '/order' }));

    store.closeLeftTabs('/order', router);
    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].key).toBe('/order');
    expect(store.activeTab).toBe('/order');
    expect(store.visitedOrder).toEqual(['/order']);
  });

  it('closeRightTabs removes tabs to the right', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'User', path: '/user' }));
    store.addTab(mockRoute({ name: 'Order', path: '/order' }));

    store.closeRightTabs('/home', router);
    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].key).toBe('/home');
    expect(store.activeTab).toBe('/home');
    expect(store.visitedOrder).toEqual(['/home']);
  });

  it('closeOtherTabs keeps only the target', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'User', path: '/user' }));
    store.addTab(mockRoute({ name: 'Order', path: '/order' }));

    store.closeOtherTabs('/user', router);
    expect(store.tabs).toHaveLength(1);
    expect(store.tabs[0].key).toBe('/user');
    expect(store.activeTab).toBe('/user');
    expect(store.visitedOrder).toEqual(['/user']);
  });

  it('closeAllTabs clears everything', () => {
    const store = useTabStore();
    store.addTab(mockRoute({ name: 'Home', path: '/home' }));
    store.addTab(mockRoute({ name: 'User', path: '/user' }));

    store.closeAllTabs(router);
    expect(store.tabs).toHaveLength(0);
    expect(store.visitedOrder).toHaveLength(0);
    expect(mockedPush).toHaveBeenCalledWith('/');
  });
});

describe('useTabStore — refreshTab', () => {
  it('refreshTab excludes and restores cache by name', async () => {
    const store = useTabStore();
    store.addTab(
      mockRoute({ name: 'Home', path: '/home', meta: { title: '首页', keepAlive: true } }),
    );

    expect(store.cachedNames).toContain('Home');
    await store.refreshTab('/home');
    expect(store.cachedNames).toContain('Home');
  });
});
