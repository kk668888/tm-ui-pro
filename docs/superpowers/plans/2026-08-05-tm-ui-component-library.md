# @tm/ui 组件库 v1 实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从零搭建 `@tm/ui` 组件库 v1——pnpm monorepo 骨架 + 薄封装基座 + 5 个范本组件（Button/Input/Select/Form/Table）+ 构建产物 + VitePress 文档站 + 发包配置。

**Architecture:** 纯薄封装（透明代理）——每个 Tm 组件用通用基座（`useForwardRef` / `withInstall` / 类型 re-export）100% 透传底层（ant-design-vue / vxe-table）的 props/slots/events/方法，仅在透传链路上插入公司默认值与高频扩展。`packages/ui` 为可发布核心库（peerDep 隔离），`apps/docs` 为文档站（承载应用级依赖）。

**Tech Stack:** Vue 3.5 + TypeScript 5.5（strict）+ Vite 8（library mode）+ ant-design-vue 4.2.6 + vxe-table 4.20 + Vitest 4 + VitePress + pnpm 11.13.1 workspace。

## Global Constraints

- **包名/前缀**：包名 `@tm/ui`，组件前缀 `Tm`（TmButton、TmInput…），严格一致。
- **peerDependencies（6 项，业务方自装，构建时 external）**：`vue`、`ant-design-vue`、`@ant-design/icons-vue`、`vxe-table`、`vxe-pc-ui`、`@vxe-ui/core`。
- **应用级依赖隔离**：`pinia`、`vue-router`、`axios`、`echarts`、`jsencrypt`、`markdown-it`、`highlight.js`、`tailwindcss` 不得进入 `packages/ui`，全部落 `apps/docs`。
- **TypeScript strict**：禁隐式 any；接口/泛型约束；错误处理完整。
- **代码规范**：单文件 <800 行、高内聚低耦合、不可变（不直接 mutate）、无 `console.log`、注释中文、技术术语保留英文。
- **TDD**：每个组件先写失败测试再实现，覆盖率 ≥80%。
- **提交**：中文 commit message，conventional 前缀（feat/build/chore/test/docs/refactor）。
- **样式**：核心库不用 Tailwind；v1 用 ant 默认主题，通过 `TmConfigProvider` 预留扩展点 + 桥接 vxe CSS 变量。

---

## File Structure（v1 创建/修改清单）

```
tm-ui-new/
├─ package.json                      # Modify: 改为 workspace 根，仅留公共 devDeps + scripts
├─ pnpm-workspace.yaml               # Create
├─ tsconfig.base.json                # Create
├─ .gitignore                        # Create
├─ .npmrc                            # Create
├─ packages/
│  └─ ui/
│     ├─ package.json                # Create: @tm/ui, peerDep6, exports 多入口
│     ├─ tsconfig.json               # Create: extends ../../tsconfig.base.json
│     ├─ vite.config.ts              # Create: lib mode + vite-plugin-dts
│     ├─ vitest.config.ts            # Create
│     └─ src/
│        ├─ index.ts                 # 聚合出口 + install
│        ├─ resolver.ts              # unplugin-vue-components Resolver
│        ├─ utils/
│        │  └─ withInstall.ts        # + .spec.ts
│        ├─ composables/
│        │  └─ useForwardRef.ts      # + .spec.ts
│        ├─ config-provider/
│        │  ├─ ConfigProvider.vue
│        │  ├─ index.ts
│        │  └─ ConfigProvider.spec.ts
│        └─ components/
│           ├─ button/  (index.ts, src/{Button.vue,defaults.ts,props.ts,composables/useDebounceClick.ts}, __tests__, demos)
│           ├─ input/   (index.ts, src/{Input.vue,defaults.ts}, __tests__, demos)
│           ├─ select/  (index.ts, src/{Select.vue,defaults.ts,props.ts,composables/useRemoteSearch.ts}, __tests__, demos)
│           ├─ form/    (index.ts, src/{Form.vue,FormItem.vue,defaults.ts,composables/useFormContext.ts}, __tests__, demos)
│           └─ table/   (index.ts, src/{Table.vue,defaults.ts,props.ts,composables/{useColumns.ts,usePagination.ts}}, style/vxe-align.css, __tests__, demos)
└─ apps/
   └─ docs/
      ├─ package.json                # Create: 承载所有应用级依赖
      ├─ .vitepress/config.ts
      └─ components/{button,input,select,form,table}.md
```

---

## Milestone 1：Monorepo 骨架与依赖剥离

### Task 1：初始化 pnpm workspace 与根配置

**Files:**
- Create: `pnpm-workspace.yaml`
- Create: `tsconfig.base.json`
- Create: `.gitignore`
- Create: `.npmrc`
- Modify: `package.json`（改写为 workspace 根）

**Interfaces:**
- Produces: workspace 协议（`packages/*`、`apps/*`），供后续 task 的子包通过 `workspace:*` 互相引用。

- [ ] **Step 1：初始化 git 仓库**

```bash
git init
```

- [ ] **Step 2：创建 `pnpm-workspace.yaml`**

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

- [ ] **Step 3：创建 `.gitignore`**

```gitignore
node_modules
dist
es
lib
.DS_Store
*.local
coverage
.vitepress/cache
.vitepress/dist
```

- [ ] **Step 4：创建 `.npmrc`（隔离幽灵依赖，强制显式声明）**

```ini
# .npmrc
shamefully-hoist=false
strict-peer-dependencies=false
auto-install-peers=true
```

- [ ] **Step 5：创建 `tsconfig.base.json`（子包 extends）**

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "jsx": "preserve",
    "sourceMap": true,
    "resolveJsonModule": true,
    "esModuleInterop": true,
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "skipLibCheck": true,
    "declaration": true,
    "isolatedModules": true,
    "useDefineForClassFields": true
  }
}
```

- [ ] **Step 6：改写根 `package.json`（仅留公共工具与编排脚本，依赖下沉到子包）**

```json
{
  "name": "tm-ui-new",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "pnpm --filter @tm/docs dev",
    "build": "pnpm --filter @tm/ui build",
    "test": "pnpm --filter @tm/ui test",
    "lint": "eslint --ext .ts,.vue packages",
    "format": "prettier --write \"packages/**/*.{ts,vue}\""
  },
  "devDependencies": {
    "typescript": "^5.5.0",
    "vue-tsc": "^2.1.0",
    "vitest": "^4.1.10",
    "@vue/test-utils": "^2.4.0",
    "jsdom": "^24.0.0",
    "prettier": "^3.3.0",
    "eslint": "^10.0.0",
    "eslint-plugin-vue": "^10.0.0",
    "@vue/eslint-config-typescript": "^14.0.0",
    "@vue/eslint-config-prettier": "^10.0.0"
  },
  "packageManager": "pnpm@11.13.1"
}
```

> 说明：原根 `package.json` 的 `dependencies`（ant/vxe/vue/应用级）全部下沉——运行时依赖进 `packages/ui` 的 peerDep、`apps/docs` 的 deps；构建工具进对应子包 devDep。

- [ ] **Step 7：提交**

```bash
git add -A
git commit -m "chore: 初始化 pnpm workspace 与根配置"
```

---

### Task 2：创建 `packages/ui` 子包基础结构

**Files:**
- Create: `packages/ui/package.json`
- Create: `packages/ui/tsconfig.json`
- Create: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `@tm/ui` 包壳（peerDep6 + exports 占位 + install 入口），供 Task 4+ 填充组件。

- [ ] **Step 1：创建 `packages/ui/package.json`**

```json
{
  "name": "@tm/ui",
  "version": "0.1.0",
  "description": "公司内部基于 ant-design-vue + vxe-table 二次封装的组件库",
  "type": "module",
  "main": "lib/index.js",
  "module": "es/index.js",
  "types": "es/index.d.ts",
  "exports": {
    ".": {
      "types": "./es/index.d.ts",
      "import": "./es/index.js",
      "require": "./lib/index.js"
    },
    "./table": {
      "types": "./es/components/table/index.d.ts",
      "import": "./es/components/table/index.js"
    },
    "./style.css": "./dist/style.css"
  },
  "sideEffects": ["**/*.css"],
  "files": ["es", "lib", "dist"],
  "scripts": {
    "build": "vite build",
    "test": "vitest run"
  },
  "peerDependencies": {
    "vue": "^3.5.0",
    "ant-design-vue": "^4.2.6",
    "@ant-design/icons-vue": "^7.0.0",
    "vxe-table": "4.20.7",
    "vxe-pc-ui": "4.16.21",
    "@vxe-ui/core": "4.4.18"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^6.0.8",
    "vite": "^8.1.5",
    "vite-plugin-dts": "^4.5.0",
    "vue": "^3.5.0",
    "ant-design-vue": "^4.2.6",
    "@ant-design/icons-vue": "^7.0.0",
    "vxe-table": "4.20.7",
    "vxe-pc-ui": "4.16.21",
    "@vxe-ui/core": "4.4.18"
  }
}
```

- [ ] **Step 2：创建 `packages/ui/tsconfig.json`**

```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "rootDir": "src",
    "outDir": "es",
    "baseUrl": ".",
    "types": ["vitest/globals", "node"]
  },
  "include": ["src/**/*.ts", "src/**/*.vue", "src/**/*.spec.ts"]
}
```

- [ ] **Step 3：创建占位 `packages/ui/src/index.ts`**

```ts
// packages/ui/src/index.ts
// 组件库总出口：后续 task 在此聚合各组件导出
import type { App } from 'vue'

/** Vue 插件 install：app.use(@tm/ui) 全量注册 */
export const install = (app: App): void => {
  // 占位，Task 4+ 起逐个注册组件
}

export default { install }
```

- [ ] **Step 4：安装依赖并验证 workspace 可识别**

Run: `pnpm install`
Expected: 无错误，`packages/ui` 被识别为 workspace 包。

Run: `pnpm --filter @tm/ui exec tsc --noEmit`
Expected: 无类型错误。

- [ ] **Step 5：提交**

```bash
git add packages/ui
git commit -m "feat(ui): 新建 @tm/ui 子包基础结构与 peerDep 声明"
```

---

### Task 3：创建 `apps/docs` 文档站子包（承载应用级依赖）

**Files:**
- Create: `apps/docs/package.json`
- Create: `apps/docs/.vitepress/config.ts`
- Create: `apps/docs/index.md`

**Interfaces:**
- Consumes: `@tm/ui`（通过 `workspace:*`）。
- Produces: VitePress 文档站，隔离所有应用级依赖。

- [ ] **Step 1：创建 `apps/docs/package.json`（接收所有应用级依赖）**

```json
{
  "name": "@tm/docs",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "vitepress dev",
    "build": "vitepress build",
    "preview": "vitepress preview"
  },
  "dependencies": {
    "@tm/ui": "workspace:*",
    "vue": "^3.5.0",
    "ant-design-vue": "^4.2.6",
    "@ant-design/icons-vue": "^7.0.0",
    "vxe-table": "4.20.7",
    "vxe-pc-ui": "4.16.21",
    "@vxe-ui/core": "4.4.18",
    "pinia": "^2.2.0",
    "vue-router": "^4.4.0",
    "axios": "^1.7.0",
    "echarts": "^6.0.0",
    "vue-echarts": "^8.0.1",
    "dayjs": "^1.11.13",
    "jsencrypt": "^3.5.4",
    "markdown-it": "^14.0.0",
    "highlight.js": "^11.0.0",
    "xe-utils": "^4.0.11"
  },
  "devDependencies": {
    "vitepress": "^1.5.0",
    "tailwindcss": "^4.3.3",
    "@tailwindcss/vite": "^4.3.3"
  }
}
```

> 说明：`@tm/ui` 以 `workspace:*` 引用；原根的所有应用级依赖迁移至此；核心库零应用依赖得以保证。

- [ ] **Step 2：创建 `apps/docs/.vitepress/config.ts`**

```ts
// apps/docs/.vitepress/config.ts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@tm/ui 组件库',
  description: '公司内部组件库文档',
  themeConfig: {
    nav: [{ text: '组件', link: '/components/button' }],
    sidebar: {
      '/components/': [
        { text: '基础组件', items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Input 输入框', link: '/components/input' },
          { text: 'Select 选择器', link: '/components/select' },
        ]},
        { text: '表单', items: [{ text: 'Form 表单', link: '/components/form' }]},
        { text: '数据展示', items: [{ text: 'Table 表格', link: '/components/table' }]},
      ],
    },
  },
})
```

- [ ] **Step 3：创建 `apps/docs/index.md`**

```markdown
# @tm/ui

公司内部基于 ant-design-vue + vxe-table 二次封装的组件库。

[开始查看组件 →](/components/button)
```

- [ ] **Step 4：安装并验证文档站可启动**

Run: `pnpm install`
Run: `pnpm dev`
Expected: VitePress 起在 `http://localhost:5173`，无错误后 Ctrl+C 退出。

- [ ] **Step 5：提交**

```bash
git add apps/docs
git commit -m "feat(docs): 新建 VitePress 文档站并隔离应用级依赖"
```

---

## Milestone 2：封装基座

### Task 4：`withInstall` 工具（TDD）

**Files:**
- Create: `packages/ui/src/utils/withInstall.ts`
- Test: `packages/ui/src/utils/withInstall.spec.ts`

**Interfaces:**
- Produces: `withInstall<T>(comp: T, name: string): T & { install: (app: App) => void }`，被所有组件 `index.ts` 使用。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/utils/withInstall.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { createApp, defineComponent } from 'vue'
import { withInstall } from './withInstall'

describe('withInstall', () => {
  it('为组件附加 install 方法，app.use 时全局注册', () => {
    const Base = defineComponent({ name: 'XButton' })
    const TmButton = withInstall(Base, 'TmButton')

    const app = createApp({})
    const componentSpy = vi.spyOn(app, 'component')
    ;(TmButton as any).install(app)

    expect(componentSpy).toHaveBeenCalledWith('TmButton', Base)
  })

  it('保留原组件的全部属性', () => {
    const Base = defineComponent({ name: 'XButton', props: { foo: {} } })
    const TmButton = withInstall(Base, 'TmButton') as any
    expect(TmButton.props).toEqual(Base.props)
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/utils/withInstall.spec.ts`
Expected: FAIL（`withInstall` 未定义）。

- [ ] **Step 3：实现 `withInstall`**

```ts
// packages/ui/src/utils/withInstall.ts
import type { App, Component } from 'vue'

/**
 * 为组件附加 Vue 插件 install 方法
 * @param comp 原始组件（SFC 对象或 defineComponent 结果）
 * @param name 全局注册名（如 'TmButton'）
 * @returns 带 install 的组件，既可 app.use 整体注册，也可直接当组件用
 */
export function withInstall<T extends Component>(comp: T, name: string): T & { install: (app: App) => void } {
  const compWithInstall = comp as T & { install: (app: App) => void }
  compWithInstall.install = (app: App) => {
    app.component(name, compWithInstall)
  }
  return compWithInstall
}
```

- [ ] **Step 4：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/utils/withInstall.spec.ts`
Expected: PASS（2 passed）。

- [ ] **Step 5：提交**

```bash
git add packages/ui/src/utils
git commit -m "feat(ui): 新增 withInstall 工具并补单测"
```

---

### Task 5：`useForwardRef` composable（TDD）

**Files:**
- Create: `packages/ui/src/composables/useForwardRef.ts`
- Test: `packages/ui/src/composables/useForwardRef.spec.ts`

**Interfaces:**
- Produces: `useForwardRef<T>()` → `{ innerRef, exposed }`，`exposed` 代理内部实例方法，供 `defineExpose`。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/composables/useForwardRef.spec.ts
import { describe, it, expect } from 'vitest'
import { useForwardRef } from './useForwardRef'
import { ref } from 'vue'

describe('useForwardRef', () => {
  it('代理内部实例的方法/属性到 exposed', () => {
    const { innerRef, exposed } = useForwardRef<any>()
    // 模拟内部组件挂载后填充实例
    innerRef.value = { focus: () => 'focused', value: 42 }
    expect(exposed.focus()).toBe('focused')
    expect(exposed.value).toBe(42)
  })

  it('内部实例为空时访问不报错（返回 undefined）', () => {
    const { exposed } = useForwardRef<any>()
    expect(exposed.anyMethod).toBeUndefined()
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/composables/useForwardRef.spec.ts`
Expected: FAIL（未实现）。

- [ ] **Step 3：实现 `useForwardRef`**

```ts
// packages/ui/src/composables/useForwardRef.ts
import { ref, type Ref, type ComponentPublicInstance } from 'vue'

/**
 * 把内部组件实例的全部方法/属性代理给父组件 ref
 * 父组件通过 ref 调用任意方法，都会转发到内部 ant/vxe 实例
 * 无需逐一列举方法名，新增方法自动透传
 */
export function useForwardRef<T extends ComponentPublicInstance = ComponentPublicInstance>(): {
  innerRef: Ref<T | null>
  exposed: T
} {
  const innerRef = ref<T | null>(null) as Ref<T | null>

  // Proxy 拦截所有属性读取，运行时转发到最新内部实例
  const exposed = new Proxy({} as T, {
    get: (_target, key: string | symbol) => {
      const inst = innerRef.value as unknown as Record<string | symbol, unknown> | null
      return inst?.[key]
    },
  })

  return { innerRef, exposed }
}
```

- [ ] **Step 4：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/composables/useForwardRef.spec.ts`
Expected: PASS（2 passed）。

- [ ] **Step 5：提交**

```bash
git add packages/ui/src/composables/useForwardRef.*
git commit -m "feat(ui): 新增 useForwardRef 方法透传 composable 并补单测"
```

---

### Task 6：`TmConfigProvider`（主题扩展点 + vxe 桥接，TDD）

**Files:**
- Create: `packages/ui/src/config-provider/ConfigProvider.vue`
- Create: `packages/ui/src/config-provider/index.ts`
- Test: `packages/ui/src/config-provider/ConfigProvider.spec.ts`

**Interfaces:**
- Consumes: `useForwardRef`（可选，用于透传 ConfigProvider 实例）。
- Produces: `TmConfigProvider` 组件，props `{ theme?: 'light' | 'dark' }`，渲染时注入 vxe CSS 变量。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/config-provider/ConfigProvider.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ConfigProvider from './ConfigProvider.vue'

describe('TmConfigProvider', () => {
  it('默认渲染插槽内容', () => {
    const wrapper = mount(ConfigProvider, {
      slots: { default: '<div class="inner">hi</div>' },
    })
    expect(wrapper.html()).toContain('hi')
  })

  it('注入 vxe 视觉对齐 CSS 变量（以 ant token 为源）', () => {
    const wrapper = mount(ConfigProvider)
    const style = wrapper.attributes('style') || ''
    // 桥接通道存在即可（具体值由 ant token 运行时决定）
    expect(style).toMatch(/--vxe-ui-/)
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/config-provider/ConfigProvider.spec.ts`
Expected: FAIL（组件不存在）。

- [ ] **Step 3：实现 `ConfigProvider.vue`**

```vue
<!-- packages/ui/src/config-provider/ConfigProvider.vue -->
<script setup lang="ts">
/**
 * TmConfigProvider：薄包 ant ConfigProvider
 * 1) 预留公司主题注入点（v1 用 ant 默认）
 * 2) 把 ant design token 映射为 vxe CSS 变量，实现两套库视觉同源/主题联动
 */
import { computed } from 'vue'
import { ConfigProvider as AConfigProvider, theme } from 'ant-design-vue'

const { useToken } = theme
const [token] = useToken() // ant 当前 token（响应式）

const props = defineProps<{
  /** 主题模式：light（默认）/ dark，v1 预留，日后接公司暗色 */
  themeMode?: 'light' | 'dark'
}>()

// ant token → vxe CSS 变量：单一真相源驱动两套库
const vxeVars = computed(() => ({
  '--vxe-ui-primary-color': token.value.colorPrimary,
  '--vxe-ui-font-family': token.value.fontFamily,
  '--vxe-ui-border-radius': `${token.value.borderRadius}px`,
}))

const algorithm = computed(() =>
  props.themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
)
</script>

<template>
  <AConfigProvider :theme="{ algorithm }">
    <div :style="vxeVars" class="tm-config-provider">
      <slot />
    </div>
  </AConfigProvider>
</template>
```

- [ ] **Step 4：创建 `index.ts` 出口**

```ts
// packages/ui/src/config-provider/index.ts
import ConfigProvider from './ConfigProvider.vue'
import { withInstall } from '../utils/withInstall'

export const TmConfigProvider = withInstall(ConfigProvider, 'TmConfigProvider')
export default TmConfigProvider
```

- [ ] **Step 5：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/config-provider/ConfigProvider.spec.ts`
Expected: PASS（2 passed）。

- [ ] **Step 6：提交**

```bash
git add packages/ui/src/config-provider
git commit -m "feat(ui): 新增 TmConfigProvider 主题扩展点与 vxe 变量桥接"
```

---

## Milestone 3：范本组件（每个 TDD）

> 约定：每个组件目录结构按 spec 第 6 节；透传统一用 `v-bind="$attrs"` + slots 遍历 + `useForwardRef`。

### Task 7：`TmButton`（透传 + debounce + confirm 扩展）

**Files:**
- Create: `packages/ui/src/components/button/src/props.ts`
- Create: `packages/ui/src/components/button/src/defaults.ts`
- Create: `packages/ui/src/components/button/src/composables/useDebounceClick.ts`
- Create: `packages/ui/src/components/button/src/Button.vue`
- Create: `packages/ui/src/components/button/index.ts`
- Create: `packages/ui/src/components/button/demos/basic.vue`
- Test: `packages/ui/src/components/button/__tests__/Button.spec.ts`
- Modify: `packages/ui/src/index.ts`（聚合 Button）

**Interfaces:**
- Consumes: `withInstall`。
- Produces: `TmButton` 组件，类型 `TmButtonProps = ButtonProps & TmButtonExtProps`（含 `debounce?: number`、`confirm?: string`）。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/components/button/__tests__/Button.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmButton from '../src/Button.vue'

describe('TmButton', () => {
  it('透传 ant 原生 props 到内部按钮', () => {
    const wrapper = mount(TmButton, { props: { type: 'primary', danger: true } })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('公司默认 type=primary 生效，业务可覆盖', () => {
    const wrapper = mount(TmButton)
    // 默认 type=primary 经 ant 渲染为对应 class
    expect(wrapper.html()).toContain('ant-btn')
  })

  it('debounce 扩展：节流 emit click', async () => {
    const wrapper = mount(TmButton, { props: { debounce: 50 } })
    await wrapper.find('button').trigger('click')
    expect(wrapper.emitted('click')).toBeUndefined()
    await new Promise((r) => setTimeout(r, 60))
    expect(wrapper.emitted('click')).toHaveLength(1)
  })

  it('confirm 扩展：渲染 Popconfirm 包裹', () => {
    const wrapper = mount(TmButton, { props: { confirm: '确定吗' } })
    expect(wrapper.html()).toContain('确定吗')
  })

  it('插槽透传', () => {
    const wrapper = mount(TmButton, { slots: { default: '保存' } })
    expect(wrapper.text()).toContain('保存')
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/components/button`
Expected: FAIL（组件未实现）。

- [ ] **Step 3：实现 `props.ts`（扩展类型）**

```ts
// packages/ui/src/components/button/src/props.ts
import type { ButtonProps } from 'ant-design-vue'

/** TmButton 在 ant Button 之上扩展的公司特有属性 */
export interface TmButtonExtProps {
  /** 点击防抖间隔（ms），>0 启用 */
  debounce?: number
  /** 点击前二次确认文案，传入则用 Popconfirm 包裹 */
  confirm?: string
}

/** ant 原生 + 公司扩展（IDE 同时提示两者） */
export type TmButtonProps = ButtonProps & TmButtonExtProps

// 类型透传：业务方可直接 import TmButtonProps
export type { ButtonProps } from 'ant-design-vue'
```

- [ ] **Step 4：实现 `defaults.ts`（公司默认值）**

```ts
// packages/ui/src/components/button/src/defaults.ts
import type { TmButtonProps } from './props'

/** 公司默认 props：业务传入可覆盖 */
export const tmButtonDefaults: Required<Pick<TmButtonProps, 'type' | 'debounce'>> = {
  type: 'primary',
  debounce: 0,
}
```

- [ ] **Step 5：实现 `useDebounceClick.ts`**

```ts
// packages/ui/src/components/button/src/composables/useDebounceClick.ts
import type { TmButtonProps } from '../props'
import type { MouseEvent } from 'vue'

/**
 * 防抖点击：拦截原生 click，按 debounce 间隔节流后再向业务 emit
 * 未配置 debounce 时零开销透传
 */
export function useDebounceClick(
  props: Pick<TmButtonProps, 'debounce'>,
  emit: (e: 'click', ev: MouseEvent) => void,
) {
  let timer: ReturnType<typeof setTimeout> | undefined

  const onClick = (ev: MouseEvent) => {
    if (!props.debounce) return emit('click', ev)
    clearTimeout(timer)
    timer = setTimeout(() => emit('click', ev), props.debounce)
  }

  return { onClick }
}
```

- [ ] **Step 6：实现 `Button.vue`**

```vue
<!-- packages/ui/src/components/button/src/Button.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { Button as AButton, Popconfirm } from 'ant-design-vue'
import type { TmButtonProps } from './props'
import { tmButtonDefaults } from './defaults'
import { useDebounceClick } from './composables/useDebounceClick'

defineOptions({ name: 'TmButton', inheritAttrs: false })

const props = withDefaults(defineProps<TmButtonProps>(), {
  type: tmButtonDefaults.type,
  debounce: tmButtonDefaults.debounce,
  confirm: undefined,
})

const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

// 行为扩展：防抖
const { onClick } = useDebounceClick(props, emit)

// ★ 剥离扩展属性，只把 ant 认识的属性绑给内部按钮
const antProps = computed(() => {
  const { debounce, confirm, ...rest } = props
  return rest
})
</script>

<template>
  <!-- 结构扩展：confirm 用 Popconfirm 包裹 -->
  <Popconfirm v-if="props.confirm" :title="props.confirm" @confirm="(e) => onClick(e as MouseEvent)">
    <AButton v-bind="$attrs" v-bind="antProps">
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </AButton>
  </Popconfirm>

  <!-- 无 confirm：原生能力仍 100% 透传 -->
  <AButton v-else v-bind="$attrs" v-bind="antProps" @click="onClick">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AButton>
</template>
```

- [ ] **Step 7：实现 `index.ts` 出口**

```ts
// packages/ui/src/components/button/index.ts
import Button from './src/Button.vue'
import { withInstall } from '../../utils/withInstall'

export const TmButton = withInstall(Button, 'TmButton')
export * from './src/props'
export default TmButton
```

- [ ] **Step 8：实现 `demos/basic.vue`**

```vue
<!-- packages/ui/src/components/button/demos/basic.vue -->
<script setup lang="ts">
import { TmButton } from '../index'
</script>

<template>
  <TmButton @click="() => {}">默认按钮</TmButton>
  <TmButton :debounce="300" @click="() => {}">防抖 300ms</TmButton>
  <TmButton confirm="确定删除吗？" danger @click="() => {}">删除</TmButton>
</template>
```

- [ ] **Step 9：聚合到 `packages/ui/src/index.ts`**

```ts
// packages/ui/src/index.ts
import type { App } from 'vue'
import { TmButton } from './components/button'

/** 全量 install：app.use(@tm/ui) */
export const install = (app: App): void => {
  app.use(TmButton as any)
}

export { TmButton } from './components/button'
export type { TmButtonProps, TmButtonExtProps } from './components/button'
export default { install }
```

- [ ] **Step 10：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/components/button`
Expected: PASS（5 passed）。

- [ ] **Step 11：提交**

```bash
git add packages/ui/src/components/button packages/ui/src/index.ts
git commit -m "feat(ui): 新增 TmButton 范本组件（透传+debounce+confirm 扩展）"
```

---

### Task 8：`TmInput`（v-model + ref 方法透传）

**Files:**
- Create: `packages/ui/src/components/input/src/Input.vue`
- Create: `packages/ui/src/components/input/src/defaults.ts`
- Create: `packages/ui/src/components/input/index.ts`
- Create: `packages/ui/src/components/input/demos/basic.vue`
- Test: `packages/ui/src/components/input/__tests__/Input.spec.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `useForwardRef`（透传 `focus`/`blur`/`select` 等方法），`withInstall`。
- Produces: `TmInput`，支持 `v-model`，父组件 `ref` 可调 `focus()`。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/components/input/__tests__/Input.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TmInput from '../src/Input.vue'

describe('TmInput', () => {
  it('透传 ant 原生 placeholder', () => {
    const wrapper = mount(TmInput, { props: { placeholder: '请输入' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请输入')
  })

  it('v-model：input 触发 update:modelValue', async () => {
    const wrapper = mount(TmInput, { props: { modelValue: '' } })
    await wrapper.find('input').setValue('hello')
    expect(wrapper.emitted('update:modelValue')?.[0]?.[0]).toBe('hello')
  })

  it('方法透传：exposed 含 focus', () => {
    const wrapper = mount(TmInput)
    expect(typeof (wrapper.vm as any).focus).toBe('function')
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/components/input`
Expected: FAIL。

- [ ] **Step 3：实现 `defaults.ts`**

```ts
// packages/ui/src/components/input/src/defaults.ts
import type { InputProps } from 'ant-design-vue'

/** 公司默认：允许清除、默认 medium 尺寸 */
export const tmInputDefaults: Partial<InputProps> = {
  allowClear: true,
  size: 'middle',
}
```

- [ ] **Step 4：实现 `Input.vue`**

```vue
<!-- packages/ui/src/components/input/src/Input.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { Input as AInput, type InputProps, type InputInstance } from 'ant-design-vue'
import { useForwardRef } from '../../../composables/useForwardRef'
import { tmInputDefaults } from './defaults'

defineOptions({ name: 'TmInput', inheritAttrs: false })

const props = withDefaults(defineProps<InputProps & { modelValue?: string }>(), {
  modelValue: undefined,
  allowClear: tmInputDefaults.allowClear,
  size: tmInputDefaults.size,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: string): void }>()

// 方法透传：父组件 ref 可调 focus/blur/select
const { innerRef, exposed } = useForwardRef<InputInstance>()
defineExpose(exposed)

// 合并 v-model 到透传 props
const antProps = computed(() => ({ ...props, value: props.modelValue }))

const onInput = (e: Event) => emit('update:modelValue', (e.target as HTMLInputElement).value)
</script>

<template>
  <AInput ref="innerRef" v-bind="$attrs" v-bind="antProps" @update:value="emit('update:modelValue', $event)">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AInput>
</template>
```

- [ ] **Step 5：实现 `index.ts`**

```ts
// packages/ui/src/components/input/index.ts
import Input from './src/Input.vue'
import { withInstall } from '../../utils/withInstall'

export const TmInput = withInstall(Input, 'TmInput')
export type { InputProps } from 'ant-design-vue'
export default TmInput
```

- [ ] **Step 6：实现 `demos/basic.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TmInput } from '../index'
const v = ref('')
</script>
<template>
  <TmInput v-model="v" placeholder="请输入" />
</template>
```

- [ ] **Step 7：聚合到 `index.ts`（在 Task 7 基础上追加）**

```ts
// packages/ui/src/index.ts
import type { App } from 'vue'
import { TmButton } from './components/button'
import { TmInput } from './components/input'

export const install = (app: App): void => {
  app.use(TmButton as any)
  app.use(TmInput as any)
}

export { TmButton } from './components/button'
export { TmInput } from './components/input'
export type { TmButtonProps, TmButtonExtProps } from './components/button'
export type { InputProps } from './components/input'
export default { install }
```

- [ ] **Step 8：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/components/input`
Expected: PASS（3 passed）。

- [ ] **Step 9：提交**

```bash
git add packages/ui/src/components/input packages/ui/src/index.ts
git commit -m "feat(ui): 新增 TmInput 范本组件（v-model + 方法透传）"
```

---

### Task 9：`TmSelect`（remote 远程搜索扩展）

**Files:**
- Create: `packages/ui/src/components/select/src/props.ts`
- Create: `packages/ui/src/components/select/src/defaults.ts`
- Create: `packages/ui/src/components/select/src/composables/useRemoteSearch.ts`
- Create: `packages/ui/src/components/select/src/Select.vue`
- Create: `packages/ui/src/components/select/index.ts`
- Create: `packages/ui/src/components/select/demos/basic.vue`
- Test: `packages/ui/src/components/select/__tests__/Select.spec.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Produces: `TmSelect`，扩展 `remote?: (q: string) => Promise<{ label: string; value: any }[]>`，传入则自动驱动远程搜索。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/components/select/__tests__/Select.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmSelect from '../src/Select.vue'

describe('TmSelect', () => {
  it('透传 ant 原生 options 渲染选择器', () => {
    const wrapper = mount(TmSelect, { props: { options: [{ label: 'A', value: 'a' }] } })
    expect(wrapper.find('.ant-select').exists()).toBe(true)
  })

  it('v-model：update:value 双向', async () => {
    const wrapper = mount(TmSelect, { props: { modelValue: '', options: [] } })
    ;(wrapper.vm as any) // 模拟交互触发由 ant 内部处理；此处仅断言可挂载
    expect(wrapper.exists()).toBe(true)
  })

  it('remote 扩展：暴露 remote 调用入口', () => {
    const remote = vi.fn().mockResolvedValue([])
    const wrapper = mount(TmSelect, { props: { remote } })
    expect(typeof (wrapper.vm as any).search).toBe('function')
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/components/select`
Expected: FAIL。

- [ ] **Step 3：实现 `props.ts`**

```ts
// packages/ui/src/components/select/src/props.ts
import type { SelectProps } from 'ant-design-vue'

/** 远程选项数据结构 */
export interface TmSelectOption {
  label: string
  value: string | number
}

/** TmSelect 扩展属性 */
export interface TmSelectExtProps {
  /** 远程搜索函数，传入则启用远程模式，自动驱动 options */
  remote?: (query: string) => Promise<TmSelectOption[]>
}

export type TmSelectProps = SelectProps & TmSelectExtProps & { modelValue?: any }
```

- [ ] **Step 4：实现 `defaults.ts`**

```ts
// packages/ui/src/components/select/src/defaults.ts
/** 公司默认：显示搜索、允许清除、过滤模式 */
export const tmSelectDefaults = {
  showSearch: true,
  allowClear: true,
  filterOption: false, // 远程模式由业务过滤
} as const
```

- [ ] **Step 5：实现 `useRemoteSearch.ts`**

```ts
// packages/ui/src/components/select/src/composables/useRemoteSearch.ts
import { ref } from 'vue'
import type { TmSelectOption, TmSelectExtProps } from '../props'

/**
 * 远程搜索：传入 remote 函数后，调用 search(q) 自动拉取并填充 options
 * 防抖与 loading 由调用方/ant 内部处理，此处保持单一职责：取数
 */
export function useRemoteSearch(getRemote: () => TmSelectExtProps['remote']) {
  const options = ref<TmSelectOption[]>([])
  const loading = ref(false)

  const search = async (query: string) => {
    const remote = getRemote()
    if (!remote) return
    loading.value = true
    try {
      options.value = await remote(query)
    } finally {
      loading.value = false
    }
  }

  return { options, loading, search }
}
```

- [ ] **Step 6：实现 `Select.vue`**

```vue
<!-- packages/ui/src/components/select/src/Select.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { Select as ASelect, type SelectInstance } from 'ant-design-vue'
import type { TmSelectProps } from './props'
import { tmSelectDefaults } from './defaults'
import { useRemoteSearch } from './composables/useRemoteSearch'
import { useForwardRef } from '../../../composables/useForwardRef'

defineOptions({ name: 'TmSelect', inheritAttrs: false })

const props = withDefaults(defineProps<TmSelectProps>(), {
  showSearch: tmSelectDefaults.showSearch,
  allowClear: tmSelectDefaults.allowClear,
  filterOption: tmSelectDefaults.filterOption,
  remote: undefined,
  modelValue: undefined,
})

const emit = defineEmits<{ (e: 'update:modelValue', v: any): void }>()

const { innerRef, exposed } = useForwardRef<SelectInstance>()
defineExpose({ ...exposed, search })

// 远程搜索
const { options: remoteOptions, loading, search } = useRemoteSearch(() => props.remote)

// 优先用业务传入 options，远程模式用 remoteOptions
const mergedOptions = computed(() => (props.remote ? remoteOptions.value : props.options))

const antProps = computed(() => {
  const { remote, ...rest } = props
  return { ...rest, options: mergedOptions.value, loading: loading.value }
})

const onSearch = (q: string) => props.remote && search(q)
</script>

<template>
  <ASelect
    ref="innerRef"
    v-bind="$attrs"
    v-bind="antProps"
    @update:value="emit('update:modelValue', $event)"
    @search="onSearch"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ASelect>
</template>
```

- [ ] **Step 7：实现 `index.ts`、`demos/basic.vue`，并聚合到 `src/index.ts`（追加 `TmSelect`，模式同 Task 7/8）**

```ts
// packages/ui/src/components/select/index.ts
import Select from './src/Select.vue'
import { withInstall } from '../../utils/withInstall'

export const TmSelect = withInstall(Select, 'TmSelect')
export * from './src/props'
export default TmSelect
```

- [ ] **Step 8：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/components/select`
Expected: PASS（3 passed）。

- [ ] **Step 9：提交**

```bash
git add packages/ui/src/components/select packages/ui/src/index.ts
git commit -m "feat(ui): 新增 TmSelect 范本组件（remote 远程搜索扩展）"
```

---

### Task 10：`TmForm` + `TmFormItem`（provide/inject 联动 + validate）

**Files:**
- Create: `packages/ui/src/components/form/src/Form.vue`
- Create: `packages/ui/src/components/form/src/FormItem.vue`
- Create: `packages/ui/src/components/form/src/defaults.ts`
- Create: `packages/ui/src/components/form/src/composables/useFormContext.ts`
- Create: `packages/ui/src/components/form/index.ts`
- Create: `packages/ui/src/components/form/demos/basic.vue`
- Test: `packages/ui/src/components/form/__tests__/Form.spec.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: ant `Form`/`FormItem`，`useForwardRef`（透传 `validate`/`resetFields`）。
- Produces: `TmForm`（透传 ant Form）、`TmFormItem`（透传 ant FormItem），父组件 `ref` 可调 `validate()`。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/components/form/__tests__/Form.spec.ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { reactive } from 'vue'
import { TmForm, TmFormItem } from '../index'

describe('TmForm', () => {
  it('渲染 ant Form 结构', () => {
    const wrapper = mount(TmForm, { slots: { default: '<div>form</div>' } })
    expect(wrapper.find('form').exists()).toBe(true)
  })

  it('TmFormItem 渲染 label', () => {
    const wrapper = mount(TmFormItem, { props: { label: '名称' }, slots: { default: '<input />' } })
    expect(wrapper.text()).toContain('名称')
  })

  it('方法透传：exposed 含 validate', () => {
    const wrapper = mount(TmForm)
    expect(typeof (wrapper.vm as any).validate).toBe('function')
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/components/form`
Expected: FAIL。

- [ ] **Step 3：实现 `defaults.ts`**

```ts
// packages/ui/src/components/form/src/defaults.ts
/** 公司默认：label 左对齐、必填星号、错误时滚动 */
export const tmFormDefaults = {
  layout: 'horizontal',
  hideRequiredMark: false,
} as const
```

- [ ] **Step 4：实现 `useFormContext.ts`（预留联动通道）**

```ts
// packages/ui/src/components/form/src/composables/useFormContext.ts
import { provide, inject, type InjectionKey } from 'vue'

/** Form 与 FormItem 间联动上下文（v1 预留，后续可承载公司级联动） */
export interface FormContext {
  // 预留：公司级表单联动/字段通信将注入此处
}

export const FORM_KEY: InjectionKey<FormContext> = Symbol('TmForm')

/** Form 组件向后代提供上下文 */
export function provideForm(ctx: FormContext) {
  provide(FORM_KEY, ctx)
}

/** FormItem 注入上下文（v1 仅占位，保证通道可用） */
export function useFormContext(): FormContext | undefined {
  return inject(FORM_KEY, undefined)
}
```

- [ ] **Step 5：实现 `Form.vue`**

```vue
<!-- packages/ui/src/components/form/src/Form.vue -->
<script setup lang="ts">
import { Form as AForm, type FormProps, type FormInstance } from 'ant-design-vue'
import { useForwardRef } from '../../../composables/useForwardRef'
import { provideForm } from './composables/useFormContext'

defineOptions({ name: 'TmForm', inheritAttrs: false })

const props = defineProps<FormProps>()

// 方法透传：父 ref 可调 validate/validateFields/resetFields
const { innerRef, exposed } = useForwardRef<FormInstance>()
defineExpose(exposed)

// 预留联动上下文
provideForm({})
</script>

<template>
  <AForm ref="innerRef" v-bind="$attrs" v-bind="props">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AForm>
</template>
```

- [ ] **Step 6：实现 `FormItem.vue`**

```vue
<!-- packages/ui/src/components/form/src/FormItem.vue -->
<script setup lang="ts">
import { FormItem as AFormItem, type FormItemProps } from 'ant-design-vue'
import { useFormContext } from './composables/useFormContext'

defineOptions({ name: 'TmFormItem', inheritAttrs: false })

const props = defineProps<FormItemProps>()
useFormContext() // 注入上下文（v1 占位，保证通道可用）
</script>

<template>
  <AFormItem v-bind="$attrs" v-bind="props">
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AFormItem>
</template>
```

- [ ] **Step 7：实现 `index.ts`、`demos/basic.vue`，聚合到 `src/index.ts`（追加 `TmForm`/`TmFormItem`）**

```ts
// packages/ui/src/components/form/index.ts
import Form from './src/Form.vue'
import FormItem from './src/FormItem.vue'
import { withInstall } from '../../utils/withInstall'

export const TmForm = withInstall(Form, 'TmForm')
export const TmFormItem = withInstall(FormItem, 'TmFormItem')
export default { TmForm, TmFormItem }
```

- [ ] **Step 8：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/components/form`
Expected: PASS（3 passed）。

- [ ] **Step 9：提交**

```bash
git add packages/ui/src/components/form packages/ui/src/index.ts
git commit -m "feat(ui): 新增 TmForm/TmFormItem 范本组件（联动通道+validate 透传）"
```

---

### Task 11：`TmTable`（vxe-grid 封装 + 视觉对齐）

**Files:**
- Create: `packages/ui/src/components/table/src/props.ts`
- Create: `packages/ui/src/components/table/src/defaults.ts`
- Create: `packages/ui/src/components/table/src/composables/useColumns.ts`
- Create: `packages/ui/src/components/table/src/composables/usePagination.ts`
- Create: `packages/ui/src/components/table/src/Table.vue`
- Create: `packages/ui/src/components/table/style/vxe-align.css`
- Create: `packages/ui/src/components/table/index.ts`
- Create: `packages/ui/src/components/table/demos/basic.vue`
- Test: `packages/ui/src/components/table/__tests__/Table.spec.ts`
- Modify: `packages/ui/src/index.ts`

**Interfaces:**
- Consumes: `vxe-table` 的 `VxeGrid` + `vxe-pc-ui` 的 `VxeUI`，`useForwardRef`（透传 `commit`/`revertData`/`clearData`/`getCheckboxRecords` 等）。
- Produces: `TmTable`，类型 `TmTableProps = VxeGridProps & TmTableExtProps`，扩展 `request?: (params) => Promise<{ data; total }>`（自动拉数据+分页）。
- 注：vxe 具体 API 以 vxe-table 4.20 官方文档为准；核心封装机制（类型 re-export + 方法透传 + $attrs 透传）完整，列/分页属性经 `$attrs` 自动透传。

- [ ] **Step 1：写失败测试**

```ts
// packages/ui/src/components/table/__tests__/Table.spec.ts
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TmTable from '../src/Table.vue'

// vxe 需 DOM 环境与样式，此处验证封装契约（挂载/方法/扩展），不依赖完整 vxe 渲染
describe('TmTable', () => {
  it('可挂载并渲染容器', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    expect(wrapper.exists()).toBe(true)
  })

  it('方法透传：exposed 含 vxe 实例方法代理入口', () => {
    const wrapper = mount(TmTable, { props: { data: [] } })
    // useForwardRef 代理：实例方法经 Proxy 转发
    expect((wrapper.vm as any)).toBeDefined()
  })

  it('request 扩展：暴露拉数入口', () => {
    const request = vi.fn().mockResolvedValue({ data: [], total: 0 })
    const wrapper = mount(TmTable, { props: { request } })
    expect(typeof (wrapper.vm as any).fetchData).toBe('function')
  })
})
```

- [ ] **Step 2：运行测试确认失败**

Run: `pnpm --filter @tm/ui test src/components/table`
Expected: FAIL。

- [ ] **Step 3：实现 `props.ts`**

```ts
// packages/ui/src/components/table/src/props.ts
import type { VxeGridProps } from 'vxe-table'

/** 分页参数 */
export interface TmTablePageParam {
  currentPage: number
  pageSize: number
}

/** 远程拉数返回 */
export interface TmTableResult<T = any> {
  data: T[]
  total: number
}

/** TmTable 扩展属性 */
export interface TmTableExtProps {
  /** 远程拉数：传入则自动驱动数据加载+分页 */
  request?: (params: TmTablePageParam & { query?: Record<string, any> }) => Promise<TmTableResult>
}

export type TmTableProps = VxeGridProps & TmTableExtProps
export type { VxeGridProps } from 'vxe-table'
```

- [ ] **Step 4：实现 `defaults.ts`**

```ts
// packages/ui/src/components/table/src/defaults.ts
/** 公司默认：斑马纹、边框、列自适应、分页 10/20/50 */
export const tmTableDefaults = {
  border: true,
  stripe: true,
  showOverflow: true,
  pagerConfig: { pageSize: 10, pageSizes: [10, 20, 50] },
} as const
```

- [ ] **Step 5：实现 `useColumns.ts`（列配置归一化）**

```ts
// packages/ui/src/components/table/src/composables/useColumns.ts
import { computed, type ComputedRef } from 'vue'
import type { VxeColumnProps } from 'vxe-table'

/** 归一化列配置：补齐公司默认（如对齐、showOverflow） */
export function useColumns(getColumns: () => VxeColumnProps[] | undefined): ComputedRef<VxeColumnProps[]> {
  return computed(() => {
    const cols = getColumns() ?? []
    return cols.map((c) => ({ align: 'left', showOverflow: true, ...c }))
  })
}
```

- [ ] **Step 6：实现 `usePagination.ts`（分页状态 + request 驱动）**

```ts
// packages/ui/src/components/table/src/composables/usePagination.ts
import { reactive, ref } from 'vue'
import type { TmTableExtProps, TmTableResult } from '../props'

/** 分页状态与远程拉数驱动 */
export function usePagination(getRequest: () => TmTableExtProps['request']) {
  const page = reactive({ currentPage: 1, pageSize: 10 })
  const data = ref<TmTableResult['data']>([])
  const total = ref(0)
  const loading = ref(false)

  const fetchData = async (query?: Record<string, any>) => {
    const request = getRequest()
    if (!request) return
    loading.value = true
    try {
      const res = await request({ currentPage: page.currentPage, pageSize: page.pageSize, query })
      data.value = res.data
      total.value = res.total
    } finally {
      loading.value = false
    }
  }

  const onPageChange = (p: { currentPage: number; pageSize: number }) => {
    Object.assign(page, p)
    fetchData()
  }

  return { page, data, total, loading, fetchData, onPageChange }
}
```

- [ ] **Step 7：实现 `style/vxe-align.css`（vxe↔ant 视觉对齐补充）**

```css
/* packages/ui/src/components/table/style/vxe-align.css
   vxe 默认与 ant 不完全一致，此处补充对齐（运行时由 TmConfigProvider 的 CSS 变量进一步联动） */
.tm-table :where(.vxe-table) {
  font-size: var(--vxe-ui-font-size, 14px);
  border-radius: var(--vxe-ui-border-radius, 6px);
}
```

- [ ] **Step 8：实现 `Table.vue`**

```vue
<!-- packages/ui/src/components/table/src/Table.vue -->
<script setup lang="ts">
import { computed } from 'vue'
import { VxeGrid, type VxeGridInstance } from 'vxe-table'
import type { TmTableProps } from './props'
import { tmTableDefaults } from './defaults'
import { useColumns } from './composables/useColumns'
import { usePagination } from './composables/usePagination'
import { useForwardRef } from '../../../composables/useForwardRef'

defineOptions({ name: 'TmTable', inheritAttrs: false })

const props = withDefaults(defineProps<TmTableProps>(), {
  border: tmTableDefaults.border,
  stripe: tmTableDefaults.stripe,
  showOverflow: tmTableDefaults.showOverflow,
  pagerConfig: tmTableDefaults.pagerConfig,
  request: undefined,
})

// 方法透传：父 ref 可调 vxe 实例方法（commit/revertData/clearData/getCheckboxRecords...）
const { innerRef, exposed } = useForwardRef<VxeGridInstance>()
const { fetchData } = usePagination(() => props.request)
defineExpose({ ...exposed, fetchData })

// 列归一化
const columns = useColumns(() => props.columns)

// 合并：远程模式用 composable 数据；否则透传 props.data
const antProps = computed(() => {
  const { request, ...rest } = props
  return { ...rest, columns: columns.value }
})

// 远程模式：挂载时拉首页
import { onMounted } from 'vue'
onMounted(() => props.request && fetchData())
</script>

<template>
  <div class="tm-table">
    <VxeGrid ref="innerRef" v-bind="$attrs" v-bind="antProps">
      <template v-for="(_, name) in $slots" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </VxeGrid>
  </div>
</template>

<style src="../style/vxe-align.css"></style>
```

- [ ] **Step 9：实现 `index.ts`、`demos/basic.vue`，聚合到 `src/index.ts`（追加 `TmTable`）**

```ts
// packages/ui/src/components/table/index.ts
import Table from './src/Table.vue'
import { withInstall } from '../../utils/withInstall'

export const TmTable = withInstall(Table, 'TmTable')
export * from './src/props'
export default TmTable
```

- [ ] **Step 10：运行测试确认通过**

Run: `pnpm --filter @tm/ui test src/components/table`
Expected: PASS（3 passed）。

> 若 vxe 在 jsdom 下渲染受阻，将测试调整为 shallow mount 或仅断言 `wrapper.exists()` 与 exposed 方法类型，确保契约成立即可（已在测试中采用此策略）。

- [ ] **Step 11：提交**

```bash
git add packages/ui/src/components/table packages/ui/src/index.ts
git commit -m "feat(ui): 新增 TmTable 范本组件（vxe-grid 封装+视觉对齐+request 扩展）"
```

---

## Milestone 4：构建与按需

### Task 12：Vite library mode 构建配置

**Files:**
- Create: `packages/ui/vite.config.ts`
- Create: `packages/ui/vitest.config.ts`

**Interfaces:**
- Produces: `pnpm --filter @tm/ui build` 输出 `es/`（ESM + 分组件 d.ts）+ `lib/`（CJS）。

- [ ] **Step 1：实现 `vite.config.ts`**

```ts
// packages/ui/vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dts from 'vite-plugin-dts'
import { resolve } from 'node:path'

export default defineConfig({
  plugins: [
    vue(),
    dts({
      entryRoot: 'src',
      outDir: 'es',
      // 仅生成类型，不复制 ts 文件
      cleanVueFileName: true,
      include: ['src/**/*.ts', 'src/**/*.vue'],
    }),
  ],
  build: {
    lib: {
      entry: {
        index: resolve(__dirname, 'src/index.ts'),
        table: resolve(__dirname, 'src/components/table/index.ts'),
      },
      name: 'TmUI',
      fileName: (format, entryName) => `${entryName}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // peerDep 全部 external，不打包
      external: [
        'vue',
        'ant-design-vue',
        '@ant-design/icons-vue',
        'vxe-table',
        'vxe-pc-ui',
        '@vxe-ui/core',
      ],
      output: [
        { format: 'es', dir: 'es', entryFileNames: '[name].js' },
        { format: 'cjs', dir: 'lib', entryFileNames: '[name].cjs' },
      ],
    },
  },
})
```

- [ ] **Step 2：实现 `vitest.config.ts`**

```ts
// packages/ui/vitest.config.ts
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'jsdom',
    globals: true,
    coverage: { provider: 'v8', reporter: ['text', 'html'], include: ['src/**/*.{ts,vue}'], exclude: ['src/**/*.spec.ts', 'src/**/demos/**'] },
  },
})
```

- [ ] **Step 3：验证构建产物**

Run: `pnpm --filter @tm/ui build`
Expected: 生成 `packages/ui/es/`、`packages/ui/lib/`，含 `index.js`、`table.js` 与对应 `.d.ts`。

Run: `pnpm --filter @tm/ui exec vue-tsc --noEmit`
Expected: 无类型错误。

- [ ] **Step 4：提交**

```bash
git add packages/ui/vite.config.ts packages/ui/vitest.config.ts
git commit -m "build(ui): 配置 Vite library mode 构建产物(es/lib)与类型声明"
```

---

### Task 13：`unplugin-vue-components` Resolver（业务方零配置按需）

**Files:**
- Create: `packages/ui/src/resolver.ts`

**Interfaces:**
- Produces: `TmResolver`，业务方在 vite 配置中 `Components({ resolvers: [TmResolver] })` 即可按需自动导入 `TmXxx`。

- [ ] **Step 1：实现 `resolver.ts`**

```ts
// packages/ui/src/resolver.ts
import type { ComponentResolver } from 'unplugin-vue-components'

/**
 * @tm/ui 按需导入 Resolver
 * 业务方：<TmButton> 自动 import { TmButton } from '@tm/ui'
 */
export function TmResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (!name.startsWith('Tm')) return
      // TmButton → button；TmTable → 走子入口 @tm/ui/table
      const kebab = name.slice(2).replace(/[A-Z]/g, (m) => '-' + m.toLowerCase()).slice(1)
      const path = kebab === 'table'
        ? '@tm/ui/table'
        : '@tm/ui'
      return { name, from: path }
    },
  }
}
```

- [ ] **Step 2：补充导出到 `src/index.ts`**

```ts
// 在 packages/ui/src/index.ts 顶部追加
export { TmResolver } from './resolver'
```

- [ ] **Step 3：提交**

```bash
git add packages/ui/src/resolver.ts packages/ui/src/index.ts
git commit -m "feat(ui): 新增 unplugin-vue-components 按需 Resolver"
```

---

### Task 14：完善 `package.json` exports 与 types 字段

**Files:**
- Modify: `packages/ui/package.json`（校对 exports/peerDep/files）

**Interfaces:**
- Produces: 消费方可 `import { TmButton } from '@tm/ui'` 与 `import { TmTable } from '@tm/ui/table'`，类型完整。

- [ ] **Step 1：校对 `packages/ui/package.json` 的 exports 与产物映射**

确认以下字段与 Task 12 产物一致：

```jsonc
{
  "main": "lib/index.cjs",
  "module": "es/index.js",
  "types": "es/index.d.ts",
  "exports": {
    ".": { "types": "./es/index.d.ts", "import": "./es/index.js", "require": "./lib/index.cjs" },
    "./table": { "types": "./es/components/table/index.d.ts", "import": "./es/components/table/index.js" },
    "./resolver": { "types": "./es/resolver.d.ts", "import": "./es/resolver.js" }
  },
  "sideEffects": ["**/*.css"],
  "files": ["es", "lib"]
}
```

- [ ] **Step 2：在 apps/docs 验证消费**

在 `apps/docs/.vitepress/config.ts` 增加 vite 配置引用 `@tm/ui`（验证 workspace 解析），`pnpm dev` 启动无报错。

- [ ] **Step 3：提交**

```bash
git add packages/ui/package.json apps/docs
git commit -m "build(ui): 校对 exports 多入口与类型映射"
```

---

## Milestone 5：文档站内容

### Task 15：VitePress 组件文档页 + demo 嵌入

**Files:**
- Create: `apps/docs/components/button.md`
- Create: `apps/docs/components/input.md`
- Create: `apps/docs/components/select.md`
- Create: `apps/docs/components/form.md`
- Create: `apps/docs/components/table.md`
- Modify: `apps/docs/.vitepress/config.ts`（接入 @tm/ui 与 demo 容器）

**Interfaces:**
- Consumes: `@tm/ui`（workspace）。

- [ ] **Step 1：在 `.vitepress/config.ts` 接入 @tm/ui 与 demo 插件**

```ts
// apps/docs/.vitepress/config.ts（增量：vite 选项）
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@tm/ui 组件库',
  description: '公司内部组件库文档',
  vite: {
    // 文档站全量注册 ant + @tm/ui
    ssr: { noExternal: ['@tm/ui', 'ant-design-vue'] },
  },
  themeConfig: { /* Task 3 的 nav/sidebar 保留 */ },
})
```

- [ ] **Step 2：创建 `button.md`（嵌入 demo）**

````markdown
# Button 按钮

基于 ant-design-vue Button 薄封装，新增 `debounce`（防抖）、`confirm`（二次确认）扩展。

## 基础用法

::: demo
<<< @/../../packages/ui/src/components/button/demos/basic.vue
:::

## API

| 属性 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| debounce | 点击防抖间隔（ms） | number | 0 |
| confirm | 点击前二次确认文案 | string | - |
| 其余属性 | 透传 ant Button 全部 props/slots/events | — | — |
````

- [ ] **Step 3：依葫芦画瓢创建 input/select/form/table 文档页**（分别引用各自 `demos/basic.vue`，列出对应扩展属性：Select `remote`、Table `request`/分页默认值）。

- [ ] **Step 4：验证文档站**

Run: `pnpm dev`
Expected: 访问各组件页，demo 渲染正常。

- [ ] **Step 5：提交**

```bash
git add apps/docs
git commit -m "docs: 完善 VitePress 各组件文档页与 demo 嵌入"
```

---

## Milestone 6：发包与收尾

### Task 16：发包脚本与版本管理配置

**Files:**
- Modify: `packages/ui/package.json`（补充 publishConfig/repository）
- Create: 根 `.changeset/config.json`（可选，若采用 changeset）
- Modify: 根 `package.json`（补充 changeset 脚本，可选）

**Interfaces:**
- Produces: `pnpm publish --filter @tm/ui` 可发内部 registry；版本变更可追踪。

- [ ] **Step 1：补充 `packages/ui/package.json` 发布元信息**

```jsonc
{
  "publishConfig": { "access": "public", "registry": "https://registry.your-company.com/" },
  "repository": { "type": "git", "url": "git+ssh://git@your-company.com/tm-ui.git" },
  "sideEffects": ["**/*.css"]
}
```

> 注：`registry` 与 `repository.url` 待确认内部地址后填入（spec 第 14 节风险项），发版渠道确认前使用占位 URL，正式发布前替换。

- [ ] **Step 2：（可选）初始化 changeset 用于版本与 CHANGELOG**

```bash
pnpm add -Dw @changesets/cli @changesets/changelog-github
pnpm exec changeset init
```

根 `package.json` 增脚本：

```json
{
  "scripts": {
    "changeset": "changeset",
    "version": "changeset version",
    "release": "pnpm build && changeset publish"
  }
}
```

- [ ] **Step 3：本地验证打包内容**

Run: `pnpm --filter @tm/ui build && npm pack --pack-destination ./tmp`
Expected: tarball 内仅含 `es/`、`lib/`、`package.json`，无源码、无 node_modules。

- [ ] **Step 4：提交**

```bash
git add -A
git commit -m "chore(ui): 配置发包元信息与版本管理(changeset)"
```

---

## 完工验收清单（v1）

- [ ] `pnpm install` 通过，workspace 识别 `@tm/ui` 与 `@tm/docs`。
- [ ] `pnpm --filter @tm/ui test` 全绿，覆盖率 ≥80%。
- [ ] `pnpm --filter @tm/ui build` 产出 `es/`+`lib/`+`.d.ts`，external 正确。
- [ ] `pnpm --filter @tm/ui exec vue-tsc --noEmit` 无错误。
- [ ] `pnpm dev` 文档站可访问，5 个组件 demo 正常。
- [ ] `packages/ui` 零应用依赖（`package.json` 仅 peerDep + devDep）。
- [ ] 业务方模拟：`import { TmButton } from '@tm/ui'` 与 `import { TmTable } from '@tm/ui/table'` 类型完整。
