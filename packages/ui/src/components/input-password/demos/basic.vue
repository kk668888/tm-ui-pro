<!-- packages/ui/src/components/input-password/demos/basic.vue -->
<!-- TmInputPassword 基础演示：v-model 受控 + 可见性切换 + iconRender 自定义图标 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInputPassword } from '../index'

// 业务侧标准 v-model：自动绑定 modelValue + update:modelValue
const pwd = ref('')
// iconRender 自定义图标场景的独立值
const pwd2 = ref('')
</script>

<template>
  <TmInputPassword v-model="pwd" placeholder="请输入密码" />
  <p>当前值：{{ pwd }}</p>

  <!-- 自定义切换图标：scope 为 { visible }，点击切换行为由组件注入 -->
  <TmInputPassword v-model="pwd2" placeholder="自定义切换图标">
    <template #iconRender="{ visible }">
      <span>{{ visible ? '隐藏' : '显示' }}</span>
    </template>
  </TmInputPassword>
</template>
