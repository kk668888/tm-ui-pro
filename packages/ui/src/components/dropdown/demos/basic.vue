<!-- packages/ui/src/components/dropdown/demos/basic.vue -->
<!-- TmDropdown 基础演示：hover 触发菜单 + 按钮组
     注：ant-design-vue 4.2.6 的 Dropdown `menu` prop 是 no-op（不构建 overlay），
     菜单内容必须经 #overlay 插槽提供（与 DropdownButton 一致）。 -->
<script setup lang="ts">
import { TmDropdown, TmDropdownButton } from '../index'
import { TmButton } from '../../button'
import { TmMenu, TmMenuItem } from '../../menu'
import { DownOutlined } from '@ant-design/icons-vue'
</script>

<template>
  <div style="width: 100%">
    <p>hover 触发下拉（#overlay 插槽）</p>
    <TmDropdown>
      <TmButton>
        操作
        <DownOutlined />
      </TmButton>
      <template #overlay>
        <TmMenu>
          <TmMenuItem key="edit">编辑</TmMenuItem>
          <TmMenuItem key="copy">复制</TmMenuItem>
          <TmMenuItem key="delete">删除</TmMenuItem>
        </TmMenu>
      </template>
    </TmDropdown>
    <p>下拉按钮组（#overlay 插槽 + trigger=click）</p>
    <TmDropdownButton trigger="click">
      更多操作
      <template #overlay>
        <TmMenu>
          <TmMenuItem key="edit">编辑</TmMenuItem>
          <TmMenuItem key="copy">复制</TmMenuItem>
          <TmMenuItem key="delete">删除</TmMenuItem>
        </TmMenu>
      </template>
    </TmDropdownButton>
  </div>
</template>
