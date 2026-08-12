# Mentions 提及

基于 [ant-design-vue](https://www.antdv.com/components/mentions-cn) Mentions 的薄封装。导出 `TmMentions` / `TmMentionsOption`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- @提及、#提及等输入联想。
- 需要 `options` 数据源或 `prefix` 自定义触发前缀。

## 基础用法

options 数据源 + @ 触发。

<script setup>
import MentionsDemo from '../../../packages/ui/src/components/mentions/demos/basic.vue'
import MentionsDemoCode from '../../../packages/ui/src/components/mentions/demos/basic.vue?raw'

const props = [
  { prop: 'options', desc: '提及候选（ant 原生，{ value, label }）', type: 'OptionsType[]', default: '-' },
  { prop: 'prefix', desc: '触发前缀：@ / # 或数组（ant 原生）', type: 'string | string[]', default: '@' },
  { prop: '其余属性', desc: '透传 ant Mentions 全部 props / events（如 `value` / `rows` / `placeholder` / `@change` / `@select`）', type: 'MentionsProps', default: '-' },
]
</script>

<DemoBlock :code="MentionsDemoCode">
  <MentionsDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmMentions` | Mentions |
| `TmMentionsOption` | Mentions.Option（选项，懒渲染） |

### TmMentions Props

<TmPropsTable :data="props" />

### TmMentions Events

| 事件 | 说明 |
| --- | --- |
| `change` / `select` | 值变化 / 选中提及（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Mentions 实例（经 `useForwardRef` 透传）。
