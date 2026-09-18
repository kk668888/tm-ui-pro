# Mentions 提及

基于 [ant-design-vue](https://www.antdv.com/components/mentions-cn) Mentions 的薄封装。导出 `TmMentions` / `TmMentionsOption`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- @提及、#提及等输入联想。
- 需要 `options` 数据源或 `prefix` 自定义触发前缀。
- 存量 ant 代码使用 `<a-mentions-option>` 子组件写法，需要等价迁移（见下方「子组件写法」）。

## 基础用法

options 数据源 + @ 触发。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import MentionsDemo from '../../../packages/ui/src/components/mentions/demos/basic.vue'
import MentionsDemoCode from '../../../packages/ui/src/components/mentions/demos/basic.vue?raw'
import MentionsOptionDemo from '../../../packages/ui/src/components/mentions/demos/option-children.vue'
import MentionsOptionDemoCode from '../../../packages/ui/src/components/mentions/demos/option-children.vue?raw'

// TmPropsTable 数据：TmMentions Props 表格（数据驱动渲染）
const props = [
  { prop: 'options', desc: '提及候选（ant 原生，{ value, label }）；**推荐写法**，与子组件写法等价', type: 'OptionsType[]', default: '-' },
  { prop: 'prefix', desc: '触发前缀：@ / # 或数组（ant 原生）', type: 'string | string[]', default: '@' },
  { prop: '其余属性', desc: '透传 ant Mentions 全部 props / events（如 `value` / `rows` / `placeholder` / `@change` / `@select`）', type: 'MentionsProps', default: '-' },
]
</script>

<DemoBlock :code="MentionsDemoCode">
  <MentionsDemo />
</DemoBlock>

## 子组件写法（TmMentionsOption）

`TmMentionsOption` 是 `Mentions.Option` 的库内封装：`value` 为选中后回填的值，默认插槽为候选文案，与 `:options` 数据驱动的候选列表完全等价。

> **ant 4.2.6 已将该写法标记为废弃**：仍可正常渲染，但开发环境会打印
> `` `Mentions.Option` is deprecated. Please use `options` instead. ``
> 因此**新代码请统一用 `:options`**；下面左侧卡片保留子组件写法，仅用于存量 `a-mentions-option` 代码的对照迁移与行为验证。

<DemoBlock :code="MentionsOptionDemoCode">
  <MentionsOptionDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant | 说明 |
| --- | --- | --- |
| `TmMentions` | Mentions | 容器：`options` / `prefix` / `value` |
| `TmMentionsOption` | Mentions.Option | 单个候选（`value` + 默认插槽文案）；**ant 4.2.6 已废弃**，新代码用 `:options` |

### TmMentions Props

<TmPropsTable :data="props" />

### TmMentions Events

| 事件 | 说明 |
| --- | --- |
| `change` / `select` | 值变化 / 选中提及（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant Mentions 实例（经 `useForwardRef` 透传）。
