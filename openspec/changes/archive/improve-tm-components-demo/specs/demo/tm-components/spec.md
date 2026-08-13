## Purpose

定义 apps/demo 的 TM 组件集中陈列页行为：覆盖 @tm/ui 全部组件，按 5 类分组陈列，核心组件带可交互示例，作为业务选型与回归演示的统一入口。

## ADDED Requirements

### Requirement: 全组件陈列覆盖

tm-components 页 SHALL 陈列 @tm/ui 全部导出组件（约 67 个，含基础用法演示），按通用 / 表单 / 数据展示 / 反馈 / 全局配置 5 类分组，页面声明与现状一致。

#### Scenario: 分组展示缺失组件

- **WHEN** 用户浏览 tm-components 页
- **THEN** 每个缺失组件（如 Avatar / Card / Descriptions / List / Progress / Skeleton / Tour 等）在对应分组 section 展示基础用法，无遗漏

#### Scenario: 组件声明可运行

- **WHEN** 页面上某组件演示块挂载
- **THEN** 组件以最小可用形态渲染（关键 props 生效），不抛错

### Requirement: 关键组件交互示例

tm-components 页 SHALL 为业务核心组件提供带状态 / 事件的交互示例，真实反映 @tm/ui 能力。

#### Scenario: Table 远程分页与搜索

- **WHEN** 用户在 Table 演示中翻页 / 输入搜索 / 切换密度
- **THEN** 表格按远程数据源加载对应页数据，搜索过滤结果，密度调整行高

#### Scenario: Form 校验与联动

- **WHEN** 用户在 Form 演示中提交未通过校验的值
- **THEN** 表单项显示校验错误；字段联动（如选择联动禁用另一字段）即时生效；通过校验后提交反馈成功

#### Scenario: Tour 步骤引导可重放

- **WHEN** 用户点击开始引导并依次浏览步骤，完成后再次点击
- **THEN** 引导从第一步重新开始，关闭 / 完成均能正确收起（v-model:open 自闭合）

#### Scenario: 新批次能力示例

- **WHEN** 用户查看 Progress / Select 远程搜索 / DatePicker valueFormat 等新批次能力演示
- **THEN** 业务 status 映射、远程选项加载、字符串值格式化等公司默认语义正确展示

### Requirement: 测试与回归

tm-components 各 section SHALL 配套单元测试，断言演示块可挂载且关键 props 生效，防止组件库升级导致 demo 回归。

#### Scenario: section 测试覆盖新增块

- **WHEN** 运行 demo 测试套件
- **THEN** 每个新增演示块在对应 section 测试中覆盖挂载与关键行为
