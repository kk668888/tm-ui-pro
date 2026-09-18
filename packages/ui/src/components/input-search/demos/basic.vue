<!-- packages/ui/src/components/input-search/demos/basic.vue -->
<!--
  TmInputSearch 详细演示：
  1. 按钮形态：enterButton + @search 事件（回车或点按钮触发）
  2. 图标后缀形态 / 自定义按钮文案
  3. 禁用 / 只读态
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmInputSearch } from '../index'

/** 案例 1：按钮形态的输入值 */
const kw1 = ref('')
/** 最近一次触发的搜索关键词（演示 @search 回调参数） */
const lastSearch = ref('')

/** 案例 2：图标后缀形态（左侧）与自定义按钮文案（右侧） */
const kw2 = ref('')
const kw3 = ref('')

/** 案例 3：禁用 / 只读 */
const locked = ref('固定关键词')

/** @search 在回车或点击搜索按钮时触发，参数为当前输入值 */
function onSearch(value: string): void {
  lastSearch.value = value
}
</script>

<template>
  <div>
    <b>按钮形态（enterButton + @search）</b>
    <TmInputSearch
      v-model="kw1"
      placeholder="输入关键词后回车或点按钮"
      enter-button
      style="width: 280px"
      @search="onSearch" />
    <p>当前值：{{ kw1 || '空' }}；最近一次搜索：{{ lastSearch || '无' }}</p>
  </div>

  <div>
    <b>图标后缀形态（不传 enterButton） / 自定义按钮文案</b>
    <TmInputSearch v-model="kw2" placeholder="图标后缀形态" style="width: 200px" />
    <TmInputSearch v-model="kw3" placeholder="自定义文案" enter-button="查询" style="width: 200px" />
  </div>

  <div>
    <b>禁用 / 只读</b>
    <TmInputSearch v-model="locked" disabled style="width: 200px" />
    <TmInputSearch v-model="locked" readonly style="width: 200px" />
  </div>
</template>
