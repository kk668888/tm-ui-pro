<!-- packages/ui/src/components/tree-select/demos/node-children.vue -->
<!--
  TmTreeSelectNode 详细演示：模板子组件写法（与 treeData 配置驱动等价）
  1. 基础：TmTreeSelectNode 嵌套声明节点（value 为取值，title 为显示文本）
  2. 分组树：多层嵌套 + 受控回显

  注意：children 模式要求 **不传** treeData（ant 内部判定 `if (treeData) … else convertChildrenToData(children)`）；
  节点 key 建议显式声明（与 value 一致最省心）。
  复杂 / 动态加载的树仍推荐 treeData 配置驱动。
-->
<script setup lang="ts">
import { ref } from 'vue'
import { TmTreeSelect, TmTreeSelectNode } from '../index'

/** 案例 1：基础模板子组件写法 */
const basic = ref('0-0-1')

/** 案例 2：多层嵌套（树形层级展示 + 受控回显） */
const deep = ref('zj-hz')
</script>

<template>
  <div>
    <b>基础：TmTreeSelectNode 嵌套声明节点</b>
    <TmTreeSelect v-model="basic" placeholder="请选择节点" style="width: 240px">
      <TmTreeSelectNode key="0-0" value="0-0" title="Node1">
        <TmTreeSelectNode key="0-0-1" value="0-0-1" title="Child Node1" />
        <TmTreeSelectNode key="0-0-2" value="0-0-2" title="Child Node2" />
      </TmTreeSelectNode>
      <TmTreeSelectNode key="0-1" value="0-1" title="Node2" />
    </TmTreeSelect>
    <p>当前值：{{ basic }}</p>
  </div>

  <div>
    <b>多层嵌套（省 / 市两级）</b>
    <TmTreeSelect v-model="deep" placeholder="请选择城市" style="width: 240px">
      <TmTreeSelectNode key="zj" value="zj" title="浙江省">
        <TmTreeSelectNode key="zj-hz" value="zj-hz" title="杭州" />
        <TmTreeSelectNode key="zj-nb" value="zj-nb" title="宁波" />
      </TmTreeSelectNode>
      <TmTreeSelectNode key="js" value="js" title="江苏省">
        <TmTreeSelectNode key="js-nj" value="js-nj" title="南京" />
      </TmTreeSelectNode>
    </TmTreeSelect>
    <p>当前值：{{ deep }}</p>
  </div>
</template>
