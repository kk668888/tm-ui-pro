<!-- packages/ui/src/components/badge/demos/ribbon.vue -->
<!--
  TmBadgeRibbon 详细演示：
  1. 基础：把卡片包进缎带容器，text 指定角标文案
  2. placement 控制缎带所在角（start / end）
  3. color 自定义缎带底色
  说明：与原生 <a-badge-ribbon> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import { TmBadgeRibbon } from '../index'
</script>

<template>
  <div style="display: flex; flex-wrap: wrap; gap: 24px">
    <div>
      <b>基础用法（默认 end 右上角）</b>
      <TmBadgeRibbon text="推荐">
        <div style="width: 200px; height: 100px; background: #f5f5f5; border-radius: 8px; padding: 12px">
          卡片内容
        </div>
      </TmBadgeRibbon>
    </div>

    <div>
      <b>placement="start" 左上角 + color 自定义底色</b>
      <TmBadgeRibbon text="已上线" placement="start" color="#52c41a">
        <div style="width: 200px; height: 100px; background: #f5f5f5; border-radius: 8px; padding: 12px">
          卡片内容
        </div>
      </TmBadgeRibbon>
    </div>
  </div>
</template>
