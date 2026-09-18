# TreeSelectNode 树选择节点

`TmTreeSelect` 树选择器的库内别名（与原生 `<a-tree-select-node>` 是**同一个组件对象**）。用于在 `<TmTreeSelect>` 内以模板子组件写法声明树节点，与 `treeData` 配置驱动等价。

## 何时使用

- 树层级固定、节点少，希望直接在模板里写层级。
- 从 ant 项目迁移过来的存量 `<a-tree-select-node>` 写法。

> 官方 4.x 主推 `treeData` 配置驱动；动态加载（`loadData`）、`fieldNames` 映射、大数据量场景请用 `treeData`（见 [TreeSelect 页](./tree-select.md)）。

## 基础用法

`TmTreeSelectNode` 用 `value` 声明取值、`title` 声明显示文本，嵌套子节点构成层级；选中值与 `treeData` 写法一致地写入 `v-model`。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import TreeSelectNodeDemo from '../../../packages/ui/src/components/tree-select/demos/node-children.vue'
import TreeSelectNodeDemoCode from '../../../packages/ui/src/components/tree-select/demos/node-children.vue?raw'
</script>

<DemoBlock :code="TreeSelectNodeDemoCode">
  <TreeSelectNodeDemo />
</DemoBlock>

## 关键约束

> **children 模式要求不传 `treeData`**。ant 内部逻辑是 `if (treeData) 用 treeData else convertChildrenToData(children)`——一旦传了 `treeData`（含空数组），子组件会被整体忽略。二者择一。

- **`key` 建议显式声明**（与 `value` 一致最省心）：节点展开状态、`treeCheckable` 勾选、`showCheckedStrategy` 都依赖 `key`。
- 别名复用保证内部标记（`isTreeSelectNode`）与 `vnode.type` 不丢，因此节点识别、搜索、多选回显行为与原生写法一致。

## API

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 节点取值（选中后写入 `v-model`） | `string \| number` | - |
| `title` | 节点显示文本（也可用 `title` 插槽） | `string \| slot` | - |
| `key` | 节点唯一标识（建议与 `value` 一致） | `string \| number` | - |
| `children` | 子节点（嵌套 `TmTreeSelectNode`） | `slot` | - |
| 其余属性 | 透传 ant `TreeSelectNode` 全部 props（如 `disabled` / `selectable` / `checkable` / `isLeaf`） | `TreeNodeProps` | - |
