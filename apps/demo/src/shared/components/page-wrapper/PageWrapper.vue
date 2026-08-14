<script setup lang="ts">
import type { StyleValue } from 'vue';

defineOptions({ name: 'PageWrapper' });

defineProps<{
  headerClass?: string;
  headerStyle?: StyleValue;
  contentClass?: string;
  contentStyle?: StyleValue;
  footerClass?: string;
  footerStyle?: StyleValue;
}>();
</script>

<template>
  <!-- 外层用 a-flex 纵向布局（ant 组件替代原生 div.flex-col，AGENTS 规范） -->
  <a-flex vertical class="h-full" style="min-height: 0">
    <!-- Header：搜索/操作区（可选）。a-flex 横向排布 search 与 extra -->
    <a-flex
      v-if="$slots.header || $slots.search || $slots.extra"
      :class="['bg-white rounded p-4 mb-4', headerClass]"
      :style="headerStyle"
      justify="space-between"
      align="center"
      wrap="wrap"
    >
      <slot name="header">
        <div><slot name="search" /></div>
        <div><slot name="extra" /></div>
      </slot>
    </a-flex>

    <!-- Content：主体内容区，独立滚动（ant 无滚动容器组件，div 属合理豁免） -->
    <div :class="['flex-1 overflow-auto p-4', contentClass]" :style="contentStyle">
      <slot />
    </div>

    <!-- Footer（可选） -->
    <div v-if="$slots.footer" :class="['pt-4', footerClass]" :style="footerStyle">
      <slot name="footer" />
    </div>
  </a-flex>
</template>
