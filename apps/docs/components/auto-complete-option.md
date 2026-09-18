# AutoCompleteOption 自动完成选项

`TmAutoComplete` 自动完成的库内别名（与原生 `<a-auto-complete-option>` 是**同一个组件对象**）。用于在 `<TmAutoComplete>` 内以模板子组件写法声明候选项，与 `options` prop 等价。

## 何时使用

- 候选数量少且固定，希望直接在模板里列出（不必构造 `options` 数组）。
- 需要给单个候选项挂自定义插槽内容（图标 / 副标题）。

## 基础用法

`TmAutoCompleteOption` 作为 `<TmAutoComplete>` 的子节点，`value` 既是候选值也是默认显示文本。注意 `TmAutoComplete` 未新增 `modelValue`，沿用 ant 的 `v-model:value` 契约；库内还内置了 `filterOption` 默认（大小写不敏感子串过滤），输入即过滤。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import AutoCompleteOptionDemo from '../../../packages/ui/src/components/auto-complete/demos/option-children.vue'
import AutoCompleteOptionDemoCode from '../../../packages/ui/src/components/auto-complete/demos/option-children.vue?raw'
</script>

<DemoBlock :code="AutoCompleteOptionDemoCode">
  <AutoCompleteOptionDemo />
</DemoBlock>

## 关键约束

> **不要同时传 `:options`**。AutoComplete 复用 Select 的子组件识别机制，同样以 `!options && children` 判定模式——传了 `options`（含空数组）就会忽略子组件。

- 与 `TmAutoComplete` 的其他差异同 [AutoComplete 页](./auto-complete.md)：`filterOption` 公司默认开启，传 `false` 可关闭、传函数可自定义。
- 其余 API 详见 [ant-design-vue AutoCompleteOption 文档](https://www.antdv.com/components/auto-complete-cn)。

## API

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 候选项取值（选中后写入 `v-model:value`） | `string \| number` | - |
| `label` | 候选项显示文本（未用插槽时的文本来源） | `string` | - |
| `disabled` | 该候选项是否禁用 | `boolean` | `false` |
