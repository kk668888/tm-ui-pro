<script setup lang="ts">
/**
 * 大屏顶栏。
 *
 * 三段式：品牌区（固定宽）/ 导航区（占满剩余）/ 动作区（贴右）。
 * 内容全部留空——品牌文案、导航项、右侧图标由使用方通过插槽填充。
 */
defineOptions({ name: 'ScreenTopbar' });
</script>

<template>
  <header class="screen-topbar">
    <!-- 品牌区：原稿为斜切色块 + 发光文字，这里只保留容器与装饰 -->
    <div class="screen-topbar__brand">
      <slot name="brand" />
    </div>

    <!-- 导航区：放 ScreenNavItem -->
    <nav class="screen-topbar__nav">
      <slot name="nav" />
    </nav>

    <!-- 动作区：图标、头像等 -->
    <div class="screen-topbar__actions">
      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.screen-topbar {
  display: flex;
  align-items: center;
  height: var(--screen-topbar-h);
  border-bottom: 2px solid #04749a;
  background: linear-gradient(180deg, #052834, #06232c 62%, #062b36);
  box-shadow: 0 2px 14px #001217;
  position: relative;
  z-index: 5;
}

/*
 * 品牌区固定宽度：导航项数量变化时不挤压品牌区，保持左侧视觉重量稳定。
 * 斜切装饰条用 :after + skew 还原原稿的工业感切角。
 */
.screen-topbar__brand {
  width: 430px;
  height: 100%;
  padding: 13px 28px;
  color: #d4f4ff;
  font-size: 28px;
  font-weight: 700;
  font-style: italic;
  letter-spacing: 1px;
  text-shadow: 0 0 7px #70dfff;
  background: linear-gradient(120deg, rgba(0, 162, 207, 0.23), transparent 75%);
  position: relative;
  white-space: nowrap;
  overflow: hidden;
}

.screen-topbar__brand::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 15px;
  width: 18px;
  height: 42px;
  border-left: 5px solid #008db7;
  transform: skew(-27deg);
  box-shadow:
    -10px 0 #06566d,
    -20px 0 #093f51;
}

.screen-topbar__nav {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 72px;
  gap: 41px;
  white-space: nowrap;
  color: var(--screen-text-muted);
  font-weight: 700;
  font-size: 16px;
}

.screen-topbar__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 28px;
  padding-right: 28px;
  color: var(--screen-primary-strong);
  font-size: 23px;
}

/* 窄屏收紧间距，避免导航换行（原稿的响应式断点） */
@media (max-width: 1300px) {
  .screen-topbar__brand {
    width: 300px;
    font-size: 22px;
  }

  .screen-topbar__nav {
    gap: 20px;
    padding-left: 40px;
    font-size: 14px;
  }
}
</style>
