<!-- packages/ui/src/components/card/demos/grid.vue -->
<!--
  TmCardGrid 详细演示：
  1. 在 <TmCard> 内容区用 <TmCardGrid> 排布等宽栅格单元
  2. hoverable 悬停高亮
  说明：与原生 <a-card-grid> 是同一组件对象（别名复用），行为完全一致；
  TmCardGrid 必须作为 TmCard 的直接内容子级使用，才继承卡片的边框/间距样式。
-->
<script setup lang="ts">
import { TmCard, TmCardGrid } from '../index'

/** 栅格单元数据（等宽排布，每行 4 个由 ant 样式控制） */
const cells = ['概览', '监控', '日志', '配置', '用户', '权限', '审计', '设置']
</script>

<template>
  <div>
    <b>基础用法（卡体内等宽栅格）</b>
    <TmCard title="功能入口" style="width: 420px">
      <TmCardGrid v-for="cell in cells.slice(0, 4)" :key="cell" style="text-align: center">
        {{ cell }}
      </TmCardGrid>
    </TmCard>
  </div>

  <div>
    <b>hoverable 悬停高亮（八宫格）</b>
    <TmCard title="全部入口" style="width: 520px">
      <TmCardGrid v-for="cell in cells" :key="cell" hoverable style="text-align: center">
        {{ cell }}
      </TmCardGrid>
    </TmCard>
  </div>
</template>
