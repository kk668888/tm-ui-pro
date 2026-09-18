# TreeNode 树节点

`TmTree` 树形控件的库内别名（与原生 `<a-tree-node>` 是**同一个组件对象**）。用于在 `<TmTree>` 内以模板子组件写法声明节点，与 `treeData` 配置驱动等价。

## 何时使用

- 树的层级固定、节点少（配置树、菜单预览），希望直接在模板里写层级结构。
- 需要对某一层节点单独定制插槽内容（`title` 插槽 / `icon` 插槽）。

> 动态加载、节点数多、需要 `fieldNames` 映射的树，仍推荐 `treeData` 配置驱动（见 [Tree 页](./tree.md)）。

## 基础用法

`TmTreeNode` 通过 `title` 声明节点文本、`key` 声明节点标识，嵌套的子 `TmTreeNode` 构成层级；`checkable` / `v-model:checkedKeys` 等受控能力与 `treeData` 写法完全一致。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import TreeNodeDemo from '../../../packages/ui/src/components/tree/demos/node-children.vue'
import TreeNodeDemoCode from '../../../packages/ui/src/components/tree/demos/node-children.vue?raw'
</script>

<DemoBlock :code="TreeNodeDemoCode">
  <TreeNodeDemo />
</DemoBlock>

## 与 treeData 对比

| 维度 | `treeData` prop（配置驱动） | `TmTreeNode` 子组件（模板驱动） |
| --- | --- | --- |
| 数据形态 | 数组，来自接口时零转换 | 模板结构，适合层级固定的枚举树 |
| 节点内容 | `title` 字段（或 `fieldNames` 映射） | 插槽，可放图标 / 标签 / 操作按钮 |
| 动态加载 | 推荐（`loadData`） | 不推荐 |
| 大数据量 | 推荐（配合 `virtual`） | 不推荐 |

## 历史决策翻案说明

历史上本库**有意不导出** `TmTreeNode`：早期的薄封装 `wrapper` 会让 ant `treeUtil` 递归识别子节点时拿到包裹层而非 `TreeNode`，导致层级丢失。本次改为 **ant 顶层导出别名复用**（`withInstall` 是「原对象就地附加 `install` 并返回同一引用」），`vnode.type` 全等、内部标记不丢，识别不再经过任何包裹层，因此 children 模板写法可用，并已由集成测试（`subcomponents.integration.spec.ts`）锁定行为。

## API

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `title` | 节点文本（也可用 `title` 插槽） | `string \| slot` | - |
| `key` | 节点唯一标识（**必填**，展开 / 勾选 / 选中状态都依赖它） | `string \| number` | - |
| `children` | 子节点（嵌套 `TmTreeNode`） | `slot` | - |
| 其余属性 | 透传 ant TreeNode 全部 props（如 `disabled` / `disableCheckbox` / `isLeaf` / `selectable` / `checkable`） | `TreeNodeProps` | - |
