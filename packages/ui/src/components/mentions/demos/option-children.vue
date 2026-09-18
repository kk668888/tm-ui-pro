<!-- packages/ui/src/components/mentions/demos/option-children.vue -->
<!--
  TmMentionsOption 详细演示：提及候选的「子组件」写法与「options」写法对照

  重要（ant-design-vue 4.2.6 实测）：
  - `Mentions.Option` 已被 ant 标记**废弃**：仍可用（子节点会被解析成候选），但开发环境
    会打印 "`Mentions.Option` is deprecated. Please use `options` instead."。
  - 因此新代码请用 `:options`；此处保留子组件写法仅为兼容存量 ant 代码与说明其行为。
  - 两种写法的候选列表完全等价：value 取自 `value`，显示文案取自默认插槽。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmMentions, TmMentionsOption } from '../index'

/** 案例 1：子组件写法（ant 已废弃，兼容存量代码） */
const byChildren = ref('')

/** 案例 2：options 写法（推荐） */
const byOptions = ref('')

/** options 写法的候选数据：与案例 1 的候选内容一致 */
const options = [
  { value: 'zhangsan', label: '张三' },
  { value: 'lisi', label: '李四' },
  { value: 'wangwu', label: '王五' },
]
</script>

<template>
  <div>
    <b>TmMentionsOption 子组件写法（ant 4.2.6 已废弃，仅存量代码兼容）</b>
    <TmMentions v-model:value="byChildren" placeholder="输入 @ 触发" style="max-width: 320px">
      <TmMentionsOption value="zhangsan">张三</TmMentionsOption>
      <TmMentionsOption value="lisi">李四</TmMentionsOption>
      <TmMentionsOption value="wangwu" disabled>王五（禁用）</TmMentionsOption>
    </TmMentions>
    <p>当前值：{{ byChildren || '空' }}</p>
  </div>

  <div>
    <b>options 写法（推荐：无废弃告警，且便于数据驱动）</b>
    <TmMentions v-model:value="byOptions" :options="options" placeholder="输入 @ 触发" style="max-width: 320px" />
    <p>当前值：{{ byOptions || '空' }}</p>
  </div>
</template>
