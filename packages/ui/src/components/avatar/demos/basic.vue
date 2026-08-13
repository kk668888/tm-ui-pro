<!-- packages/ui/src/components/avatar/demos/basic.vue -->
<!-- TmAvatar 基础演示：头像 + 头像组（render function 转发 maxCount） -->
<script setup lang="ts">
import { UserOutlined } from '@ant-design/icons-vue'
import { TmAvatar, TmAvatarGroup } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>基础头像（图片 / 图标 / 文字）</p>
    <TmAvatar :src="'https://joeschmoe.io/api/v1/random'" />
    <TmAvatar style="margin-left: 16px"><UserOutlined /></TmAvatar>
    <TmAvatar style="margin-left: 16px">U</TmAvatar>
    <p style="margin-top: 16px">头像组（maxCount 溢出折叠）</p>
    <TmAvatarGroup :max-count="3" :max-style="{ color: '#f56a00', backgroundColor: '#fde3cf' }">
      <TmAvatar src="https://joeschmoe.io/api/v1/random" />
      <TmAvatar src="https://joeschmoe.io/api/v1/random" />
      <TmAvatar src="https://joeschmoe.io/api/v1/random" />
      <TmAvatar src="https://joeschmoe.io/api/v1/random" />
      <TmAvatar src="https://joeschmoe.io/api/v1/random" />
    </TmAvatarGroup>
  </div>
</template>
