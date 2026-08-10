<!-- packages/ui/src/components/app/src/App.vue -->
<!--
  TmApp 桥接组件：业务根组件用 <TmApp> 包裹后，全局命令式 API（TmMessage 等）
  自动绑定 ConfigProvider 上下文（locale/token）。

  结构（design.md 决策 2，2026-08-10 修复）：
  - AppContextHolder：hooks（useMessage/useNotification/useModal）创建绑定上下文的实例并捕获到
    feedbackHolder，同时渲染其 contextHolder（消息/通知/弹窗实际挂载点）
  - slot：业务子树

  注：不用 ant <App> 包裹——ant message 是全局单例，若 <App> 内部 + AppContextHolder 各创建
  useMessage，会形成双 contextHolder，导致每条消息重复渲染 2 次（2026-08-10 实测）。
  单一 AppContextHolder 即绑定同一 ConfigProvider 上下文，无重复。
-->
<script setup lang="ts">
import AppContextHolder from './AppContextHolder.vue'
</script>

<template>
  <AppContextHolder />
  <slot />
</template>
