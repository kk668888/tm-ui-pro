<!-- packages/ui/src/components/auto-complete/demos/option-children.vue -->
<!--
  TmAutoCompleteOption / TmAutoCompleteOptGroup 详细演示：模板子组件写法
  1. 基础：TmAutoCompleteOption 直接作为 TmAutoComplete 的子节点
  2. 分组：TmAutoCompleteOptGroup 以 label 为组标题收纳候选
  说明：TmAutoComplete 未新增 modelValue，沿用 ant 的 v-model:value 契约。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmAutoComplete, TmAutoCompleteOption, TmAutoCompleteOptGroup } from '../index'

/** 案例 1：基础模板子组件写法 */
const framework = ref('')

/** 案例 2：分组写法 */
const city = ref('')
</script>

<template>
  <div>
    <b>基础：TmAutoCompleteOption 直接声明候选</b>
    <TmAutoComplete v-model:value="framework" placeholder="输入 V / R 试试" style="width: 260px">
      <TmAutoCompleteOption value="Vue">Vue</TmAutoCompleteOption>
      <TmAutoCompleteOption value="Vite">Vite</TmAutoCompleteOption>
      <TmAutoCompleteOption value="React">React</TmAutoCompleteOption>
    </TmAutoComplete>
    <p>当前值：{{ framework || '空' }}</p>
  </div>

  <div>
    <b>分组：TmAutoCompleteOptGroup 带标题分组</b>
    <TmAutoComplete v-model:value="city" placeholder="输入 杭 / 南 试试" style="width: 260px">
      <TmAutoCompleteOptGroup label="浙江省">
        <TmAutoCompleteOption value="杭州">杭州</TmAutoCompleteOption>
        <TmAutoCompleteOption value="宁波">宁波</TmAutoCompleteOption>
      </TmAutoCompleteOptGroup>
      <TmAutoCompleteOptGroup label="江苏省">
        <TmAutoCompleteOption value="南京">南京</TmAutoCompleteOption>
        <TmAutoCompleteOption value="苏州">苏州</TmAutoCompleteOption>
      </TmAutoCompleteOptGroup>
    </TmAutoComplete>
    <p>当前值：{{ city || '空' }}</p>
  </div>
</template>
