# add-input-password

## Why

ant-design-vue 原生有 `Input.Password`（密码输入框，带可见性切换），但 `@trustmo/tm-ui` 只封装了 `TmInput`，未导出密码输入组件。业务侧模板写 `<tm-input-password>` / `<TmInputPassword>` 时：TmResolver 按 fail-fast 约定仍返回主入口，业务侧构建期即报 named export 缺失；全量注册场景则 dev 下警告 `Failed to resolve component`、生产构建静默渲染为未知元素。密码输入是登录/改密等表单的基础场景，库内能力缺口需要补齐。

## What Changes

- 新增 `TmInputPassword` 组件（目录 `packages/ui/src/components/input-password/`）：对 ant `Input.Password` 的薄封装，完整沿用 `TmInput` 已确立的封装模式
  - v-model 桥接：业务侧标准 `v-model`（`modelValue`），内部映射 ant 的 `v-model:value`
  - `$attrs` 透传（`inheritAttrs: false` + 手动合并）、全部插槽透传（含 `iconRender` 自定义眼睛图标）、ref 方法透传（`focus` / `blur` / `select`）
  - 公司默认值兜底（`allowClear` / `size` / `bordered`），业务显式传入可覆盖
  - FormContext 级联：未显式传 `readonly` / `disabled` 时级联祖先 `TmForm` 状态
- 注册主出口：`packages/ui/src/components.ts` 清单与 `packages/ui/src/index.ts` 导出追加 `TmInputPassword`（TmResolver 无需改动，导出后自动按需解析成功）
- 交付清单全项：单元测试（`__tests__/InputPassword.spec.ts`）、demo 应用表单陈列页接入、文档站（`apps/docs`）新增组件页与 sidebar 登记
- 非 Goal（明确不做）：不新增密码强度计、规则校验逻辑（校验由 TmFormItem/TmForm 与 validation 体系承担）；不做 `TmInputOtp` 等其它 input 变体

## Capabilities

### New Capabilities

- `components/input-password`: TmInputPassword 密码输入组件——v-model 值契约、密码可见性切换（visibilityToggle / iconRender）、ant Input 能力透传（size/allowClear/bordered/prefix/suffix/addon）、FormContext 级联与 ref 方法透传

### Modified Capabilities

（无——现有组件 spec 均不受影响）

## Impact

- **新增代码**：`packages/ui/src/components/input-password/`（`index.ts` / `src/InputPassword.vue` / `src/props.ts` / `src/defaults.ts` / `demos/basic.vue` / `__tests__/InputPassword.spec.ts`）
- **注册与导出**：`packages/ui/src/components.ts`、`packages/ui/src/index.ts` 追加 `TmInputPassword`；demo 组件陈列页（`apps/demo/.../Form.section.vue`）接入；文档站新增组件页与 sidebar 项
- **依赖**：无新增第三方依赖（`Input.Password` 来自既有 ant-design-vue）
- **风险**：低——完全复用 TmInput 范本模式；主要注意点为 `visibilityToggle` 布尔 prop 的幻影 false 语义（参照 TmInput 对 `bordered`/`readonly` 的 withDefaults 处理经验）与 `iconRender` 插槽透传
