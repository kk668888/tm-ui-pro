# Cascader 级联选择

基于 [ant-design-vue](https://www.antdv.com/components/cascader-cn) Cascader 的薄封装。保留全部 ant 原生 props / slots / events，新增 `modelValue` / `readonly` 扩展键，并自动接入 `TmForm` 的 `readonly` / `disabled` 级联与**只读锁**（readonly 时弹层不可打开）。

## 何时使用

- 需要从一组有层级关系的数据中逐级选择（省市区、分类目录等）。

## 基础用法

`options` 级联数据驱动，标准 `v-model` 绑定选中路径值数组。

<script setup>
import CascaderDemo from '../../../packages/ui/src/components/cascader/demos/basic.vue'
import CascaderDemoCode from '../../../packages/ui/src/components/cascader/demos/basic.vue?raw'

const cascaderProps = [
  {
    prop: 'modelValue',
    desc: '业务 `v-model` 绑定值（选中路径各层值组成的数组）；内部 computed 桥接到 ant Cascader 的 `value`',
    type: 'Array',
    default: '-',
  },
  {
    prop: 'readonly',
    desc: '只读语义：为真时弹层不可打开、不可修改，当前值仍可见；未传时级联 TmForm readonly',
    type: 'boolean',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Cascader 全部 props / slots / events（如 `options` / `fieldNames` / `changeOnSelect` / `disabled`）',
    type: 'CascaderProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="CascaderDemoCode">
  <CascaderDemo />
</DemoBlock>

## API

### TmCascader Props

<TmPropsTable :data="cascaderProps" />

### TmCascader Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:modelValue` | `v-model` 更新事件，内部自动桥接自 ant 的 `update:value` | `(value: Array) => void` |
| 其余事件 | 透传 ant Cascader 全部 events（如 `@change` / `@search`） | `-` |

### TmCascader Methods

业务侧通过 `ref` 可调用内部 ant Cascader 实例方法（经 `useForwardRef` 透传），如 `focus()` / `blur()`。

### TmCascader Types

- `TmCascaderProps = CascaderProps & { modelValue?: CascaderProps['value']; readonly?: boolean }`
- `CascaderProps`（ant 原生）可直接从 `@tm/ui` 导入。
