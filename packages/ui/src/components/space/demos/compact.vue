<!-- packages/ui/src/components/space/demos/compact.vue -->
<!--
  TmCompact 详细演示：
  1. 基础：输入框 + 按钮无缝拼接（共享边框，无间隙）
  2. 跨组件组合：输入框 + 下拉选择 + 按钮同处一个紧凑块
  3. block 占满整行 / direction="vertical" 纵向紧凑
  说明：与原生 <a-space-compact> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmCompact } from '../index'
import { TmInput } from '../../input'
import { TmButton } from '../../button'
import { TmSelect } from '../../select'

/** 案例 1：搜索关键词 */
const keyword = ref('')

/** 案例 2：部门 + 姓名组合查询 */
const dept = ref<string | undefined>('fe')
const staff = ref('')
const deptOptions = [
  { label: '前端', value: 'fe' },
  { label: '后端', value: 'be' },
]

/** 案例 3：纵向紧凑 */
const first = ref('')
const second = ref('')
</script>

<template>
  <div>
    <b>基础用法（输入框 + 按钮无缝拼接）</b>
    <TmCompact>
      <TmInput v-model="keyword" placeholder="关键词" style="width: 200px" />
      <TmButton type="primary">搜索</TmButton>
    </TmCompact>
    <p>当前值：{{ keyword || '空' }}</p>
  </div>

  <div>
    <b>跨组件组合（下拉 + 输入框 + 按钮）</b>
    <TmCompact>
      <TmSelect v-model="dept" :options="deptOptions" style="width: 100px" />
      <TmInput v-model="staff" placeholder="姓名" style="width: 160px" />
      <TmButton type="primary">查询</TmButton>
    </TmCompact>
    <p>当前值：{{ dept || '空' }} / {{ staff || '空' }}</p>
  </div>

  <div>
    <b>block 占满整行（与 direction="vertical" 纵向紧凑）</b>
    <TmCompact block style="max-width: 320px">
      <TmInput v-model="first" placeholder="第一行" />
      <TmButton type="primary">提交</TmButton>
    </TmCompact>
    <TmCompact direction="vertical" style="width: 200px; margin-top: 8px">
      <TmInput v-model="first" placeholder="上行" />
      <TmInput v-model="second" placeholder="下行" />
    </TmCompact>
  </div>
</template>
