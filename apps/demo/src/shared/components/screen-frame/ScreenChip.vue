<script setup lang="ts">
/**
 * 斜切标签（副栏用）。
 *
 * 原稿的 tabchip 用 skew(-12deg) 做斜切外形，再用内层 span + 反向 skew
 * 把文字「掰正」——这是斜切元素的通用写法：外层斜、内层反斜，否则文字跟着歪。
 */
defineOptions({ name: 'ScreenChip' });

withDefaults(
  defineProps<{
    /** 是否为当前选中项 */
    active?: boolean;
  }>(),
  { active: false },
);
</script>

<template>
  <div :class="['screen-chip', { 'is-active': active }]">
    <span><slot /></span>
  </div>
</template>

<style scoped>
.screen-chip {
  height: 27px;
  line-height: 25px;
  margin-right: 8px;
  padding: 0 45px;
  border: 1px solid #006a8d;
  color: var(--screen-text-muted);
  background: linear-gradient(#07506a, #063847);
  transform: skew(-12deg);
  border-radius: 2px;
  box-shadow: inset 0 0 6px #006b8c;
  cursor: pointer;
  transition:
    color 0.16s,
    border-color 0.16s;
}

/* 外层斜切后，内层反向 skew 把文字摆正 */
.screen-chip > span {
  display: block;
  transform: skew(12deg);
}

.screen-chip:hover {
  border-color: var(--screen-primary);
}

.screen-chip.is-active {
  color: #d9f4fb;
  border-color: #00a3d0;
  font-weight: 700;
}
</style>
