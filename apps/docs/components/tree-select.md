# TreeSelect 树选择

基于 [ant-design-vue](https://www.antdv.com/components/tree-select-cn) TreeSelect 的薄封装。保留全部 ant 原生 props / slots / events，新增 `modelValue` / `readonly` 扩展键，并自动接入 `TmForm` 的 `readonly` / `disabled` 级联与**只读锁**（readonly 时弹层、搜索框、清除按钮一并锁死）。

## 何时使用

- 需要从树形结构中单选或多选节点（组织架构、分类目录等）。

## 基础用法

`treeData` 树数据驱动，标准 `v-model` 绑定选中节点值。

<script setup>
import TreeSelectDemo from '../../../packages/ui/src/components/tree-select/demos/basic.vue'
import TreeSelectDemoCode from '../../../packages/ui/src/components/tree-select/demos/basic.vue?raw'

const treeSelectProps = [
  {
    prop: 'modelValue',
    desc: '业务 `v-model` 绑定值（单选值 / 多选数组 / labelInValue 等 ant 原生形态）；内部桥接到 ant TreeSelect 的 `value`',
    type: 'string | number | Array',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读语义：为真时弹层不可打开、搜索框与清除按钮关闭，当前值仍可见；未传时级联 TmForm readonly',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant TreeSelect 全部 props / slots / events（如 `treeData` / `fieldNames` / `multiple` / `showSearch` / `disabled`）',
    type: 'TreeSelectProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="TreeSelectDemoCode">
  <TreeSelectDemo />
</DemoBlock>

## API

### TmTreeSelect Props

<TmPropsTable :data="treeSelectProps" />

### TmTreeSelect Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: string \| number \| Array) => void` |
| 其余事件 | 透传 ant TreeSelect 全部 events（如 `@change` / `@select` / `@deselect`） | `-` |

### TmTreeSelect Methods

业务侧通过 `ref` 可调用内部 ant TreeSelect 实例方法（经 `useForwardRef` 透传），如 `focus()` / `blur()`。

### TmTreeSelect Types

- `TmTreeSelectProps = TreeSelectProps & { modelValue?: TreeSelectProps['value']; readonly?: boolean }`
- `TreeSelectProps`（ant 原生）可直接从 `@tm/ui` 导入。
