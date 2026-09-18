## Purpose

定义 TmFormItemRest 表单数据采集豁免区的公开行为：ant Form.Item.Rest 的库内薄封装，使区块内的控件不被所在表单字段采集。

## ADDED Requirements

### Requirement: 采集豁免契约

TmFormItemRest 内渲染的控件 SHALL NOT 被祖先 TmForm 的 `name` 路径采集（不参与 getFieldsValue 结果、不触发该字段的校验），控件自身功能不受影响。

#### Scenario: 内部控件不被采集
- **WHEN** 表单某字段内用 TmFormItemRest 包裹一个输入框并提交
- **THEN** 该输入框的值不出现在表单采集结果中，也不触发所属字段校验

### Requirement: 原生透传

TmFormItemRest SHALL 原样透传属性与插槽，不注入任何表单行为。

#### Scenario: 透传生效
- **WHEN** 业务传入属性或插槽内容
- **THEN** 原样渲染，无额外行为
