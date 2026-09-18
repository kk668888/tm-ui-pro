<!-- packages/ui/src/components/radio-button/demos/basic.vue -->
<!--
  TmRadioButton 详细演示：
  1. 基础按钮组：原生 RadioGroup + TmRadioButton（推荐写法）
  2. 样式变体：buttonStyle="solid" + size
  3. 单项禁用：某个按钮不可选，其余正常

  重要：必须用「原生」RadioGroup 承载 TmRadioButton 子节点。
  原因见文档页「组合限制」一节——ant RadioGroup 用 provide/inject 识别子按钮，
  而 Vue 的 slot 内容 parent 指向转发组件而非挂载位置，经 TmRadioGroup 转发会断链。
  TmRadioGroup 表示单选组时的替代写法是它的 options prop。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { RadioGroup as ARadioGroup } from 'ant-design-vue'
import { TmRadioButton } from '../index'

/** 案例 1：周期切换（最常见的按钮态单选场景） */
const period = ref('year')

/** 案例 2：实心按钮样式 */
const solidValue = ref('a')

/** 案例 3：含禁用项 */
const mixedValue = ref('read')
</script>

<template>
  <div>
    <b>基础用法（原生 RadioGroup + TmRadioButton）</b>
    <ARadioGroup v-model:value="period">
      <TmRadioButton value="year">按年</TmRadioButton>
      <TmRadioButton value="quarter">按季</TmRadioButton>
      <TmRadioButton value="month">按月</TmRadioButton>
    </ARadioGroup>
    <p>当前值：{{ period }}</p>
  </div>

  <div>
    <b>样式变体（buttonStyle="solid" + size="small"）</b>
    <ARadioGroup v-model:value="solidValue" button-style="solid" size="small">
      <TmRadioButton value="a">列表</TmRadioButton>
      <TmRadioButton value="b">卡片</TmRadioButton>
      <TmRadioButton value="c">看板</TmRadioButton>
    </ARadioGroup>
    <p>当前值：{{ solidValue }}</p>
  </div>

  <div>
    <b>单项禁用（disabled 只作用于该按钮）</b>
    <ARadioGroup v-model:value="mixedValue">
      <TmRadioButton value="read">可读</TmRadioButton>
      <TmRadioButton value="write">可写</TmRadioButton>
      <TmRadioButton value="admin" disabled>管理员</TmRadioButton>
    </ARadioGroup>
    <p>当前值：{{ mixedValue }}</p>
  </div>
</template>
