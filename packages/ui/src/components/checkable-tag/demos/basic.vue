<!-- packages/ui/src/components/checkable-tag/demos/basic.vue -->
<!--
  TmCheckableTag 详细演示：
  1. 单个标签：v-model:checked 双向绑定
  2. 标签筛选组：一组标签共用一个选中集合（:checked + @change 受控写法）
  3. @change 携带新选中值，业务可做联动
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import { TmCheckableTag } from '../index'

/** 案例 1：单个标签的选中态 */
const followed = ref(true)

/** 案例 2：标签筛选组——选中集合由业务维护 */
const allTags = ['Vue', 'React', 'Svelte']
const selectedTags = ref<string[]>(['Vue'])

/** @change 收到的最近一次变更（演示联动能力） */
const lastChange = ref('')

/**
 * 切换某个标签的选中态。
 * 注意：这里是「不可变更新」——用新数组替换，而不是 push/splice 原数组，
 * 保证 Vue 的依赖追踪与父级 v-model 回写都能正确触发。
 */
function toggleTag(tag: string, checked: boolean): void {
  selectedTags.value = checked
    ? [...selectedTags.value, tag]
    : selectedTags.value.filter((t) => t !== tag)
  lastChange.value = `${tag} → ${checked ? '选中' : '取消'}`
}

/** 已选标签的展示文本 */
const selectedText = computed(() => selectedTags.value.join('、') || '无')
</script>

<template>
  <div>
    <b>基础用法（v-model:checked）</b>
    <TmCheckableTag v-model:checked="followed">关注中</TmCheckableTag>
    <p>当前选中：{{ followed }}</p>
  </div>

  <div>
    <b>标签筛选组（一组标签共用一个选中集合）</b>
    <TmCheckableTag
      v-for="tag in allTags"
      :key="tag"
      :checked="selectedTags.includes(tag)"
      @change="(checked: boolean) => toggleTag(tag, checked)">
      {{ tag }}
    </TmCheckableTag>
    <p>已选：{{ selectedText }}；最近变更：{{ lastChange || '无' }}</p>
  </div>
</template>
