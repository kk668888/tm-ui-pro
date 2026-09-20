<script setup lang="ts">
/**
 * 大屏框架壳（ScreenFrame）
 * ---------------------------------------------------------------------------
 * 提炼自 release/index.html 的设计稿，只保留**框架与主题**，不含任何业务内容：
 *   ① 四段式布局：顶栏 / 副栏 / 侧栏 / 工作区
 *   ② 收敛后的深色科技风主题（见 screen-frame.tokens.css）
 * 业务内容一律通过插槽注入，组件本身不渲染任何文案与字段。
 *
 * 【与原稿的关键差异：结构固化】
 * 原稿在页面加载后用一段 JS **重写 DOM**：给卡片改 order、把元素搬来搬去、
 * 甚至 `remove()` 掉一整张卡片、再 createElement 生成分组标签。
 * 那样每次改动都只能在运行时试，无法维护。这里把布局全部写成静态模板，
 * 运行时只剩「缩放适配」这一件行为逻辑（useScreenScale）。
 *
 * 【插槽一览】
 *   #brand / #nav / #actions   顶栏三段
 *   #back / #chips / #subbar-extra  副栏三段
 *   #sidebar                   侧栏（放 ScreenSideItem）
 *   默认插槽                    工作区内容（放 ScreenPanel）
 *
 * @example
 * ```vue
 * <ScreenFrame>
 *   <template #brand>你的系统名</template>
 *   <template #nav>
 *     <ScreenNavItem active>总览</ScreenNavItem>
 *   </template>
 *   <template #sidebar>
 *     <ScreenSideItem active>配置</ScreenSideItem>
 *   </template>
 *   <ScreenPanel title="面板标题">内容</ScreenPanel>
 * </ScreenFrame>
 * ```
 */
import { computed } from 'vue';
import { useScreenScale } from './useScreenScale';
import ScreenTopbar from './ScreenTopbar.vue';
import ScreenSubbar from './ScreenSubbar.vue';
import ScreenSidebar from './ScreenSidebar.vue';
import './screen-frame.tokens.css';

defineOptions({ name: 'ScreenFrame' });

const props = withDefaults(
  defineProps<{
    /** 设计稿宽度（px） */
    width?: number;
    /** 设计稿高度（px） */
    height?: number;
    /** 是否按窗口等比缩放铺满；false 时按设计稿原始尺寸渲染 */
    fit?: boolean;
  }>(),
  {
    width: 2048,
    height: 1088,
    fit: true,
  },
);

// useScreenScale 需要 Ref 形式的开关（可响应 fit 变化），这里包一层 computed
const fitEnabled = computed(() => props.fit);
const { scale } = useScreenScale({
  designWidth: props.width,
  designHeight: props.height,
  enabled: fitEnabled,
});

/**
 * 画布样式。
 *
 * fit=true（默认）：固定为设计稿尺寸，等比缩放后居中 ——
 *   translate(-50%, -50%) 配合 left/top 50% 实现居中；等比缩放下画布比例与窗口
 *   不一致时四周会留白，居中比原稿的左上对齐更稳。
 * fit=false：返回 undefined，交给 CSS 类 is-fluid 撑满父容器（供管理系统布局使用）。
 */
const canvasStyle = computed(() =>
  props.fit
    ? {
        width: `${props.width}px`,
        height: `${props.height}px`,
        transform: `translate(-50%, -50%) scale(${scale.value})`,
      }
    : undefined,
);
</script>

<template>
  <div class="screen-frame">
    <div :class="['screen-frame__canvas', { 'is-fluid': !fit }]" :style="canvasStyle">
      <ScreenTopbar>
        <template #brand><slot name="brand" /></template>
        <template #nav><slot name="nav" /></template>
        <template #actions><slot name="actions" /></template>
      </ScreenTopbar>

      <ScreenSubbar>
        <template #back><slot name="back" /></template>
        <slot name="chips" />
        <template #extra><slot name="subbar-extra" /></template>
      </ScreenSubbar>

      <ScreenSidebar>
        <slot name="sidebar" />
      </ScreenSidebar>

      <main class="screen-frame__workspace">
        <div class="screen-frame__scroll">
          <slot />
        </div>
      </main>
    </div>
  </div>
</template>

<style>
/*
 * 非 scoped 是有意为之：box-sizing 必须作用到子组件内部元素，
 * 而 scoped 样式只能命中子组件的根元素。选择器已用 .screen-frame 限定，
 * 不会外泄到框架之外。
 */
.screen-frame,
.screen-frame *,
.screen-frame *::before,
.screen-frame *::after {
  box-sizing: border-box;
}

.screen-frame {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--screen-bg-deep);
  color: var(--screen-text);
  font-family: var(--screen-font);
  font-size: 14px;
  line-height: 1.5;
}
</style>

<style scoped>
/* 画布：固定为设计稿尺寸，由 JS 等比缩放后居中 */
.screen-frame__canvas {
  position: absolute;
  left: 50%;
  top: 50%;
  transform-origin: center center;
  overflow: hidden;
  background: linear-gradient(180deg, #031b23 0, #03242e 100%);
}

/*
 * 自适应模式：撑满父容器、不做缩放。
 * 用于「管理系统布局」这类场景——外壳沿用大屏的四段式与配色，
 * 但尺寸必须跟随窗口，而不是固定画布。
 */
.screen-frame__canvas.is-fluid {
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: none;
}

/*
 * 左右两侧的装饰「缺口齿」：原稿用 clip-path 在边框上切出一段段折线，
 * 营造工业设备的接口感。纯装饰，不参与交互。
 */
.screen-frame__canvas::before,
.screen-frame__canvas::after {
  content: '';
  position: absolute;
  z-index: 10;
  top: 64px;
  bottom: 52px;
  width: 11px;
  border: 2px solid #006586;
  opacity: 0.68;
  pointer-events: none;
}

.screen-frame__canvas::before {
  left: 0;
  border-right: 0;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 25%,
    45% 26%,
    45% 46%,
    100% 47%,
    100% 65%,
    45% 66%,
    45% 88%,
    100% 89%,
    100% 100%,
    0 100%
  );
}

.screen-frame__canvas::after {
  right: 0;
  border-left: 0;
  clip-path: polygon(
    0 0,
    100% 0,
    100% 100%,
    0 100%,
    0 89%,
    55% 88%,
    55% 66%,
    0 65%,
    0 47%,
    55% 46%,
    55% 26%,
    0 25%
  );
}

/* 工作区：绝对定位避开侧栏，内部独立滚动（顶栏/副栏/侧栏固定不动） */
.screen-frame__workspace {
  position: absolute;
  left: 212px;
  right: 24px;
  top: 111px;
  bottom: 16px;
  background: var(--screen-bg-panel);
  overflow: hidden;
  display: flex;
}

.screen-frame__scroll {
  flex: 1;
  overflow-y: auto;
  padding: 27px 24px 90px;
}

.screen-frame__scroll::-webkit-scrollbar {
  width: 6px;
}

.screen-frame__scroll::-webkit-scrollbar-track {
  background: transparent;
}

.screen-frame__scroll::-webkit-scrollbar-thumb {
  background: #355963;
  border-radius: 5px;
}
</style>
