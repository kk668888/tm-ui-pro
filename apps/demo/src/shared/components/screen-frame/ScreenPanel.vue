<script setup lang="ts">
/**
 * 工作区面板（分区容器）。
 *
 * 采用原稿 14 轮迭代后的**最终形态**：扁平分区，不套卡片边框。
 * （原稿前几轮是「卡片 + 边框 + 阴影」，后几轮全部推翻改为扁平分区，
 *   只保留标题前一根发光竖条来做层级区分。这里直接采用最终形态。）
 *
 * 命名为 Panel 而非 Card：避免与 tm-ui 的 TmCard 语义混淆——
 * 本组件不做容器视觉（无边框/无背景），只提供标题 + 分隔线。
 */
defineOptions({ name: 'ScreenPanel' });

withDefaults(
  defineProps<{
    /** 分区标题；不传则整个标题栏不渲染 */
    title?: string;
  }>(),
  { title: '' },
);
</script>

<template>
  <section class="screen-panel">
    <header v-if="title" class="screen-panel__head">
      <h3 class="screen-panel__title">{{ title }}</h3>
      <!-- 标题栏右侧：操作链接、开关等 -->
      <div class="screen-panel__extra">
        <slot name="extra" />
      </div>
    </header>

    <div class="screen-panel__body">
      <slot />
    </div>
  </section>
</template>

<style scoped>
.screen-panel {
  width: 100%;
}

/*
 * 扁平分区的层级完全靠这条分隔线建立：同层相邻面板之间有线，最后一个没有。
 * 依赖 :not(:last-child)，因此同一父容器内应只放 ScreenPanel 兄弟节点。
 */
.screen-panel:not(:last-child) {
  margin-bottom: 18px;
  padding-bottom: 18px;
  border-bottom: 1px solid #174854;
}

.screen-panel__head {
  height: var(--screen-panel-head-h);
  display: flex;
  align-items: center;
}

/* 标题前的发光竖条——原稿区分层级唯一保留的装饰 */
.screen-panel__title {
  position: relative;
  margin: 0;
  padding-left: 14px;
  color: var(--screen-text-strong);
  font-size: 16px;
  font-weight: 700;
  letter-spacing: 0.5px;
}

.screen-panel__title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  width: 3px;
  height: 17px;
  border-radius: 2px;
  background: var(--screen-primary-strong);
  box-shadow: 0 0 8px rgba(0, 184, 231, 0.5);
}

.screen-panel__extra {
  margin-left: auto;
  display: flex;
  align-items: center;
}

.screen-panel__body {
  padding-top: 14px;
}
</style>
