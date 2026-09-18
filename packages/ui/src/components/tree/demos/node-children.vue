<!-- packages/ui/src/components/tree/demos/node-children.vue -->
<!--
  TmTreeNode 详细演示：模板子组件写法（与 treeData 配置驱动等价）
  1. 基础：TmTreeNode 嵌套声明节点（title 为节点文本，key 为节点标识）
  2. 可勾选：children 写法同样支持 checkable / v-model:checkedKeys

  注意：节点 key 必须唯一且显式声明（ant 依赖 key 做展开/勾选状态标识）。
  复杂树（动态加载、数百节点）仍推荐 treeData 配置驱动。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTree, TmTreeNode } from '../index'

/** 案例 2：勾选受控（children 写法与 treeData 写法共用同一套受控 prop） */
const checked = ref<string[]>(['0-0-0'])
</script>

<template>
  <div>
    <b>基础：TmTreeNode 嵌套声明节点</b>
    <TmTree default-expand-all style="max-width: 320px">
      <TmTreeNode key="0-0" title="公司">
        <TmTreeNode key="0-0-0" title="技术部" />
        <TmTreeNode key="0-0-1" title="产品部" />
      </TmTreeNode>
      <TmTreeNode key="0-1" title="子公司">
        <TmTreeNode key="0-1-0" title="市场部" />
      </TmTreeNode>
    </TmTree>
  </div>

  <div>
    <b>可勾选（v-model:checkedKeys 受控）</b>
    <TmTree v-model:checked-keys="checked" checkable default-expand-all style="max-width: 320px">
      <TmTreeNode key="0-0" title="公司">
        <TmTreeNode key="0-0-0" title="技术部" />
        <TmTreeNode key="0-0-1" title="产品部" />
      </TmTreeNode>
      <TmTreeNode key="0-1" title="子公司">
        <TmTreeNode key="0-1-0" title="市场部" />
      </TmTreeNode>
    </TmTree>
    <p>已勾选：{{ checked.join('、') || '空' }}</p>
  </div>
</template>
