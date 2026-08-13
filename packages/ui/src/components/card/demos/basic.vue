<!-- packages/ui/src/components/card/demos/basic.vue -->
<!-- TmCard 基础演示：业务卡片骨架（公司默认 bordered/size） -->
<script setup lang="ts">
import { TmCard } from '../index'
</script>

<template>
  <div style="width: 100%">
    <TmCard title="业务卡片" style="width: 100%">
      <p>卡片内容区（公司默认 bordered / size=default，业务可覆盖）</p>
      <p>多段内容演示卡片骨架在业务页的承载。</p>
    </TmCard>
    <TmCard title="无边框卡片" :bordered="false" style="width: 100%; margin-top: 16px">
      <p>业务显式传 bordered=false 覆盖公司默认。</p>
    </TmCard>
  </div>
</template>
