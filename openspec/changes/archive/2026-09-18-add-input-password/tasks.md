# add-input-password — Tasks

## 1. 组件实现

- [x] 1.1 创建 `packages/ui/src/components/input-password/src/props.ts`：按 design D2 声明 `TmInputPasswordExtProps`（`modelValue` / `visibilityToggle` / `visible`）与 `TmInputPasswordProps = InputProps & TmInputPasswordExtProps`，re-export `InputProps`
- [x] 1.2 创建 `packages/ui/src/components/input-password/src/defaults.ts`：复用 `input/src/defaults.ts` 的 `tmInputDefaults`，追加 `visibilityToggle: true` 兜底
- [x] 1.3 创建 `packages/ui/src/components/input-password/src/InputPassword.vue`：按 design D1/D3/D4 实现——`inheritAttrs: false`、值通道剥离（modelValue/value/defaultValue/onUpdate:value）、`visible`/`onChange` 不剥离、`withDefaults` 兜底（allowClear/size/bordered/visibilityToggle，readonly/disabled/visible 置 undefined 落空 FormContext）、`useForwardBindings` 透传、`useForwardRef` 方法透传、`slotNames` v-for 插槽转发（含 iconRender）、computed 桥接 `v-model` ↔ `v-model:value`，清空 emit `''`
- [x] 1.4 创建 `packages/ui/src/components/input-password/index.ts` 导出组件与类型

## 2. 注册与导出

- [x] 2.1 `packages/ui/src/components.ts` 清单追加 `TmInputPassword` 导入与注册
- [x] 2.2 `packages/ui/src/index.ts` 追加 `TmInputPassword` 及类型导出（主出口；TmResolver 无需改动，自动解析生效）

## 3. 单元测试

- [x] 3.1 创建 `packages/ui/src/components/input-password/__tests__/InputPassword.spec.ts`：覆盖 spec 全场景——v-model 桥接与清空 emit `''`、密文默认与可见性切换、`visibilityToggle: false`、iconRender 插槽（组件包装为 `{ visible }` scope，实现期确立）点击切换、默认值兜底与业务覆盖、suffix 在任何配置下不渲染（ant 原生限制断言）、FormContext readonly/disabled 级联与显式覆盖、ref `focus`/`blur` 透传

## 4. demo 应用接入

- [x] 4.1 `apps/demo/src/pages/tm-components/features/components/Form.section.vue` 接入 `TmInputPassword` 演示项（基础 v-model + 禁用态）

## 5. 文档站（交付清单全项）

- [x] 5.1 创建 `packages/ui/src/components/input-password/demos/basic.vue` 基础示例（v-model + placeholder + 切换 + iconRender 自定义图标；suffix 因 ant 原生限制不可用，不展示）
- [x] 5.2 创建 `apps/docs/components/input-password.md`：组件说明、何时使用、示例（引 demos/basic.vue 与 `?raw` 源码）、API 表（modelValue/visibilityToggle/visible/默认值/级联说明；标注 suffix 不可用与仅暴露 focus/blur 两项 ant 原生限制）
- [x] 5.3 `apps/docs/.vitepress/config.ts` sidebar 基础组件分组登记 `InputPassword 密码输入框 → /components/input-password`

## 6. 验证收口

- [x] 6.1 `pnpm --filter @trustmo/tm-ui test` 全绿（712/712，含新 spec 20 用例）；`vue-tsc`/`vite:dts` 双路径类型检查通过（修复主出口 InputProps 重复导出 TS2300）
- [x] 6.2 `pnpm check`（lint+typecheck+coverage+build:ui+build:docs）EXIT=0 通过；dist 产物验证 `TmInputPassword` 可从主出口具名导入（cjs/es 双路径）
- [x] 6.3 kebab 解析静态验证：`<tm-input-password>` → Vue camelize+capitalize → `TmInputPassword`，components.ts 全量注册清单 + dist 导出均已确认；浏览器人工复核留给业务验收（遵循「不运行项目」约定）
