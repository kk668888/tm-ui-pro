<!-- packages/ui/src/components/input/demos/group.vue -->
<!--
  TmInputGroup 详细演示：
  1. 基础：把多个 TmInput 首尾相接，共享边框（紧凑组合）
  2. 组合不同控件（输入框 + 下拉/日期等），统一由 group 接管圆角
  说明：与原生 <a-input-group> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInput, TmInputGroup } from '../index'

/** 案例 1：区间输入（起止值各自受控） */
const min = ref('')
const max = ref('')

/** 案例 2：组合控件中的输入值 */
const host = ref('')
</script>

<template>
  <div>
    <b>基础用法（多个 Input 共享边框）</b>
    <TmInputGroup>
      <TmInput v-model="min" placeholder="起始值" style="width: 120px" />
      <TmInput v-model="max" placeholder="结束值" style="width: 120px" />
    </TmInputGroup>
    <p>当前值：{{ min || '空' }} ~ {{ max || '空' }}</p>
  </div>

  <div>
    <b>与其它控件组合（前后缀控件同一圆角体系）</b>
    <TmInputGroup>
      <TmInput v-model="host" placeholder="主机名" style="width: 180px" />
      <TmInput placeholder="端口" style="width: 80px" />
      <TmInput placeholder="路径" style="width: 120px" />
    </TmInputGroup>
  </div>
</template>
