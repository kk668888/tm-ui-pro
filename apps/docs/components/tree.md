# Tree 树形控件

基于 [ant-design-vue](https://www.antdv.com/components/tree-cn) Tree 的薄封装。导出 `TmTree` / `TmDirectoryTree`，节点一律用 `treeData` 配置驱动。

> ⚠️ **节点用 `treeData` 配置**：ant 的遗留子组件 API（`<Tree><TreeNode/></Tree>`）经薄封装会被 ant `treeUtil` 递归处理破坏，故不导出 `TmTreeNode`。业务用 `:tree-data` 数组配置节点。

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

### TmTree Props

<TmPropsTable :data="props" />

### TmTree Events

| 事件 | 说明 |
| --- | --- |
| `check` / `select` / `expand` | 勾选 / 选中 / 展开（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Tree 实例（经 `useForwardRef` 透传）。
