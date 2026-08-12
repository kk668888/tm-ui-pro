# AutoComplete 自动完成

基于 [ant-design-vue](https://www.antdv.com/components/auto-complete-cn) AutoComplete 的薄封装。保留 ant 全部能力，`options` 数据源语义与 TmSelect 对齐，无公司扩展键。

## 何时使用

- 输入联想匹配，从候选中选择。
- 需要 `options` 数据源、allowClear、filterOption 能力。

## 基础用法

options 数据源自动完成。

<script setup>
import AutoCompleteDemo from '../../../packages/ui/src/components/auto-complete/demos/basic.vue'
import AutoCompleteDemoCode from '../../../packages/ui/src/components/auto-complete/demos/basic.vue?raw'

const props = [
  { prop: 'options', desc: '候选项（ant 原生，{ value, label } 结构，语义对齐 TmSelect）', type: 'AutoCompleteOption[]', default: '-' },
  { prop: 'value', desc: '当前值（v-model:value）', type: 'string', default: '-' },
  { prop: 'filterOption', desc: '过滤函数：公司默认开启（按 value 大小写不敏感子串匹配）；传 `false` 关闭、传函数自定义', type: 'boolean | function', default: '默认过滤' },
  { prop: '其余属性', desc: '透传 ant AutoComplete 全部 props / events（如 `placeholder` / `allowClear` / `@select`）', type: 'AutoCompleteProps', default: '-' },
]
</script>

<DemoBlock :code="AutoCompleteDemoCode">
  <AutoCompleteDemo />
</DemoBlock>

> 注：ant AutoComplete 的 `filterOption` 默认 `false`（输入不过滤、展示全部选项，易误选首个）。
> TmAutoComplete 提供公司默认过滤（按 value 匹配），业务可传 `filterOption` 函数覆盖或 `false` 关闭。

## API

### TmAutoComplete Props

<TmPropsTable :data="props" />

### TmAutoComplete Events

| 事件 | 说明 |
| --- | --- |
| `select` / `change` | 选中 / 值变化（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant AutoComplete 实例（经 `useForwardRef` 透传）。
