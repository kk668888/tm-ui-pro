<script setup lang="ts">
/**
 * 大屏副栏。
 *
 * 位于顶栏下方，承载「返回 / 二级标签 / 右侧信息（如系统时间）」。
 * 左缩进 196px 是为了避开侧栏（侧栏宽 186px + 左边距 11px）——
 * 原稿用 margin-left 硬编码实现，这里保留同样的视觉对齐关系。
 */
defineOptions({ name: 'ScreenSubbar' });
</script>

<template>
  <div class="screen-subbar">
    <!-- 返回箭头：不传则整块不占位 -->
    <span class="screen-subbar__back">
      <slot name="back" />
    </span>

    <!-- 二级标签区：放 ScreenChip -->
    <div class="screen-subbar__tabs">
      <slot />
    </div>

    <!-- 右侧：时间、状态等 -->
    <div class="screen-subbar__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<style scoped>
.screen-subbar {
  height: var(--screen-subbar-h);
  margin-left: 196px;
  border-bottom: 1px solid #103f4b;
  display: flex;
  align-items: center;
  position: relative;
}

.screen-subbar__back {
  font-size: 31px;
  color: #76919a;
  opacity: 0.48;
  margin-left: 115px;
  margin-right: 8px;
  cursor: pointer;
  line-height: 1;
}

/* 返回箭头为空时收掉左右外边距，避免副栏左侧出现无谓空白 */
.screen-subbar__back:empty {
  margin: 0;
}

.screen-subbar__tabs {
  display: flex;
  align-items: center;
}

.screen-subbar__extra {
  margin-left: auto;
  margin-right: 21px;
  color: #a5c3cb;
  display: flex;
  align-items: center;
}

@media (max-width: 1300px) {
  .screen-subbar {
    margin-left: 180px;
  }
}
</style>
