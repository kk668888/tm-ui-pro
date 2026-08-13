<!-- packages/ui/src/components/tooltip/demos/basic.vue -->
<!-- TmTooltip 基础演示：文字提示（公司默认 top + 箭头，业务可覆盖） -->
<script setup lang="ts">
import { TmTooltip } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础提示（公司默认 placement=top / arrow）</p>
    <TmTooltip title="这是一条提示">
      <span style="cursor: pointer">悬停我</span>
    </TmTooltip>
    <p style="margin-top: 24px">自定义位置（bottom）</p>
    <TmTooltip title="底部提示" placement="bottom">
      <span style="cursor: pointer">悬停我</span>
    </TmTooltip>
  </div>
</template>
