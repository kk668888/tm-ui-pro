# FormItemRest 表单采集豁免区

Form 表单的库内别名：标记一块**不被表单采集**的区域。与原生 `<a-form-item-rest>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 一个表单项（`TmFormItem` 带 `name`）内既有**要提交的主值**，又有**仅用于界面交互的辅助控件**（提示输入、临时筛选、UI 辅助框）。
- 辅助控件出现在表单里，但**不应**进入 `getFieldsValue()` 的采集结果，也不应参与校验。

## 基础用法

把辅助控件包进 `TmFormItemRest`，它的值不会进表单数据；`TmFormItemRest` 本身不接受任何 props，只有默认插槽。demo 中点击「查看采集值」可直观对比：`hint` 不在 `getFieldsValue()` 结果里。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import FormItemRestDemo from '../../../packages/ui/src/components/form/demos/item-rest.vue'
import FormItemRestDemoCode from '../../../packages/ui/src/components/form/demos/item-rest.vue?raw'
</script>

<DemoBlock :code="FormItemRestDemoCode">
  <FormItemRestDemo />
</DemoBlock>

## API

### TmFormItemRest Props

无 props。纯结构组件，仅提供默认插槽。

### TmFormItemRest Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 需要豁免采集的控件内容 |

### 行为说明

| 行为 | 普通子控件 | 包在 `TmFormItemRest` 内 |
| --- | --- | --- |
| 进入 `getFieldsValue()` | 是 | **否** |
| 参与所在 FormItem 的校验 | 是 | **否** |
| 随 `resetFields()` 复位 | 是 | **否**（需业务侧自行复位） |
| 视觉与布局 | - | 与普通子控件一致（无额外包裹层） |

> **注意**：豁免采集意味着该控件的值**完全由业务侧自行管理**——需要随表单重置时，请在重置逻辑里同步复位它（如 demo 中 `formState.hint` 由业务自行维护）。

### 实现机制

`TmFormItemRest` 内部重新 `provide` 了一份**空的 FormItem 上下文**，其下的控件因此不会向所在 `TmFormItem` 注册字段（ant 源码里 `FormItem` 只采集一个字段，多挂控件会触发官方 devWarning 提示使用 `a-form-item-rest`）。它自身不渲染任何包裹元素，只透传默认插槽内容。

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Form 文档](https://www.antdv.com/components/form-cn)。
