<script setup lang="ts">
/**
 * 大屏侧栏。
 *
 * 绝对定位贴在左侧（原稿用 absolute 而非 flex 布局），
 * 内容由使用方通过默认插槽传入 ScreenSideItem 列表。
 */
defineOptions({ name: 'ScreenSidebar' });
</script>

<template>
  <aside class="screen-sidebar">
    <div class="screen-sidebar__list">
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.screen-sidebar {
  position: absolute;
  left: 11px;
  top: 64px;
  bottom: 0;
  width: var(--screen-sider-w);
  border-right: 1px solid #094453;
  background: var(--screen-bg-sider);
  padding-top: 51px;
}

@media (max-width: 1300px) {
  .screen-sidebar {
    width: 180px;
  }
}
</style>
