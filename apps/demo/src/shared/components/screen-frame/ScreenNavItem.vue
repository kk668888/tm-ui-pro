<script setup lang="ts">
/**
 * 顶栏导航项。
 *
 * 激活态还原原稿的「发光文字 + 两侧黄色菱形」——这是该设计语言里
 * 表示「当前所在模块」的核心手法，不用下划线也不用背景块。
 */
defineOptions({ name: 'ScreenNavItem' });

withDefaults(
  defineProps<{
    /** 是否为当前激活项 */
    active?: boolean;
  }>(),
  { active: false },
);
</script>

<template>
  <span :class="['screen-nav-item', { 'is-active': active }]">
    <slot />
  </span>
</template>

<style scoped>
.screen-nav-item {
  position: relative;
  cursor: pointer;
  transition: color 0.16s;
}

.screen-nav-item:hover {
  color: var(--screen-primary-bright);
}

.screen-nav-item.is-active {
  color: #e9fbff;
  text-shadow: 0 0 7px #fff;
}

/* 两侧菱形：用伪元素而非额外标签，保证插槽内容不被污染 */
.screen-nav-item.is-active::before,
.screen-nav-item.is-active::after {
  content: '◆';
  position: absolute;
  top: 5px;
  color: var(--screen-accent);
  font-size: 9px;
}

.screen-nav-item.is-active::before {
  left: -22px;
}

.screen-nav-item.is-active::after {
  right: -22px;
}
</style>
