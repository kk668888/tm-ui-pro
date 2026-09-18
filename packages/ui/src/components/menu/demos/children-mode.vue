<!-- packages/ui/src/components/menu/demos/children-mode.vue -->
<!--
  TmSubMenu / TmMenuItemGroup / TmMenuDivider 详细演示（模板子组件写法）

  用法要点：
  - 模板写法与 `items` 配置二选一：ant Menu 内部为
    `itemsNodes.value || flattenChildren(slots.default)`，只要传了 `items`，
    子组件就被整体忽略（不会报错，只是不渲染）。
  - TmMenu 已在封装层用 render 函数直接转发 default 插槽（见 Menu.vue 头注释），
    子项 key 与选中态的关联不会被 `<slot>` 虚拟节点打断。
  - 每个子项必须给唯一 `key`：选中/展开状态按 key 匹配。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmMenu, TmMenuItem, TmSubMenu, TmMenuItemGroup, TmMenuDivider } from '../index'

/** 案例 1：子菜单嵌套 */
const nestedSelected = ref<string[]>(['sub-1'])

/** 案例 2：分组 + 分割线 */
const groupedSelected = ref<string[]>(['g1'])
</script>

<template>
  <div style="width: 100%">
    <b>子菜单（TmSubMenu 嵌套 TmMenuItem）</b>
    <TmMenu
      v-model:selected-keys="nestedSelected"
      mode="inline"
      style="width: 256px">
      <TmMenuItem key="overview">概览</TmMenuItem>
      <TmSubMenu key="system" title="系统管理">
        <TmMenuItem key="sub-1">用户管理</TmMenuItem>
        <TmMenuItem key="sub-2">角色管理</TmMenuItem>
        <!-- 子菜单可继续嵌套 -->
        <TmSubMenu key="system-adv" title="高级设置">
          <TmMenuItem key="sub-adv-1">参数配置</TmMenuItem>
        </TmSubMenu>
      </TmSubMenu>
    </TmMenu>
    <p>当前选中：{{ nestedSelected.join('、') || '无' }}</p>
  </div>

  <div style="width: 100%">
    <b>分组与分割线（TmMenuItemGroup + TmMenuDivider）</b>
    <TmMenu
      v-model:selected-keys="groupedSelected"
      mode="inline"
      style="width: 256px">
      <TmMenuItemGroup title="基础数据">
        <TmMenuItem key="g1">仓库</TmMenuItem>
        <TmMenuItem key="g2">库位</TmMenuItem>
      </TmMenuItemGroup>
      <TmMenuDivider />
      <TmMenuItemGroup title="业务数据">
        <TmMenuItem key="g3">订单</TmMenuItem>
        <TmMenuItem key="g4">发货单</TmMenuItem>
      </TmMenuItemGroup>
    </TmMenu>
    <p>当前选中：{{ groupedSelected.join('、') || '无' }}</p>
  </div>
</template>
