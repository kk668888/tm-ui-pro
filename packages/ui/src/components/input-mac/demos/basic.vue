<!-- packages/ui/src/components/input-mac/demos/basic.vue -->
<!-- TmInputMac 基础演示：v-model 契约（blur 归一后 emit 规范串 / 半成品 ''）、separator 配置、尺寸三档、disabled/readonly、初始非法值 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInputMac } from '../index'

// 基础双向绑定：未 blur 补齐前 v 为空串，失焦补零归一化后为规范大写串
const mac = ref('0A:1B:2C:3D:4E:5F')

// 半成品演示：只填两段 1 位，v 始终为 ''（blur 补零但不 emit，表单无脏数据）
const partial = ref('')

// 初始非法值演示：GG 段按原文展示并标红，不静默修正
const invalid = ref('GG:12:34:56:78:9A')

// 分隔符配置：'-' 模式保存/组装/粘贴解析均用隔行线
const dashed = ref('0A-0B-0C-0D-0E-0F')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 360px">
    <div>
      <p>基础 v-model（当前值：{{ mac || "（未补齐 → ''）" }}）</p>
      <TmInputMac v-model="mac" />
    </div>

    <div>
      <p>半成品（当前值：{{ JSON.stringify(partial) }}）</p>
      <TmInputMac v-model="partial" />
    </div>

    <div>
      <p>初始非法值（GG 段标红，不改写）</p>
      <TmInputMac v-model="invalid" />
    </div>

    <div>
      <p>separator="-"（当前值：{{ dashed }}）</p>
      <TmInputMac v-model="dashed" separator="-" />
    </div>

    <div>
      <p>尺寸三档 / 禁用 / 只读</p>
      <TmInputMac size="small" model-value="0A:0B:0C:0D:0E:0F" />
      <TmInputMac model-value="0A:0B:0C:0D:0E:0F" disabled />
      <TmInputMac model-value="0A:0B:0C:0D:0E:0F" readonly />
    </div>
  </div>
</template>