<script setup lang="ts">
/**
 * 侧栏项。
 *
 * 未选中：左侧圆点 + 常规文字。
 * 选中：整项变为「箭头形」——用 clip-path 切出左侧尖角，并叠加青色渐变与上下描边。
 *       选中态刻意隐藏圆点（圆点与尖角语义重复）。
 */
defineOptions({ name: 'ScreenSideItem' });

withDefaults(
  defineProps<{
    /** 是否为当前选中项 */
    active?: boolean;
    /** 是否显示右侧展开箭头 */
    expandable?: boolean;
  }>(),
  { active: false, expandable: false },
);
</script>

<template>
  <div :class="['screen-side-item', { 'is-active': active }]">
    <span class="screen-side-item__label"><slot /></span>

    <span v-if="expandable" class="screen-side-item__chev">▶</span>
  </div>
</template>

<style scoped>
.screen-side-item {
  height: 44px;
  display: flex;
  align-items: center;
  padding-left: 13px;
  color: var(--screen-text-muted);
  font-weight: 700;
  cursor: pointer;
  transition: color 0.16s;
}

/* 未选中态的圆点标记 */
.screen-side-item::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #4fa5b6;
  margin-right: 14px;
  flex: 0 0 auto;
}

.screen-side-item:hover {
  color: var(--screen-primary-bright);
}

.screen-side-item__chev {
  margin-left: auto;
  margin-right: 17px;
  color: #a9bec4;
  font-size: 10px;
}

/*
 * 选中态：右移 35px 并收窄到 125px，形成「缩进 + 箭头指向」的视觉，
 * clip-path 左侧 15px 处切出 45° 尖角（0 50% 表示左边中点）。
 */
.screen-side-item.is-active {
  margin-left: 35px;
  width: 125px;
  padding-left: 22px;
  color: #00b4e2;
  border-top: 1px solid #07647c;
  border-bottom: 1px solid #07647c;
  background: linear-gradient(90deg, rgba(0, 138, 180, 0.18), transparent);
  clip-path: polygon(15px 0, 100% 0, 100% 100%, 15px 100%, 0 50%);
}

/* 圆点与尖角语义重复，选中态隐藏 */
.screen-side-item.is-active::before {
  display: none;
}
</style>
