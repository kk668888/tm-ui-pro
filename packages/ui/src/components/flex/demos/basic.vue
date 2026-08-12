<!-- packages/ui/src/components/flex/demos/basic.vue -->
<!-- TmFlex 基础演示：公司默认间距 middle + 布局方向 -->
<script setup lang="ts">
import { TmFlex } from '../index'
import { TmButton } from '../../button'
</script>

<template>
  <TmFlex vertical gap="middle">
    <div>
      <b>横向（默认 gap=middle）</b>
      <TmFlex>
        <TmButton type="primary">按钮一</TmButton>
        <TmButton>按钮二</TmButton>
        <TmButton>按钮三</TmButton>
      </TmFlex>
    </div>
    <div>
      <b>纵向 vertical</b>
      <TmFlex vertical>
        <TmButton>纵向一</TmButton>
        <TmButton>纵向二</TmButton>
      </TmFlex>
    </div>
    <div>
      <b>两端对齐 justify=space-between</b>
      <TmFlex justify="space-between">
        <span>左</span>
        <span>中</span>
        <span>右</span>
      </TmFlex>
    </div>
  </TmFlex>
</template>
