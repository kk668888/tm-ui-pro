<!-- packages/ui/src/components/select/demos/option-children.vue -->
<!--
  TmSelectOption / TmSelectOptGroup 详细演示：模板子组件写法（与 options prop 完全等价）
  1. 基础：TmSelectOption 直接作为 TmSelect 的子节点
  2. 分组：TmSelectOptGroup 以 label 为组标题收纳多个选项
  3. 多选 + 可搜索：children 写法同样支持 ant 原生能力

  注意：不要同时给 TmSelect 传 :options —— ant 以 `!options && children` 判定 children 模式，
  空数组也是 truthy，会关掉模板子组件模式（结果只回显原始 value 而非选项文本）。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmSelect, TmSelectOption, TmSelectOptGroup } from '../index'

/** 案例 1：基础模板子组件写法 */
const fruit = ref<string | number>('apple')

/** 案例 2：分组写法（组标题 + 组内选项） */
const city = ref<string | number>('hangzhou')

/** 案例 3：多选（children 写法与 options prop 行为一致） */
const langs = ref<(string | number)[]>(['vue'])
</script>

<template>
  <div>
    <b>基础：TmSelectOption 直接声明选项</b>
    <TmSelect v-model="fruit" placeholder="请选择水果" style="width: 200px">
      <TmSelectOption value="apple">苹果</TmSelectOption>
      <TmSelectOption value="banana">香蕉</TmSelectOption>
      <TmSelectOption value="orange" disabled>橙子（已下架）</TmSelectOption>
    </TmSelect>
    <p>当前值：{{ fruit }}</p>
  </div>

  <div>
    <b>分组：TmSelectOptGroup 带标题分组</b>
    <TmSelect v-model="city" placeholder="请选择城市" style="width: 220px">
      <TmSelectOptGroup label="浙江省">
        <TmSelectOption value="hangzhou">杭州</TmSelectOption>
        <TmSelectOption value="ningbo">宁波</TmSelectOption>
      </TmSelectOptGroup>
      <TmSelectOptGroup label="江苏省">
        <TmSelectOption value="nanjing">南京</TmSelectOption>
        <TmSelectOption value="suzhou">苏州</TmSelectOption>
      </TmSelectOptGroup>
    </TmSelect>
    <p>当前值：{{ city }}</p>
  </div>

  <div>
    <b>多选 + 可搜索（mode="multiple" show-search）</b>
    <TmSelect
      v-model="langs"
      mode="multiple"
      show-search
      placeholder="请选择语言"
      style="width: 280px">
      <TmSelectOption value="vue">Vue</TmSelectOption>
      <TmSelectOption value="react">React</TmSelectOption>
      <TmSelectOption value="svelte">Svelte</TmSelectOption>
    </TmSelect>
    <p>当前值：{{ langs.join('、') }}</p>
  </div>
</template>
