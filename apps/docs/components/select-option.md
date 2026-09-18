# SelectOption 下拉选项

`TmSelect` 下拉选择器的库内别名（别名复用：与原生 `<a-select-option>` 是**同一个组件对象**，`withInstall` 后 `vnode.type` 全等）。用于在 `<TmSelect>` 内以模板子组件写法声明选项，与 `options` prop 配置驱动**完全等价**。

## 何时使用

- 选项可枚举、数量少，且希望写法更贴近模板（选项文本直接用插槽写，不必构造 `options` 数组）。
- 需要给单个选项挂 `disabled` / `label` / 自定义插槽内容。
- 从 ant 项目迁移过来、已有 `<a-select-option>` 写法的存量代码。

## 基础用法

`TmSelectOption` 直接作为 `<TmSelect>` 的子节点，`value` 为取值、插槽内容为显示文本；配合 `TmSelectOptGroup` 可分组展示，children 写法同样支持 `mode="multiple"` / `show-search` 等 ant 原生能力。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import SelectOptionDemo from '../../../packages/ui/src/components/select/demos/option-children.vue'
import SelectOptionDemoCode from '../../../packages/ui/src/components/select/demos/option-children.vue?raw'
</script>

<DemoBlock :code="SelectOptionDemoCode">
  <SelectOptionDemo />
</DemoBlock>

## 两种写法对比

| 维度 | `options` prop（配置驱动） | `TmSelectOption` 子组件（模板驱动） |
| --- | --- | --- |
| 数据形态 | 数组，来自接口时零转换 | 模板结构，适合枚举型固定选项 |
| 选项内容 | `label` 字段（或 `fieldNames` 映射） | 插槽，可放图标 / 富文本 |
| 动态增删 | 数据驱动，天然响应式 | 需 `v-for` 包裹子组件 |
| 大数据量 | 推荐（配合 `virtual`） | 不推荐 |

## 关键约束

> **不要同时传 `:options`**。ant 内部以 `const childrenAsData = !!(!props.options && props.children)` 判定模式：只要 `options` 是真值就切到配置驱动、忽略子组件。**空数组 `[]` 也是 truthy**，传了 `:options="[]"` 会静默禁用模板子组件模式（表现为只回显原始 `value` 而不显示选项文本）。

- 别名复用保证 ant 的内部标记（`isSelectOption`）与 `vnode.type` 不丢，因此选项识别、`labelInValue`、检索过滤等行为与原生写法一致。
- 其余 API（props / slots / events）详见 [ant-design-vue SelectOption 文档](https://www.antdv.com/components/select-cn#SelectOption)（英文对照见 [antdv 组件总览](https://www.antdv.com/components/overview-cn/)）。

## API

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `value` | 该选项的取值（选中后写入 `v-model`） | `string \| number \| boolean` | - |
| `label` | 选项显示文本（未用插槽时的文本来源） | `string` | - |
| `disabled` | 该选项是否禁用 | `boolean` | `false` |
