<!-- packages/ui/src/components/button/demos/group.vue -->
<!--
  TmButtonGroup 详细演示：
  1. 基础：多个按钮相邻边框合并，中间按钮无左右圆角
  2. size 统一作用于全部子按钮 + 危险/主色混合
  说明：与原生 <a-button-group> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import { TmButton, TmButtonGroup } from '../index'
</script>

<template>
  <div>
    <b>基础用法（相邻边框合并）</b>
    <TmButtonGroup>
      <TmButton>左</TmButton>
      <TmButton>中</TmButton>
      <TmButton>右</TmButton>
    </TmButtonGroup>
  </div>

  <div>
    <b>size 统一作用于子按钮</b>
    <TmButtonGroup size="large">
      <TmButton type="primary">新建</TmButton>
      <TmButton>导出</TmButton>
      <TmButton danger>删除</TmButton>
    </TmButtonGroup>
  </div>

  <div>
    <b>按钮组内选中态（配合 TmButton 的 type 切换）</b>
    <TmButtonGroup>
      <TmButton type="primary">按日</TmButton>
      <TmButton>按周</TmButton>
      <TmButton>按月</TmButton>
    </TmButtonGroup>
  </div>
</template>
