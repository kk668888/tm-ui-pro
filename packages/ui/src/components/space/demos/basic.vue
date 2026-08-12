<!-- packages/ui/src/components/space/demos/basic.vue -->
<!-- TmSpace 基础演示：公司默认间距 middle + 业务覆盖 size -->
<script setup lang="ts">
import { TmSpace } from '../index'
import { TmButton } from '../../button'
</script>

<template>
  <TmSpace direction="vertical" size="middle" style="width: 100%">
    <div>
      <b>默认间距（middle）</b>
      <TmSpace>
        <TmButton type="primary">按钮</TmButton>
        <TmButton>默认</TmButton>
        <TmButton type="dashed">虚线</TmButton>
      </TmSpace>
    </div>
    <div>
      <b>间距 large</b>
      <TmSpace size="large">
        <TmButton type="primary">按钮</TmButton>
        <TmButton>默认</TmButton>
      </TmSpace>
    </div>
    <div>
      <b>分隔符 split（prop 形式，公司扩展）</b>
      <TmSpace split="|">
        <span>项一</span>
        <span>项二</span>
        <span>项三</span>
      </TmSpace>
    </div>
    <div>
      <b>分隔符 split（#split 插槽形式，ant 原生）</b>
      <TmSpace>
        <span>甲</span>
        <span>乙</span>
        <span>丙</span>
        <template #split>/</template>
      </TmSpace>
    </div>
  </TmSpace>
</template>
