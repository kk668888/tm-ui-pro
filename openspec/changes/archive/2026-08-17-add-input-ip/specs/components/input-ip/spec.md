# components/input-ip 变更规格

## Purpose

定义 TmInputIp：四段式 IPv4 地址输入组件。用户只需键入数字即可分段填写 IP 地址，段间自动跳转，键入即拦截非法输入，并以完整合法字符串或空串对外提供 v-model 值。

## ADDED Requirements

### Requirement: v-model 值契约

TmInputIp SHALL 以 `modelValue: string` 对外双向绑定。四段全部填写且每段值在 0–255 范围内时，SHALL emit 点分完整字符串（如 `192.168.1.1`，按各段显示原文组装，不隐式归一前导零）；任一段为空或越界时，SHALL emit `''`。业务侧通过表单 required/自定义 rule 判断是否必填，组件不内置必填校验。

#### Scenario: 四段齐全时 emit 完整 IP

- **WHEN** 四段分别填入 `192`、`168`、`1`、`1` 且均合法
- **THEN** modelValue 更新为 `192.168.1.1`

#### Scenario: 未填齐时 emit 空串

- **WHEN** 仅前三段填入 `192`、`168`、`1`，第四段为空
- **THEN** modelValue 为 `''`

#### Scenario: 前导零按原文组装

- **WHEN** 第二段显示为 `01`
- **THEN** modelValue 中该段按原文输出（如 `192.01.1.1`），组件不隐式改写为 `1`

### Requirement: 分段键入与跳段

TmInputIp SHALL 由四个独立输入段组成，段间以 `.` 分隔展示。某段输入满 3 位数字、或用户键入 `.` 时，SHALL 自动聚焦下一段；在段首按退格键时，SHALL 聚焦回上一段并删除其末位数字；`←` / `→` 在段边界处 SHALL 跨段移动焦点。用户全程无需键入 `.` 即可完成输入。

#### Scenario: 段满自动跳段

- **WHEN** 焦点在第一段并连续键入 `192`
- **THEN** 第三位数字输入后焦点自动移至第二段

#### Scenario: 键入点号跳段

- **WHEN** 焦点在值为 `192` 的段内键入 `.`
- **THEN** 不输入任何字符，焦点移至下一段

#### Scenario: 段首退格回跳

- **WHEN** 焦点在第二段且光标位于段首（该段已空或光标在 0 位）按退格键
- **THEN** 焦点移至第一段末尾并删除其末位数字

#### Scenario: 方向键跨段移动

- **WHEN** 焦点在某段内且光标位于段首按 `←`（或段尾按 `→`）
- **THEN** 焦点移至上一段末尾（或下一段段首）

### Requirement: 键入拦截与段值约束

TmInputIp SHALL 在键入层拦截所有非数字字符；每段 SHALL 仅接受使该段数值保持 ≤ 255 的数字输入，导致越界的数字 SHALL 触发跳段（作为下一段首数字）而非被静默丢弃；每段长度 SHALL 不超过 3 位。拦截仅在键入路径生效，不影响程序设值路径（后者由非法值展示策略约束）。

#### Scenario: 非数字字符被拦截

- **WHEN** 在任一段键入字母、符号或空格
- **THEN** 该字符不进入输入框，段值不变

#### Scenario: 越界数字触发跳段

- **WHEN** 某段当前值为 `25`，继续键入 `6`
- **THEN** 段值保持 `25`，焦点移至下一段且 `6` 作为下一段首数字填入

#### Scenario: 段长上限

- **WHEN** 某段已有 3 位数字，继续键入数字
- **THEN** 若该 3 位数非末段则触发跳段承载新数字；若为末段则忽略该次键入

### Requirement: 粘贴解析分发

TmInputIp SHALL 支持在任意段粘贴 IPv4 文本：带点原文（如 `192.168.1.1`）与纯数字（如 `19216811`）SHALL 均按段位分发填充；无法解析为四段合法值的粘贴内容 SHALL 不改变现有段值。

#### Scenario: 粘贴带点 IP

- **WHEN** 在第一段粘贴 `192.168.1.1`
- **THEN** 四段分别填入 `192`、`168`、`1`、`1`，焦点移至末段末尾

#### Scenario: 粘贴纯数字

- **WHEN** 在第一段粘贴 `19216811`
- **THEN** 按每段最多 3 位顺序分发为 `192`、`168`、`1`、`1`

#### Scenario: 非法粘贴被拒绝

- **WHEN** 粘贴 `abc` 或 `999.1.1.1`
- **THEN** 各段保持粘贴前的值不变

### Requirement: 半成品保留与初始非法值展示

TmInputIp 在失焦时 SHALL 保留未填齐的半成品段值显示（不清空、不强制完成）；程序设置的 modelValue 含越界段（如 `999.1.1.1`）时，SHALL 按原文分段显示且越界段呈现 error 视觉态，SHALL NOT 静默截断或改写该值。

#### Scenario: blur 保留半成品

- **WHEN** 已填入 `192`、`168` 两段后点击组件外部使输入框失焦
- **THEN** 两段显示保持不变，modelValue 仍为 `''`

#### Scenario: 初始非法段标红

- **WHEN** 程序设置 modelValue 为 `999.1.1.1`
- **THEN** 第一段显示 `999` 并呈现 error 态，其余段正常显示

### Requirement: 视觉与状态一致性

TmInputIp SHALL 基于 ant design token 呈现与库内其他表单控件一致的视觉：支持 size 三档、disabled、readonly、focus 态、error 态；readonly 时 SHALL 只读展示段值不可编辑，disabled 时 SHALL 置灰不可交互。

#### Scenario: disabled 置灰

- **WHEN** 业务传入 `disabled`
- **THEN** 组件整体置灰，四段均不可聚焦编辑

#### Scenario: readonly 只读展示

- **WHEN** 业务传入 `readonly` 且 modelValue 为 `192.168.1.1`
- **THEN** 段值可见但不可编辑，不呈现置灰样式

### Requirement: FormContext 级联

TmInputIp SHALL 注入祖先 TmForm 联动上下文：业务显式传入的 `disabled` / `readonly` 优先；未传时 SHALL 级联 TmForm 的同名状态；两者皆无时保持默认可编辑。

#### Scenario: 级联 TmForm disabled

- **WHEN** 业务未显式传 disabled 且祖先 TmForm 的 disabled 为真
- **THEN** 组件整体禁用不可交互

#### Scenario: 业务显式覆盖级联

- **WHEN** 祖先 TmForm 的 readonly 为真但业务显式传 `readonly: false`
- **THEN** 组件保持可编辑

### Requirement: 焦点方法

TmInputIp SHALL 通过组件 ref 暴露 `focus()` 与 `blur()` 方法：`focus()` SHALL 聚焦至第一个空段（全部已填时聚焦末段），`blur()` SHALL 使当前聚焦段失焦。

#### Scenario: focus 定位首个空段

- **WHEN** 前两段已填，调用 `ref.focus()`
- **THEN** 第三段获得焦点且光标位于段首
