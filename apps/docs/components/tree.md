# Tree 树形控件

基于 [ant-design-vue](https://www.antdv.com/components/tree-cn) Tree 的薄封装。导出 `TmTree` / `TmDirectoryTree`，另有模板子组件 `TmTreeNode`。

> **节点两种写法都支持**：
> 1. `treeData` 配置驱动（推荐，见下方 demo）——动态加载、大数据量、接口数据场景。
> 2. `<TmTreeNode>` 模板子组件（见 [TreeNode](./tree-node.md)）——层级固定的枚举树。
>
> 历史上曾因薄封装 `wrapper` 破坏 ant `treeUtil` 递归识别而**不导出** `TmTreeNode`；本次改为 ant 顶层导出**别名复用**（`vnode.type` 全等、内部标记不丢），识别不再经过包裹层，该写法已由集成测试锁定。

## 何时使用

- 目录树、权限树、组织架构等树形结构。
- 需要勾选、展开、受控选中能力。

## 基础用法

treeData 树 + 可勾选 + 目录树。

<script setup>
import TreeDemo from '../../../packages/ui/src/components/tree/demos/basic.vue'
import TreeDemoCode from '../../../packages/ui/src/components/tree/demos/basic.vue?raw'

const props = [
  { prop: 'treeData', desc: '树节点配置（ant 原生，含 key/title/children）', type: 'TreeDataItem[]', default: '-' },
  { prop: 'checkable / checkedKeys / selectedKeys / expandedKeys', desc: '勾选 / 受控状态（ant 原生）', type: 'TreeProps', default: '-' },
  { prop: '其余属性', desc: '透传 ant Tree 全部 props / events（如 `blockNode` / `loadData` / `@check` / `@select`）', type: 'TreeProps', default: '-' },
]
</script>

<DemoBlock :code="TreeDemoCode">
  <TreeDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmTree` | Tree |
| `TmDirectoryTree` | DirectoryTree（目录树） |
| `TmTreeNode` | TreeNode（模板子组件，见 [TreeNode](./tree-node.md)） |

### TmTree Props

<TmPropsTable :data="props" />

### TmTree Events

| 事件 | 说明 |
| --- | --- |
| `check` / `select` / `expand` | 勾选 / 选中 / 展开（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Tree 实例（经 `useForwardRef` 透传）。
