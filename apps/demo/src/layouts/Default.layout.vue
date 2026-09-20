<script setup lang="ts">
/**
 * 默认布局（管理系统外壳）
 * ---------------------------------------------------------------------------
 * 外壳采用大屏的四段式骨架（顶栏 / 副栏 / 侧栏 / 工作区），来自 ScreenFrame；
 * 业务内容仍由 router-view 渲染，各页面本身不做任何改动。
 *
 * 相比改造前的 a-layout 版本，这里保留了全部既有能力：
 *   · 侧边栏菜单（后端下发的 authStore.menus 为唯一真相源）+ 选中态
 *   · 侧边栏折叠
 *   · 多标签 TabBar
 *   · 主题切换 / 用户名 / 登出
 *   · ErrorBoundary 包裹 + keep-alive 按组件名缓存
 *
 * fit=false 是关键：大屏原稿是固定 2048×1088 画布 + 整体缩放，
 * 而管理系统必须跟随窗口自适应，因此让画布撑满容器、不做缩放。
 */
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { MenuFoldOutlined, MenuUnfoldOutlined, LogoutOutlined } from '@ant-design/icons-vue';
import { useAppStore } from '@/modules/app/stores/app';
import { useAuthStore } from '@/modules/auth/stores/auth';
import { useTabStore, TabBar } from '@/layouts/tab';
import ErrorBoundary from '@/shared/components/error-boundary/ErrorBoundary.vue';
import ThemeSwitcher from '@/shared/components/theme-switcher/ThemeSwitcher.vue';
import ScreenFrame from '@/shared/components/screen-frame/ScreenFrame.vue';
import ScreenNavItem from '@/shared/components/screen-frame/ScreenNavItem.vue';
import ScreenSideItem from '@/shared/components/screen-frame/ScreenSideItem.vue';
import type { MenuItem } from '@/modules/app/config/menuTypes';

defineOptions({ name: 'DefaultLayout' });

const appStore = useAppStore();
const authStore = useAuthStore();
const tabStore = useTabStore();
const route = useRoute();
const router = useRouter();

/**
 * 菜单直接渲染后端下发的菜单树（authStore.menus 为唯一真相源）。
 * 后端按用户角色已过滤，前端不再需要本地 filterMenu / menuConfig 双源。
 */
const menus = computed(() => authStore.menus);

/**
 * 拍平菜单树。
 * 大屏骨架的导航项是扁平的（不像 a-menu 有内建的多级缩进），
 * 因此二级项平铺展开；顶栏与侧栏共用这一份数据。
 */
const flatMenus = computed<MenuItem[]>(() => {
  const out: MenuItem[] = [];
  for (const item of menus.value) {
    out.push(item);
    if (item.children?.length) out.push(...item.children);
  }
  return out;
});

/** 选中态与路由 name 对齐（后端菜单的 routeName 即路由 name） */
function isActive(item: MenuItem): boolean {
  return Boolean(item.routeName) && item.routeName === route.name;
}

function handleNav(item: MenuItem): void {
  if (item.routeName) router.push({ name: item.routeName });
}

async function handleLogout(): Promise<void> {
  await authStore.logout();
  router.push('/login');
}
</script>

<template>
  <!-- height:100vh + overflow:hidden：外层固定一屏高，滚动交给 ScreenFrame 的工作区 -->
  <div :class="['app-shell', { 'app-shell--collapsed': appStore.sidebarCollapsed }]">
    <ScreenFrame :fit="false">
      <!-- 顶栏：品牌 + 主导航 + 全局操作 -->
      <template #brand>{{ appStore.appName }}</template>

      <template #nav>
        <ScreenNavItem
          v-for="item in flatMenus"
          :key="item.routeName ?? item.label"
          :active="isActive(item)"
          @click="handleNav(item)"
        >
          {{ item.label }}
        </ScreenNavItem>
      </template>

      <template #actions>
        <ThemeSwitcher />
        <span v-if="authStore.user" class="app-shell__user">{{ authStore.user.username }}</span>
        <TmButton type="text" @click="handleLogout">
          <template #icon><LogoutOutlined /></template>
        </TmButton>
      </template>

      <!-- 副栏：折叠开关 + 多标签 + 右侧留白 -->
      <template #back>
        <TmButton type="text" size="small" @click="appStore.toggleSidebar">
          <template #icon>
            <MenuFoldOutlined v-if="!appStore.sidebarCollapsed" />
            <MenuUnfoldOutlined v-else />
          </template>
        </TmButton>
      </template>

      <template #chips>
        <TabBar />
      </template>

      <!-- 侧栏：主导航（竖向） -->
      <template #sidebar>
        <ScreenSideItem
          v-for="item in flatMenus"
          :key="item.routeName ?? item.label"
          :active="isActive(item)"
          :expandable="Boolean(item.children?.length)"
          @click="handleNav(item)"
        >
          {{ item.label }}
        </ScreenSideItem>
      </template>

      <!-- 工作区：业务页面。ErrorBoundary 捕获渲染异常 → 显示 fallback，保留外壳不白屏 -->
      <ErrorBoundary>
        <router-view v-slot="{ Component }">
          <!--
            keep-alive 按组件 name 缓存（tabStore.cachedNames 与路由 name 对齐）。
            不能给 <component> 加 :key="$route.fullPath"——key 含 query 时
            `/list?page=2` 与 `/list` 是两个实例，往返即重建，缓存永远命中不了。
          -->
          <keep-alive :include="tabStore.cachedNames">
            <component :is="Component" v-if="!tabStore.isExcluded($route.name as string)" />
          </keep-alive>
          <div v-if="tabStore.isExcluded($route.name as string)" class="app-shell__loading">
            <a-spin tip="刷新中..." />
          </div>
        </router-view>
      </ErrorBoundary>
    </ScreenFrame>
  </div>
</template>

<style scoped>
.app-shell {
  height: 100vh;
  overflow: hidden;
}

.app-shell__user {
  color: var(--screen-text);
  font-size: 14px;
}

.app-shell__loading {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px 0;
}

/*
 * 副栏默认给返回箭头留了 115px 左边距（原稿的位置），
 * 这里放的是侧栏折叠开关，改回贴左对齐。
 */
.app-shell :deep(.screen-subbar__back) {
  margin-left: 16px;
  margin-right: 16px;
}

/* TabBar 自带背景与内边距，是为「顶栏下方独立一行」设计的；
   放进副栏后去掉，避免在副栏里叠出第二层底色。 */
.app-shell :deep(.screen-subbar .tab-bar) {
  padding: 0;
  background: transparent;
}

/* 折叠态：隐藏侧栏，并把副栏与工作区左边界收回，腾出横向空间 */
.app-shell--collapsed :deep(.screen-sidebar) {
  display: none;
}

.app-shell--collapsed :deep(.screen-subbar) {
  margin-left: 0;
}

.app-shell--collapsed :deep(.screen-frame__workspace) {
  left: 24px;
}
</style>
