<!-- packages/ui/src/components/float-button/demos/basic.vue -->
<!-- TmFloatButton 基础演示：单按钮 / 按钮组 / 返回顶部（承接 BackTop） -->
<script setup lang="ts">
import { TmFloatButton, TmFloatButtonGroup, TmFloatButtonBackTop } from '../index'
</script>

<template>
  <div style="width: 100%; min-height: 200px">
    <p>浮动按钮（右下角固定入口；BackTop 承接 ant 移除的独立返回顶部能力）</p>
    <TmFloatButton description="帮助" tooltip="帮助中心" style="right: 24px; bottom: 96px" />
    <TmFloatButtonGroup style="right: 24px; bottom: 180px">
      <TmFloatButton description="复制" />
      <TmFloatButton description="打印" />
    </TmFloatButtonGroup>
    <TmFloatButtonBackTop :visibility-height="200" style="right: 24px; bottom: 24px" />
  </div>
</template>
