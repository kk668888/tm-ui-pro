# AutoCompleteOptGroup 候选分组

`TmAutoComplete` 自动完成的库内别名（与原生 `<a-auto-complete-opt-group>` 是**同一个组件对象**）。把多个 `TmAutoCompleteOption` 收进一组，以 `label` 作为组标题在下拉面板中分段展示。

## 何时使用

- 候选项天然分类（按来源 / 按模块），希望下拉面板出现分组标题。
- 分组内候选项仍需过滤、禁用等 ant 原生能力。

## 基础用法

`label` 为组标题，插槽内放若干 `TmAutoCompleteOption`；分组只影响展示层级，写入 `v-model:value` 的仍是具体候选项的 `value`。

<script setup>
// 与 auto-complete-option 页共用同一份 demo 源文件（同一组件族，写法互通）
import AutoCompleteOptGroupDemo from '../../../packages/ui/src/components/auto-complete/demos/option-children.vue'
import AutoCompleteOptGroupDemoCode from '../../../packages/ui/src/components/auto-complete/demos/option-children.vue?raw'
</script>

<DemoBlock :code="AutoCompleteOptGroupDemoCode">
  <AutoCompleteOptGroupDemo />
</DemoBlock>

## 关键约束

> **不要同时传 `:options`**：传入 `options`（含空数组 `[]`）会切到配置驱动模式并忽略全部子组件，分组随之失效。

- 输入过滤由 `TmAutoComplete` 的公司默认 `filterOption`（大小写不敏感子串匹配）驱动，分组不改变过滤行为。
- 其余 API 详见 [ant-design-vue AutoCompleteOptGroup 文档](https://www.antdv.com/components/auto-complete-cn)。

## API

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 分组标题 | `string` | - |
| `default` | 分组内的 `TmAutoCompleteOption` 列表 | `slot` | - |
