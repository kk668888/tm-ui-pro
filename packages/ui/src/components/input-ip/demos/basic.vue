<!-- packages/ui/src/components/input-ip/demos/basic.vue -->
<!-- TmInputIp 基础演示：v-model 契约（未齐 '' / 齐全组装）、size 三档、disabled/readonly、初始非法值 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInputIp } from '../index'

// 基础双向绑定：段未齐时 v 为 ''，四段齐且合法时为完整点分串
const ip = ref('192.168.1.1')

// 半成品演示：只填两段，v 始终为 ''（表单无脏数据）
const partial = ref('')

// 初始非法值演示：999 段按原文展示并标红，不静默修正
const invalid = ref('999.1.1.1')
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 16px; max-width: 320px">
    <div>
      <p>基础 v-model（当前值：{{ ip || "（未填齐 → ''）" }}）</p>
      <TmInputIp v-model="ip" />
    </div>

    <div>
      <p>半成品（当前值：{{ JSON.stringify(partial) }}）</p>
      <TmInputIp v-model="partial" />
    </div>

    <div>
      <p>初始非法值（999 段标红，不改写）</p>
      <TmInputIp v-model="invalid" />
    </div>

    <div>
      <p>尺寸三档 / 禁用 / 只读</p>
      <TmInputIp size="small" model-value="10.0.0.1" />
      <TmInputIp model-value="10.0.0.2" disabled />
      <TmInputIp model-value="10.0.0.3" readonly />
    </div>
  </div>
</template>
