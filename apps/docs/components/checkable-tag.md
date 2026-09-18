# CheckableTag 可选中标签

基于 [ant-design-vue](https://www.antdv.com/components/tag-cn) Tag.CheckableTag 的薄封装。值通道从 ant 原生的 `checked` + `update:checked` 收口为标准 `v-model:checked`，业务侧无需手写回写逻辑。

## 何时使用

- 可选中 / 可取消的标签（关注、订阅、维度筛选等）。
- 一组标签共用一个选中集合的筛选场景（见下方第二个案例）。
- 希望选中态由业务数组驱动，而不是标签自己维护内部状态。

## 基础用法

单个标签用 `v-model:checked` 双向绑定；一组标签的筛选场景用 `:checked` + `@change` 受控写法，选中集合由业务数组维护（`v-model:checked` 只适合「一个标签一个布尔值」）。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import CheckableTagDemo from '../../../packages/ui/src/components/checkable-tag/demos/basic.vue'
import CheckableTagDemoCode from '../../../packages/ui/src/components/checkable-tag/demos/basic.vue?raw'

// TmPropsTable 数据：TmCheckableTag Props 表格（数据驱动渲染）
const checkableTagProps = [
  {
    prop: 'checked',
    desc: '选中态（`v-model:checked` 绑定值）；受控 prop 透传给 ant，变更经 `update:checked` 事件回写',
    type: 'boolean',
    default: 'false（ant 原生默认未选中）',
  },
  {
    prop: '其余属性',
    desc: '透传 ant CheckableTag 原生属性（如 `class` / `style` 等样式类属性）',
    type: '-',
    default: '-',
  },
]
</script>

<DemoBlock :code="CheckableTagDemoCode">
  <CheckableTagDemo />
</DemoBlock>

## API

### TmCheckableTag Props

<TmPropsTable :data="checkableTagProps" />

### TmCheckableTag Events

| 事件 | 说明 | 回调参数 |
| --- | --- | --- |
| `update:checked` | `v-model:checked` 更新事件；内部由模板显式绑定转发自 ant 的 `update:checked` | `(checked: boolean) => void` |
| `change` | 点击切换时触发（与 `update:checked` 同时抛出，透传 ant 原生事件） | `(checked: boolean) => void` |

### TmCheckableTag Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 标签文案 |

### TmCheckableTag Methods

业务侧通过 `ref` 可访问内部 ant CheckableTag 实例（经 `useForwardRef` 透传）。

### TmCheckableTag Types

```ts
import type { TmCheckableTagProps } from '@trustmo/tm-ui'
```

## 实现要点

- **值通道唯一**：`onUpdate:checked` 从透传对象中剔除，只保留模板上的显式绑定一条通道。若同时经 `$attrs` 透传，Vue 会把两个监听器合并成数组，ant 内部 `.call` 调用会崩溃（同 `TmUpload` 的 `onUpdate:fileList` 教训）。
- **无公司默认值**：选中态是纯业务语义，不做默认兜底。
- **ant 原生限制**：CheckableTag 未提供 `disabled`，如需禁用请在外层自行控制点击（如包一层 `pointer-events: none` 或改成普通 `TmTag`）。
