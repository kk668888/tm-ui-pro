<!-- packages/ui/src/components/descriptions/demos/basic.vue -->
<!-- TmDescriptions 基础演示：描述列表（render function 转发 TmDescriptionsItem） -->
<script setup lang="ts">
import { TmDescriptions, TmDescriptionsItem } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础描述列表（bordered + 垂直 label）</p>
    <TmDescriptions title="用户信息" :column="2" bordered style="width: 100%">
      <TmDescriptionsItem label="姓名">张三</TmDescriptionsItem>
      <TmDescriptionsItem label="年龄">18</TmDescriptionsItem>
      <TmDescriptionsItem label="城市">杭州</TmDescriptionsItem>
      <TmDescriptionsItem label="邮箱">zhang@example.com</TmDescriptionsItem>
    </TmDescriptions>
  </div>
</template>
