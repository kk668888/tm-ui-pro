<!--
  DemoBlock.vue
  文档站轻量 demo 容器（Bug 1 自建方案）：
  - 不依赖任何第三方 demo 插件（避免与 VitePress 1.6.4 SSR / markdown-it-container 兼容性问题）
  - 仅做边框美化 + 上下间距 + 渲染区背景，提供一致的 demo 视觉容器
  - 通过默认 slot 接收真实可交互的 Vue 组件（由 markdown 的 <script setup> import + 渲染）
  - 源码展示用 VitePress 原生 `<<< @/path/to/file.vue` 语法在容器外单独展示（更符合 VitePress 习惯）

  使用方式（markdown 内）：
  ```vue
  <script setup>
  import Demo from '../../../packages/ui/src/components/button/demos/basic.vue'
  </script>

  <DemoBlock>
    <Demo />
  </DemoBlock>

  <<< ../../../packages/ui/src/components/button/demos/basic.vue
  ```

  样式策略：用 VitePress 内置 CSS 变量（var(--vp-c-border)、var(--vp-c-bg) 等），
  自动跟随默认主题明暗色切换，无需硬编码颜色。
-->
<template>
  <div class="demo-block">
    <div class="demo-block__preview">
      <!-- 默认 slot：真实 demo 渲染区 -->
      <slot />
    </div>
  </div>
</template>

<style scoped>
/* 容器：边框 + 圆角 + 间距，颜色用 VitePress CSS 变量跟随主题 */
.demo-block {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
  background: var(--vp-c-bg);
}

/* 渲染区：内边距给组件呼吸空间，flex 便于横向并排按钮等 */
.demo-block__preview {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}
</style>
