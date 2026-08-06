<!-- packages/ui/src/components/select/demos/basic.vue -->
<!-- TmSelect 基础演示：本地 options + v-model，以及 remote 远程搜索两种用法 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSelect, type TmSelectOption, type TmSelectRemote } from '../index'

// 用法一：本地 options + 标准 v-model（业务 modelValue ↔ ant value 自动桥接）
const local = ref<string | number>('apple')
const localOptions: TmSelectOption[] = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
]

// 用法二：remote 远程搜索（业务自备取数函数，TmSelect 自动驱动 options / loading）
const remoteValue = ref<string | number>()
// 示例 remote：用静态数组模拟服务端模糊匹配
const remoteFetcher: TmSelectRemote = (query) =>
  Promise.resolve(
    query
      ? [
          { label: `${query}-选项1`, value: `${query}-1` },
          { label: `${query}-选项2`, value: `${query}-2` },
        ]
      : [],
  )
</script>

<template>
  <div style="display: flex; flex-direction: column; gap: 24px">
    <div>
      <h3>本地 options</h3>
      <TmSelect v-model="local" :options="localOptions" placeholder="请选择水果" />
      <p>当前值：{{ local }}</p>
    </div>

    <div>
      <h3>remote 远程搜索</h3>
      <TmSelect
        v-model="remoteValue"
        :remote="remoteFetcher"
        placeholder="输入关键字搜索"
      />
      <p>当前值：{{ remoteValue }}</p>
    </div>
  </div>
</template>
