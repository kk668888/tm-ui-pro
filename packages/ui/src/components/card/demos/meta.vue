<!-- packages/ui/src/components/card/demos/meta.vue -->
<!--
  TmCardMeta 详细演示：
  1. prop 形式：title / description 走 prop；avatar 按 ant 约定传节点（此处用 #avatar 插槽）
  2. 插槽形式：用同名插槽传入更复杂的内容（如可点击标题 + 富文本描述）
  说明：与原生 <a-card-meta> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import { TmCard, TmCardMeta } from '../index'
</script>

<template>
  <div>
    <b>prop 形式（title / description 走 prop，avatar 走插槽）</b>
    <TmCard style="width: 320px">
      <TmCardMeta title="张小明" description="前端工程师 · 平台组">
        <template #avatar>
          <span
            style="
              display: inline-block;
              width: 40px;
              height: 40px;
              line-height: 40px;
              text-align: center;
              border-radius: 50%;
              background: #1677ff;
              color: #fff;
            ">
            张
          </span>
        </template>
      </TmCardMeta>
    </TmCard>
  </div>

  <div>
    <b>插槽形式（title / description 自定义结构）</b>
    <TmCard style="width: 320px">
      <TmCardMeta>
        <template #title>
          <span style="color: #1677ff">服务名称（可点击）</span>
        </template>
        <template #description>
          <span>状态：运行中 · 副本数 3</span>
        </template>
      </TmCardMeta>
    </TmCard>
  </div>
</template>
