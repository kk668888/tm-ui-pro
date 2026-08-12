<!-- packages/ui/src/components/radio/demos/basic.vue -->
<!-- TmRadio 基础演示：单选框（受控选中 + 禁用） -->
<script setup lang="ts">
import { TmRadio } from '../index'
</script>

<template>
  <div style="width: 100%">
    <p>单选框（受控选中）</p>
    <TmRadio :checked="true">选项 A</TmRadio>
    <TmRadio>选项 B</TmRadio>
    <p>禁用</p>
    <TmRadio :checked="true" disabled>只读选中</TmRadio>
    <p>组合用法：配合 TmRadioGroup（见 RadioGroup 文档）</p>
  </div>
</template>
