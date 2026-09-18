# SelectOptGroup 下拉选项分组

`TmSelect` 下拉选择器的库内别名（与原生 `<a-select-opt-group>` 是**同一个组件对象**）。把多个 `TmSelectOption` 收进一组，以 `label` 作为组标题展示，让长列表按维度分段。

## 何时使用

- 选项天然分组（按地区 / 按部门 / 按类型），希望下拉面板出现分组标题。
- 分组内选项仍需 `disabled`、多选、搜索等 ant 原生能力。

## 基础用法

`TmSelectOptGroup` 的 `label` 为组标题，其插槽内放若干 `TmSelectOption`；多个分组并列即可。分组只影响展示层级，选中值仍是具体选项的 `value`。

<script setup>
// 与 select-option 页共用同一份 demo 源文件（同一组件族，写法互通）
import SelectOptGroupDemo from '../../../packages/ui/src/components/select/demos/option-children.vue'
import SelectOptGroupDemoCode from '../../../packages/ui/src/components/select/demos/option-children.vue?raw'
</script>

<DemoBlock :code="SelectOptGroupDemoCode">
  <SelectOptGroupDemo />
</DemoBlock>

## 关键约束

> **不要同时传 `:options`**：一旦传入 `options`（哪怕是空数组 `[]`），ant 会切到配置驱动模式并忽略全部子组件，分组随之失效。分组场景请只写子组件，或改用 `options` 的嵌套 `children` 结构。

- 分组写法与 `TmSelectOption` 共用同一份选项识别机制（别名复用保 `vnode.type` 全等），因此多选回显、搜索过滤行为一致。
- 其余 API 详见 [ant-design-vue SelectOptGroup 文档](https://www.antdv.com/components/select-cn#SelectOptGroup)。

## API

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值。

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| `label` | 分组标题（必填，否则分组无标题展示） | `string` | - |
| `default` | 分组内的 `TmSelectOption` 列表 | `slot` | - |
