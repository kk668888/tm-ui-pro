# @tm/ui 组件库设计规格（Design Spec）

- **日期**：2026-08-05
- **项目**：`tm-ui-new`（全新空项目，当前仅有 `package.json`）
- **状态**：待审阅（Draft）
- **产物范围**：v1 = monorepo 骨架 + 封装基座 + 5 个范本组件 + 构建产物 + 文档站 + 测试 + 发包配置

---

## 1. 背景与目标

在公司内部基于成熟 UI 框架二次封装一套**统一、可发布、可扩展**的组件库 `@tm/ui`，用于消除各业务系统在组件层面的重复封装，统一交互与升级节奏。

**设计哲学**：纯薄封装（透明代理）——默认 100% 透传底层组件的 props / slots / events / 实例方法，仅在透传链路上"插入"公司默认值与高频通用扩展，绝不阻断原生能力。

**成功标准**：

1. 业务方使用 `TmXxx` 与使用原生组件的 API 完全一致（含 IDE 类型提示）；
2. 默认值与扩展能力可被业务覆盖；
3. 表格（vxe）与基础组件（ant）视觉同源、主题联动；
4. 后续新增组件可脚本化批量生成，单组件封装成本极低。

---

## 2. 技术栈与现状

| 维度       | 情况                                                                 |
| ---------- | -------------------------------------------------------------------- |
| 项目状态   | 全新，仅 `package.json`（无构建脚本、无源码、非 git 仓库）           |
| 基础 UI 库 | `ant-design-vue ^4.2.6` + `@ant-design/icons-vue ^7`（cssinjs 主题） |
| 表格方案   | `vxe-table 4.20` + `vxe-pc-ui 4.16` + `@vxe-ui/core 4.4`             |
| 框架       | Vue 3.5 + TypeScript 5.5 + Vite 8                                    |
| 包管理     | pnpm 11.13.1                                                         |
| 测试       | vitest + @vue/test-utils + jsdom + msw（已就绪）                     |

---

## 3. 核心决策

| #   | 维度     | 决策                                                                                         |
| --- | -------- | -------------------------------------------------------------------------------------------- |
| 1   | 定位     | 独立可发布组件库 `@tm/ui`（npm 包）                                                          |
| 2   | 封装策略 | 纯薄封装（透明代理），100% 透传                                                              |
| 3   | 表格     | 基于 **vxe-table**，置于主包；vxe 全家桶作为 peerDependency                                  |
| 4   | 样式     | 纯 ant 令牌（cssinjs），**不用 Tailwind**；v1 用 ant 默认主题 + 预留 `ConfigProvider` 扩展点 |
| 5   | 结构     | **pnpm monorepo**：`packages/ui` + `apps/docs`                                               |
| 6   | 组件范围 | 先搭骨架 + 5 个范本组件，后续渐进扩充                                                        |
| 7   | 命名     | 包名 `@tm/ui`，组件前缀 `Tm`（TmButton、TmInput…）                                           |
| 8   | 构建     | Vite library mode + vite-plugin-dts；peerDep 全部 external                                   |
| 9   | 文档     | VitePress 组件文档站（`apps/docs`）                                                          |

---

## 4. 总体架构与目录结构

```
tm-ui-new/
├─ package.json              # 根：pnpm workspace 协议 + 公共工具（typescript/eslint/prettier）
├─ pnpm-workspace.yaml       # 声明 packages/* 与 apps/*
├─ tsconfig.base.json        # 根 TS 配置，子包 extends
├─ packages/
│  └─ ui/
│     ├─ package.json        # name: @tm/ui；peerDep 6 项；exports 多入口
│     ├─ vite.config.ts      # lib mode + vite-plugin-dts
│     ├─ tsconfig.json
│     └─ src/
│        ├─ index.ts         # 聚合导出 + Vue 插件 install()
│        ├─ components/      # 每组件一个目录（见第 6 节）
│        │  ├─ button/   input/   select/   form/   table/
│        ├─ composables/   # 封装基座：useForwardRef 等通用 composable
│        └─ config-provider/ # TmConfigProvider（主题扩展点 + vxe 桥接）
└─ apps/
   └─ docs/                  # VitePress 文档站
      └─ package.json        # 承载 pinia/router/axios/echarts/Tailwind 等应用级依赖
```

**关键约束**：

- 核心库 `packages/ui` **零应用依赖**——所有应用级依赖隔离到 `apps/docs`。
- `vue`、`ant-design-vue`、`@ant-design/icons-vue`、`vxe-table`、`vxe-pc-ui`、`@vxe-ui/core` 均为 **peerDependency**，业务方自行安装。
- 表格置于主包，vxe 成为 peerDep：未 `import TmTable` 的页面经 tree-shaking 不会把 vxe 带进 bundle，实际产物体积不受影响。

---

## 5. 封装基座（薄封装的核心机制）

纯薄封装要解决 5 类透传问题，用一套**通用 composable + 组件模板**统一解决。

### 5.1 Props 与类型透传

复用底层组件的 Props 类型作为 `defineProps` 泛型，IDE 提示与原生一致：

```vue
<script setup lang="ts">
import { Button as AButton } from 'ant-design-vue'
import type { ButtonProps } from 'ant-design-vue'

defineOptions({ name: 'TmButton', inheritAttrs: false })
const props = withDefaults(defineProps<ButtonProps>(), {
  type: 'primary'
})
</script>
```

### 5.2 Attributes / Events 透传

`inheritAttrs: false` + `v-bind="$attrs"`。Vue 3 中未声明的 props 与事件回调（`onClick` 等）都落入 `$attrs`，一次绑定全部转发。

### 5.3 实例方法透传（`useForwardRef`）

用 `Proxy` 代理内部实例的全部方法/属性，无需逐一列举：

```ts
// packages/ui/src/composables/useForwardRef.ts
import { ref, type ComponentPublicInstance } from 'vue'

/** 把内部组件实例的全部方法/属性代理给父组件 ref */
export function useForwardRef<T extends ComponentPublicInstance>() {
  const innerRef = ref<T | null>(null)
  const exposed = new Proxy({} as T, {
    get: (_target, key: string) => innerRef.value?.[key as keyof T]
  })
  return { innerRef, exposed }
}
```

### 5.4 插槽透传

遍历 `$slots` 转发所有具名插槽（含作用域参数）：

```vue
<template v-for="(_, name) in $slots" #[name]="slotData">
  <slot
    :name="name"
    v-bind="slotData ?? {}" />
</template>
```

### 5.5 v-model 透传

声明 `modelValue` + `update:modelValue` 后天然兼容 ant 受控语法；多 `v-model` 同理。

---

## 6. 组件目录规范（按复杂度分层）

每个组件是自包含目录，实现文件收入 `src/`，根目录只留出口与配套设施。

### 6.1 简单组件（Button / Input / Select）

```
components/button/
├─ index.ts                  # 出口：导出组件 + 类型 + withInstall
├─ src/
│  ├─ Button.vue            # 封装主体：<script setup> 装配 + 模板透传
│  ├─ defaults.ts           # 公司默认 props 常量
│  └─ props.ts              # 类型 re-export（Props / 扩展类型）
├─ __tests__/
│  └─ Button.spec.ts
└─ demos/
   └─ basic.vue
```

### 6.2 联动型组件（Form）

```
components/form/
├─ index.ts                  # 聚合导出 TmForm + TmFormItem
├─ src/
│  ├─ Form.vue
│  ├─ FormItem.vue
│  ├─ defaults.ts
│  ├─ props.ts
│  └─ composables/
│     └─ useFormContext.ts  # provide/inject 联动逻辑（独立可测）
├─ __tests__/
└─ demos/
```

### 6.3 复杂组件（Table —— vxe）

```
components/table/
├─ index.ts
├─ src/
│  ├─ Table.vue             # 基于 vxe-grid 封装
│  ├─ defaults.ts           # 公司默认列/分页/工具栏配置
│  ├─ props.ts              # re-export vxe 类型 + 业务列类型扩展
│  ├─ components/           # 列渲染器、自定义工具栏等子组件
│  └─ composables/
│     ├─ useColumns.ts      # 列配置归一化
│     └─ usePagination.ts   # 分页逻辑
├─ style/
│  └─ vxe-align.css         # vxe↔ant 视觉对齐（CSS 变量映射）
├─ __tests__/
└─ demos/
```

### 6.4 `withInstall` 出口模式

每个组件可独立 `app.use`：

```ts
// components/button/index.ts
import Button from './src/Button.vue'
import type { App } from 'vue'

export const TmButton = {
  ...Button,
  install: (app: App) => app.component('TmButton', Button)
}
export * from './src/props'
export default TmButton
```

`packages/ui/src/index.ts` 再聚合成总出口（含全量 `install`）。

---

## 7. 扩展性设计

### 7.1 扩展的三种模式

| 模式     | 做什么        | 例子                              | 实现                   |
| -------- | ------------- | --------------------------------- | ---------------------- |
| 行为扩展 | 拦截/增强事件 | 防抖 `debounce`、异步自动 loading | composable + 拦截 emit |
| 结构扩展 | 包裹/替换渲染 | 二次确认 `confirm`                | 条件组件包裹           |
| 渲染扩展 | 控制显隐/外观 | 权限 `auth`、loading 合并         | composable 返回状态    |

> 直接用 ant 原生能力不算扩展（已 100% 透传）。扩展 = 在透传之外新增公司特有通用能力。

### 7.2 标准 4 步法（以 `TmButton` 加 `debounce` + `confirm` 为例）

**第 1 步——扩类型**（`src/props.ts`）：

```ts
import type { ButtonProps } from 'ant-design-vue'

export interface TmButtonExtProps {
  debounce?: number // 点击防抖间隔（ms）
  confirm?: string // 点击前二次确认文案，传入则用 Popconfirm 包裹
}
export type TmButtonProps = ButtonProps & TmButtonExtProps
```

**第 2 步——拆逻辑**（`src/composables/useDebounceClick.ts`，单一职责、独立可测）：

```ts
import type { TmButtonProps } from '../props'
import type { MouseEvent } from 'vue'

export function useDebounceClick(
  props: TmButtonProps,
  emit: (e: 'click', ev: MouseEvent) => void
) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const onClick = (ev: MouseEvent) => {
    if (!props.debounce) return emit('click', ev) // 未配置 → 零开销透传
    clearTimeout(timer)
    timer = setTimeout(() => emit('click', ev), props.debounce)
  }
  return { onClick }
}
```

**第 3 步——装配 + 剥离扩展属性**（`src/Button.vue`）：

```vue
<script setup lang="ts">
import { computed } from 'vue'
import { Button as AButton, Popconfirm } from 'ant-design-vue'
import type { TmButtonProps } from './props'
import { useDebounceClick } from './composables/useDebounceClick'

defineOptions({ name: 'TmButton', inheritAttrs: false })
const props = withDefaults(defineProps<TmButtonProps>(), {
  type: 'primary',
  debounce: 0,
  confirm: undefined
})
const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()
const { onClick } = useDebounceClick(props, emit)

// ★ 关键：剥离扩展属性，只把 ant 认识的属性绑给内部按钮
const antProps = computed(() => {
  const { debounce, confirm, ...rest } = props
  return rest
})
</script>

<template>
  <Popconfirm
    v-if="props.confirm"
    :title="props.confirm"
    @confirm="onClick">
    <AButton
      v-bind="$attrs"
      v-bind="antProps">
      <template
        v-for="(_, n) in $slots"
        #[n]="d"
        ><slot
          :name="n"
          v-bind="d ?? {}"
      /></template>
    </AButton>
  </Popconfirm>
  <AButton
    v-else
    v-bind="$attrs"
    v-bind="antProps"
    @click="onClick">
    <template
      v-for="(_, n) in $slots"
      #[n]="d"
      ><slot
        :name="n"
        v-bind="d ?? {}"
    /></template>
  </AButton>
</template>
```

**第 4 步——导出**（`index.ts` `export * from './src/props'`）。

### 7.3 两条铁律

1. **扩展属性不可泄漏给内部组件**：必须在 `defineProps` 声明（声明后不进 `$attrs`），并在绑定前解构剥离。否则底层组件会收到不认识的属性，污染 DOM 或触发警告。
2. **透传守恒**：未被扩展消费的原生能力必须仍 100% 透传；扩展只在透传链路上插入一层，不替换。

### 7.4 克制原则

只下沉**高频通用**能力（防抖、确认、权限、自动 loading）。业务个性化需求不进组件库，留业务层用 `<TmButton>` 组合实现，避免组件库膨胀。

### 7.5 目录随扩展演进

加扩展后，`button/` 长出 `props.ts` 与 `composables/`。此模式对 `TmSelect`（`remote`）、`TmTable`（`request`）、`TmForm`（`schema`）通用。

---

## 8. 样式与主题对齐（vxe ↔ ant）

核心思路：**以 ant design token 为单一真相源，驱动 vxe 的 CSS 变量**，实现两者视觉联动。

- **ant 样式**：cssinjs 运行时注入，无需单独 CSS 文件。
- **vxe 样式**：预编译 CSS + CSS 变量（`--vxe-ui-*`），消费方需 `import 'vxe-table/es/style.css'`。
- **`TmConfigProvider`**（薄包 ant `ConfigProvider`，预留主题扩展点 + 桥接 vxe 变量）：

```vue
<!-- packages/ui/src/config-provider/ConfigProvider.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import {
  ConfigProvider as AConfigProvider,
  theme
} from 'ant-design-vue'
const { useToken } = theme
const [token] = useToken() // ant 当前 token（响应式）

const props = defineProps<{ theme?: 'light' | 'dark' }>()

// ant token → vxe CSS 变量，两套库视觉同源、主题切换联动
const vxeVars = computed(() => ({
  '--vxe-ui-primary-color': token.value.colorPrimary,
  '--vxe-ui-font-family': token.value.fontFamily,
  '--vxe-ui-border-radius': `${token.value.borderRadius}px`
}))
</script>
<template>
  <AConfigProvider
    :theme="{
      algorithm:
        props.theme === 'dark'
          ? theme.darkAlgorithm
          : theme.defaultAlgorithm
    }">
    <div :style="vxeVars"><slot /></div>
  </AConfigProvider>
</template>
```

v1 不注入自定义 token，但桥接通道已就位——日后接公司品牌色/暗色，只改 `TmConfigProvider` 一处，ant 与 vxe 同步生效。

---

## 9. 构建与产物

| 项             | 方案                                                                                       |
| -------------- | ------------------------------------------------------------------------------------------ |
| 构建工具       | Vite library mode + `vite-plugin-dts`（生成 `.d.ts`，保住类型透传）                        |
| 产物           | `es/`（ESM，保留模块结构，支持 tree-shaking 与按需）+ `lib/`（CJS）+ 全量/分组件 `.d.ts`   |
| externals      | `vue`、`ant-design-vue`、`@ant-design/icons-vue`、`vxe-table`、`vxe-pc-ui`、`@vxe-ui/core` |
| `package.json` | `peerDependencies` 声明上述 6 项；`exports` 配置多入口（根 + `@tm/ui/table` 子路径）       |
| 按需加载       | 保留 ES 结构 + 提供 `unplugin-vue-components` 的 Resolver（业务方零配置自动按需）          |

---

## 10. 文档站

- `apps/docs` 用 **VitePress**，承载所有应用依赖（pinia/router/axios/echarts/Tailwind），核心库零污染。
- 每个组件 `demos/` 下的用例嵌入 VitePress markdown，交互式演示。
- Props/Events/Methods 表格从 TypeScript 类型自动生成。
- 产物为静态站点，便于内部部署。

---

## 11. 测试策略

`vitest` + `@vue/test-utils` + `jsdom`（均已就绪），每个组件 `__tests__/` 覆盖：

- **透传**：传入 ant props/attrs/events/slots → 断言内部组件收到；
- **默认值**：断言公司默认值生效、业务值可覆盖；
- **方法暴露**：`ref` 调用 → 断言转发到内部实例；
- **扩展功能**：`debounce`/`confirm` 等行为；
- **v-model**：受控双向；
- `TmTable` 的 `request` 扩展用 **msw** mock 接口。
- 覆盖率目标 **80%+**。

---

## 12. 范本组件清单与分工（v1）

| 组件       | 包  | 验证点                                                   | 扩展示范                    |
| ---------- | --- | -------------------------------------------------------- | --------------------------- |
| `TmButton` | ui  | 纯透传（Props/Attrs/Events/Slots）                       | `debounce` + `confirm`      |
| `TmInput`  | ui  | v-model + ref 方法（`focus`/`blur`）                     | —                           |
| `TmSelect` | ui  | 复杂选项 / 异步                                          | `remote` 远程搜索           |
| `TmForm`   | ui  | provide/inject 联动 + `validate` 方法（含 `TmFormItem`） | —                           |
| `TmTable`  | ui  | vxe-grid 封装；列配置 / 分页 / 方法 / 视觉对齐           | `request` 传 URL 自动拉数据 |

5 个范本覆盖薄封装全部难点，且 `TmTable` 验证基座跨生态（ant → vxe）通用。

---

## 13. 分阶段路线

| 阶段           | 内容                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------- |
| **v1（本次）** | monorepo 骨架 + 封装基座 + 5 范本 + 构建产物 + Resolver + VitePress 文档站 + 测试 + 发包配置 |
| **v2**         | 脚本化批量扩充 ant 全量组件；`Message`/`Modal` 命令式 API；公司品牌色 + 暗色主题落地         |
| **v3**         | i18n；`TmTable` `request` / `TmForm` `schema` 业务扩展；按需 Resolver 完善                   |

---

## 14. 风险与待定项

| 风险 / 待定                  | 说明                                             | 应对                                                                                |
| ---------------------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------- |
| vxe 与 ant 视觉非完全一致    | 两套设计语言，圆角/阴影/间距细节有差异           | 用 CSS 变量尽量对齐；无法对齐处在文档明确约定                                       |
| vxe 作为主包 peerDep         | 业务方无论是否用表格都需安装 vxe                 | peerDep 装了不进 bundle（tree-shaking）；如后续成为痛点，再评估拆 `@tm/tables` 子包 |
| 发版渠道待定                 | 内部 npm registry / 私有源未指定                 | v1 先产出可构建产物，发版渠道在 v1 收尾时确认                                       |
| 命令式 API（Message/Modal）  | 与组件实例封装模式不同（函数式调用）             | 留 v2，单独设计                                                                     |
| `autoLoading` 扩展的异步约定 | 需业务 onClick 返回 Promise 才能自动结束 loading | v2 落地时明确约定与类型                                                             |
| 项目非 git 仓库              | 当前无法 commit 版本                             | 建议 `git init` 纳入版本管理（本次 spec 文档已写入磁盘）                            |

---

## 15. 后续步骤

1. **用户审阅本 spec**（当前阶段）。
2. 审阅通过 → 调用 `writing-plans` skill 产出详细实现计划（分阶段、可执行的任务清单）。
3. 按计划落地 v1。

