<!-- packages/ui/src/components/textarea/demos/basic.vue -->
<!--
  TmTextarea 详细演示：
  1. 基础 v-model 受控 + autosize 自适应高度
  2. showCount + maxlength 字数统计
  3. 禁用态（值由系统写入）
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTextarea } from '../index'

/** 案例 1：自适应高度（2～6 行之间随内容伸缩） */
const intro = ref('')

/** 案例 2：字数统计与上限（超出 maxlength 无法继续输入） */
const remark = ref('')

/** 案例 3：禁用态 */
const locked = ref('该字段由系统写入，不允许修改')
</script>

<template>
  <div>
    <b>基础用法（autosize 自适应高度）</b>
    <TmTextarea
      v-model="intro"
      placeholder="请输入简介，高度随内容自适应"
      :autosize="{ minRows: 2, maxRows: 6 }"
      style="width: 320px" />
    <p>当前值：{{ intro || '空' }}</p>
  </div>

  <div>
    <b>字数统计（showCount + maxlength，上限 50 字）</b>
    <TmTextarea
      v-model="remark"
      placeholder="最多输入 50 字"
      :maxlength="50"
      show-count
      :rows="3"
      style="width: 320px" />
  </div>

  <div>
    <b>禁用态</b>
    <TmTextarea v-model="locked" disabled :rows="2" style="width: 320px" />
  </div>
</template>
