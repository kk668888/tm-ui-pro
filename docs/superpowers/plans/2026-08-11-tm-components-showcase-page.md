# TM 组件陈列页 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 在 `apps/demo` 新增 dev-only 的 `/tm-components` 组件陈列页，按卡片分区展示全部 tm-ui 组件（21 组件 + 命令式 Message/Notification），核心组件带交互示例。

**Architecture:** 仿 theme-preview 范式：单域 `tm-components`，薄壳 `TmComponents.page.vue` → `Components.view.vue` 容器 → 5 个分类 `<a-card>` section。dev-only 路由（DEV 分支）+ `devOnlyMenus` + mock admin 权限码。tm 组件一律显式 `import { TmXxx } from '@tm/ui'`（demo 未启用 TmResolver；显式导入同时保证单测可直接解析）。测试依赖 `vitest.setup.ts` 全局 stub `matchMedia`/`ResizeObserver` + 手动注册 ant 组件。

**Tech Stack:** Vue 3.5 + Vite 8 + `@tm/ui` 0.1.0（构建产物 `es/`）+ ant-design-vue 4 + vitest 4 + @vue/test-utils。

## Global Constraints

- **tm 组件显式导入**：`import { TmXxx } from '@tm/ui'`；ant 组件走 `a-xxx`（AntDesignVueResolver 自动解析，测试中需手动注册）。
- **dev-only**：路由进 `import.meta.env.DEV` 分支、菜单进 `devOnlyMenus`、mock admin 加权限码 `TmComponents`。
- **不新增依赖**、不新增 mock API、不动 theme-preview 现有 `TmUiShowcase.section.vue`。
- **语义色变量**：`--bg-container` / `--text-title` / `--text-secondary` / `--border-light`。
- **代码注释中文**；提交信息中文、遵循 conventional commits。
- **`routeNames.ts` 不要手改**：vite route-names 插件扫描 `*.routes.ts` 自动补 `ROUTE_NAMES.TmComponents`。

## API 速查（从 packages/ui 的 demos/源码核实，本计划代码以此为准，勿凭 ant 记忆改写）

| 组件 | 已核实用法 |
| --- | --- |
| TmButton | `type/danger/disabled/loading/size`、`confirm="..."`、`:debounce="500"`、`<template #icon>`、`@click` |
| TmInput | `v-model`、`placeholder`、`allow-clear` |
| TmInputNumber | `v-model`、`:min`、`:max`、`:precision` |
| TmSelect | `v-model`、`:options`（`{label,value}`）、`:remote`、`placeholder`、`style` |
| TmRadioGroup | `v-model`、`:options`（可带 `disabled`） |
| TmCheckboxGroup | `v-model`（数组）、`:options` |
| TmSwitch | `v-model`、`checked-children`、`un-checked-children` |
| TmDatePicker / TmRangePicker | `v-model` + `value-format="YYYY-MM-DD"` 走字符串模式、`style` |
| TmCascader | `v-model`（数组）、`:options`（children 级联） |
| TmTreeSelect | `v-model`、`:tree-data` |
| TmForm / TmFormItem | 手动模式：`ref="formRef"`、`:model`、`:disabled`、`:submitting`、`layout`；`formRef.validate()/resetToInitial()/isDirty()/getDirtyFields()/markInitial()`；FormItem `label/name/:rules/:wrapper-col`。**0.1.0 无 schema prop，勿用 auto-generate** |
| TmTable | `:data`+`:columns`（静态本地切片分页）、`:pager-config`、`@row-click`（VxeGridListeners）、列 slot `slots:{default:'status_default'}`；类型 `TmTableProps['data']` |
| TmModal / TmDrawer | `v-model`、`title`、`@ok`/`@cancel`；Drawer 另 `placement`、`:width` |
| TmMessage | `TmMessage.success/info/warning/error/loading(返回 close fn)`；无 TmApp 时降级 ant 全局 message |
| TmNotification | `TmNotification.success/info/warning/error({ message, description })` |
| TmTag | `status`（success/processing/failed/warning）、`color` |
| TmEmpty | 默认或 `description` |
| TmBadge | `:count`、`:overflow-count`、`status` |
| TmConfigProvider | `:theme-mode="'light'|'dark'"`，桥接 ant token → vxe CSS 变量 |
| TmApp | 包裹命令式 holder（可选；无则 TmMessage 降级 ant 全局） |

---

## 任务结构总览

| Task | 交付 | 测试 |
| --- | --- | --- |
| 1 | 测试基建 + 路由/菜单/权限/壳/容器 | view 页头冒烟 |
| 2 | 通用 General section（TmButton） | section 冒烟 |
| 3 | 表单 Form section（11 控件 + TmForm） | section 冒烟 |
| 4 | 数据展示 DataDisplay section（TmTable/Tag/Empty/Badge） | section 冒烟 |
| 5 | 反馈 Feedback section（Message/Modal/Drawer/Notification） | section 冒烟 |
| 6 | 全局配置 Config section（ConfigProvider/App） | section 冒烟 |
| 7 | 收尾：最终 view 冒烟 + 全量测试 | view 全 section 断言 |

---

### Task 1: 测试基建 + 页面骨架（路由 / 菜单 / 权限 / 壳 / 容器）

**Files:**
- Create: `apps/demo/vitest.setup.ts`
- Modify: `apps/demo/vitest.config.ts`（test 块加 `setupFiles`）
- Create: `apps/demo/src/pages/tm-components/tm-components.routes.ts`
- Create: `apps/demo/src/pages/tm-components/pages/TmComponents.page.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/views/Components.view.spec.ts`
- Modify: `apps/demo/src/core/bootstrap/router.ts`
- Modify: `apps/demo/src/modules/app/config/menu.config.ts`
- Modify: `apps/demo/src/mock/handlers/auth.ts`

**Interfaces:**
- Consumes: 无（首个任务）。
- Produces: `tmComponentsRoutes`（`RouteRecordRaw[]`，name `TmComponents`）；`ComponentsView`（默认导出，根类 `.tm-components-page` + 页头文本「TM 组件」）；Task 2-6 在其 header div 之后追加 `<XxxSection />`。

- [ ] **Step 1: 创建测试基建 `vitest.setup.ts`**（对齐 `packages/ui/src/test/setup.ts` 的守卫式补丁）

```ts
// apps/demo/vitest.setup.ts
// 与 packages/ui/src/test/setup.ts 一致：补齐 jsdom 缺失的 matchMedia / ResizeObserver。
// matchMedia 是 ant Form / vxe ResponsiveObserve 依赖；ResizeObserver 是 vxe 虚拟渲染依赖。
if (!window.matchMedia) {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string): MediaQueryList =>
      ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }) as MediaQueryList,
  });
}

if (!(window as { ResizeObserver?: unknown }).ResizeObserver) {
  (window as { ResizeObserver?: unknown }).ResizeObserver = class ResizeObserver {
    observe(): void {}
    unobserve(): void {}
    disconnect(): void {}
  };
}
```

- [ ] **Step 2: 修改 `apps/demo/vitest.config.ts`**，在 `test` 对象加 `setupFiles`

```ts
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
  },
```

- [ ] **Step 3: 创建路由 `tm-components.routes.ts`**

```ts
import type { RouteRecordRaw } from 'vue-router';

/**
 * TM 组件陈列域路由（dev-only，见 bootstrap/router.ts DEV 分支）。
 * name 用字符串字面量：ROUTE_NAMES.TmComponents 由 route-names 插件扫描本文件自动生成。
 */
export const tmComponentsRoutes: RouteRecordRaw[] = [
  {
    path: '/tm-components',
    name: 'TmComponents',
    meta: { code: 'TmComponents', title: 'TM 组件' },
    component: () => import('./pages/TmComponents.page.vue'),
  },
];
```

- [ ] **Step 4: 创建薄壳 `pages/TmComponents.page.vue`**

```vue
<script setup lang="ts">
import ComponentsView from '../features/components/views/Components.view.vue';

defineOptions({ name: 'TmComponents' });
</script>

<template>
  <ComponentsView />
</template>
```

- [ ] **Step 5: 创建容器 `views/Components.view.vue`**（Task 1 仅页头；Task 2-6 在 header 后追加 section）

```vue
<script setup lang="ts">
defineOptions({ name: 'ComponentsView' });
</script>

<template>
  <div class="tm-components-page flex flex-col gap-6 lg:gap-8">
    <!-- 页头说明使用语义色，随亮 / 暗主题自动适配 -->
    <div
      class="flex flex-wrap items-start justify-between gap-6 rounded-lg border border-light bg-[var(--bg-container)] p-6"
    >
      <div class="min-w-0">
        <h2 class="m-0 mb-3 text-2xl font-bold text-title">TM 组件</h2>
        <p class="m-0 text-sm leading-relaxed text-secondary">
          集中陈列 <code>@tm/ui</code> 全部组件：通用 / 表单 / 数据展示 / 反馈 / 全局配置。
          核心组件带交互示例；亮暗主题由顶栏切换器统一联动。
        </p>
      </div>
    </div>
    <!-- @scaffold:tm-sections ← Task 2-6 在此追加各分类 section -->
  </div>
</template>
```

- [ ] **Step 6: 接入根路由 `router.ts`**（两处：import + DEV 分支展开）

在 `import { themePreviewRoutes } ...` 之后加一行：

```ts
import { tmComponentsRoutes } from '@/pages/tm-components/tm-components.routes';
```

将 DEV 条件展开行：

```ts
...(import.meta.env.DEV ? [...readmeRoutes, ...themePreviewRoutes] : []),
```

改为：

```ts
...(import.meta.env.DEV ? [...readmeRoutes, ...themePreviewRoutes, ...tmComponentsRoutes] : []),
```

- [ ] **Step 7: 接入 dev 菜单 `menu.config.ts`**（`devOnlyMenus` 数组末尾加一项）

```ts
const devOnlyMenus: MenuConfig = [
  {
    label: '主题预览',
    code: 'ThemePreview',
    routeName: 'ThemePreview',
  },
  {
    label: '项目文档',
    code: 'Readme',
    routeName: 'Readme',
  },
  {
    label: 'TM 组件',
    code: 'TmComponents',
    routeName: 'TmComponents',
  },
];
```

- [ ] **Step 8: 给 mock admin 加权限码 `auth.ts`**（`ROLES.admin.permissions` 数组追加 `'TmComponents'`，供路由守卫 `meta.code` 校验放行）

```ts
    permissions: [
      'UserManagement',
      'RoleManagement',
      'UserManagement:delete',
      'ThemePreview',
      'Readme',
      'TmComponents',
    ],
```

- [ ] **Step 9: 写 view 页头冒烟测试 `views/Components.view.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import ComponentsView from './Components.view.vue';

describe('ComponentsView', () => {
  it('渲染页面根容器与页头', () => {
    const wrapper = mount(ComponentsView);
    expect(wrapper.find('.tm-components-page').exists()).toBe(true);
    expect(wrapper.text()).toContain('TM 组件');
  });
});
```

- [ ] **Step 10: 运行测试验证（预期 PASS）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components/features/components/views/Components.view.spec.ts`
Expected: `Test Files 1 passed`，断言「TM 组件」通过。

- [ ] **Step 11: 提交**

```bash
git add apps/demo/vitest.setup.ts apps/demo/vitest.config.ts \
  apps/demo/src/pages/tm-components apps/demo/src/core/bootstrap/router.ts \
  apps/demo/src/modules/app/config/menu.config.ts apps/demo/src/mock/handlers/auth.ts
git commit -m "feat(demo): 新增 tm-components 陈列页骨架（路由/菜单/权限/壳/容器）"
```

---

### Task 2: 通用 General section（TmButton）

**Files:**
- Create: `apps/demo/src/pages/tm-components/features/components/test-utils.ts`
- Create: `apps/demo/src/pages/tm-components/features/components/General.section.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/General.section.spec.ts`
- Modify: `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue`

**Interfaces:**
- Consumes: `ComponentsView`（Task 1）。
- Produces: `GeneralSection`（默认导出，根元素 `class="section-general"`）；`mountSection(component, options?)` 测试助手（Task 3-7 复用）。

- [ ] **Step 1: 写失败的 section 测试（RED）`General.section.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import GeneralSection from './General.section.vue';

describe('GeneralSection', () => {
  it('渲染 section 容器与按钮分组', () => {
    const wrapper = mountSection(GeneralSection);
    expect(wrapper.find('.section-general').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('主按钮');
    expect(text).toContain('二次确认删除');
    expect(text).toContain('防抖500ms');
  });
});
```

（此时 `test-utils.ts` 与 `General.section.vue` 尚不存在 → import 报错，RED。）

- [ ] **Step 2: 创建测试助手 `test-utils.ts`**（unplugin-vue-components 不在 vitest 中运行，手动注册 section 用到的 ant 组件）

```ts
import { mount } from '@vue/test-utils';
import { Card as ACard, Space as ASpace, Tag as ATag, Divider as ADivider } from 'ant-design-vue';

/** sections 依赖 unplugin-vue-components 解析 `a-xxx`；单测需手动注册 antd 标签 */
const antComponents = { ACard, ASpace, ATag, ADivider };

export function mountSection(
  component: never,
  options: Parameters<typeof mount>[1] = {},
) {
  return mount(component, {
    ...options,
    global: {
      ...options.global,
      components: { ...antComponents, ...options.global?.components },
    },
  });
}
```

- [ ] **Step 3: 实现 `General.section.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { TmButton, TmMessage } from '@tm/ui';

defineOptions({ name: 'GeneralSection' });

const loading = ref(false);

function fakeAsync() {
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
    TmMessage.success('异步操作完成');
  }, 800);
}
</script>

<template>
  <a-card class="section-general" title="① 通用 General">
    <p class="mb-4 text-sm text-secondary">
      TmButton：继承 ant Button 全部 props / slots / events，另加 debounce 防抖与 confirm 二次确认。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <a-space wrap>
        <TmButton type="primary">主按钮</TmButton>
        <TmButton>默认按钮</TmButton>
        <TmButton type="dashed">虚线按钮</TmButton>
        <TmButton danger>危险按钮</TmButton>
        <TmButton type="link">链接按钮</TmButton>
        <TmButton type="text">文本按钮</TmButton>
      </a-space>
      <a-space wrap>
        <TmButton size="large">大尺寸</TmButton>
        <TmButton>中尺寸</TmButton>
        <TmButton size="small">小尺寸</TmButton>
        <TmButton :loading="loading" @click="fakeAsync">加载态</TmButton>
        <TmButton disabled>禁用</TmButton>
      </a-space>
      <a-space wrap>
        <TmButton :debounce="500" @click="TmMessage.success('防抖触发（500ms 内仅触发一次）')">
          防抖 500ms
        </TmButton>
        <TmButton confirm="确认删除这条数据？" danger @click="TmMessage.success('已确认删除')">
          二次确认删除
        </TmButton>
        <TmButton type="primary">
          <template #icon><SearchOutlined /></template>
          带图标
        </TmButton>
      </a-space>
    </a-space>
  </a-card>
</template>
```

- [ ] **Step 4: 挂到容器 `Components.view.vue`**（两处：script 加 import，模板 header 后加 `<GeneralSection />`）

script 块加：

```ts
import GeneralSection from '../components/General.section.vue';
```

模板中 `<!-- @scaffold:tm-sections ... -->` 位置改为：

```vue
    <GeneralSection />
    <!-- Task 3-6 继续在此追加 -->
```

- [ ] **Step 5: 运行测试（GREEN）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components/features/components/General.section.spec.ts src/pages/tm-components/features/components/views/Components.view.spec.ts`
Expected: 2 files PASS。

- [ ] **Step 6: 提交**

```bash
git add apps/demo/src/pages/tm-components
git commit -m "feat(demo): tm-components 通用区（TmButton 分组 + 挂载测试助手）"
```

---

### Task 3: 表单 Form section（11 控件 + TmForm 手动模式）

**Files:**
- Create: `apps/demo/src/pages/tm-components/features/components/Form.section.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/Form.section.spec.ts`
- Modify: `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue`

**Interfaces:**
- Consumes: `mountSection`（Task 2）。
- Produces: `FormSection`（默认导出，根元素 `class="section-form"`）。

- [ ] **Step 1: 写失败的 section 测试（RED）`Form.section.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import FormSection from './Form.section.vue';

describe('FormSection', () => {
  it('渲染 section 容器与基础控件回显', () => {
    const wrapper = mountSection(FormSection);
    expect(wrapper.find('.section-form').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('fruit=apple');
    expect(text).toContain('TmForm手动模式');
  });
});
```

- [ ] **Step 2: 实现 `Form.section.vue`**

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue';
import {
  TmForm,
  TmFormItem,
  type FormInstance,
  TmButton,
  TmInput,
  TmInputNumber,
  TmSelect,
  TmRadioGroup,
  TmCheckboxGroup,
  TmSwitch,
  TmDatePicker,
  TmRangePicker,
  TmCascader,
  TmTreeSelect,
  TmMessage,
} from '@tm/ui';

defineOptions({ name: 'FormSection' });

// ── 基础控件 v-model 回显 ─────────────────────────────
const name = ref('');
const age = ref(30);
const fruit = ref<string>('apple');
const role = ref('admin');
const tags = ref<string[]>(['vue']);
const enabled = ref(true);
const date = ref('2026-08-11');
const range = ref(['2026-08-10', '2026-08-12'] as [string, string]);
const region = ref<string[]>(['zhejiang', 'hangzhou']);
const treeValue = ref('0-0-1');

const fruitOptions = [
  { label: '苹果', value: 'apple' },
  { label: '香蕉', value: 'banana' },
  { label: '橙子', value: 'orange' },
];
const roleOptions = [
  { label: '管理员', value: 'admin' },
  { label: '普通用户', value: 'user' },
];
const tagOptions = [
  { label: 'Vue', value: 'vue' },
  { label: 'React', value: 'react' },
  { label: 'Svelte', value: 'svelte', disabled: true },
];
const regionOptions = [
  {
    value: 'zhejiang',
    label: '浙江',
    children: [
      { value: 'hangzhou', label: '杭州' },
      { value: 'ningbo', label: '宁波' },
    ],
  },
  {
    value: 'jiangsu',
    label: '江苏',
    children: [{ value: 'nanjing', label: '南京' }],
  },
];
const treeData = [
  {
    title: 'Node1',
    value: '0-0',
    children: [
      { title: 'Child Node1', value: '0-0-1' },
      { title: 'Child Node2', value: '0-0-2' },
    ],
  },
  {
    title: 'Node2',
    value: '0-1',
    children: [{ title: 'Child Node3', value: '0-1-1' }],
  },
];

// ── TmForm 手动模式：校验 / 提交 / 脏追踪（0.1.0 无 schema，勿用 auto-generate）──
const formState = reactive<{ username: string; email: string; dept: string | undefined }>({
  username: '',
  email: '',
  dept: undefined,
});
type TmFormRef = FormInstance & {
  isDirty?: () => boolean;
  getDirtyFields?: () => string[];
  resetToInitial?: () => void;
  markInitial?: () => void;
};
const formRef = ref<TmFormRef>();
const submitting = ref(false);

async function onSubmit() {
  try {
    submitting.value = true;
    await formRef.value?.validate();
    await new Promise((r) => setTimeout(r, 600));
    TmMessage.success(`提交成功：${JSON.stringify(formState)}`);
    formRef.value?.markInitial?.();
  } catch {
    TmMessage.warning('表单校验未通过，请检查');
  } finally {
    submitting.value = false;
  }
}

function onReset() {
  formRef.value?.resetToInitial?.();
}
</script>

<template>
  <a-card class="section-form" title="② 表单 Form">
    <p class="mb-4 text-sm text-secondary">
      表单控件统一 v-model，右侧实时回显；TmForm 手动模式演示必填 / 邮箱校验与脏追踪。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <TmInput v-model="name" placeholder="请输入用户名" allow-clear />
          <span class="ml-2 text-secondary">name={{ name || '空' }}</span>
        </div>
        <div>
          <TmInputNumber v-model="age" :min="0" :max="100" />
          <span class="ml-2 text-secondary">age={{ age }}</span>
        </div>
        <div>
          <TmSelect v-model="fruit" :options="fruitOptions" placeholder="请选择水果" style="width: 200px" />
          <span class="ml-2 text-secondary">fruit={{ fruit }}</span>
        </div>
        <div>
          <TmRadioGroup v-model="role" :options="roleOptions" />
          <span class="ml-2 text-secondary">role={{ role }}</span>
        </div>
        <div>
          <TmCheckboxGroup v-model="tags" :options="tagOptions" />
          <span class="ml-2 text-secondary">tags={{ tags.join('、') }}</span>
        </div>
        <div>
          <TmSwitch v-model="enabled" checked-children="开" un-checked-children="关" />
          <span class="ml-2 text-secondary">enabled={{ enabled }}</span>
        </div>
        <div>
          <TmDatePicker v-model="date" value-format="YYYY-MM-DD" style="width: 200px" />
          <span class="ml-2 text-secondary">date={{ date }}</span>
        </div>
        <div>
          <TmRangePicker v-model="range" value-format="YYYY-MM-DD" style="width: 280px" />
          <span class="ml-2 text-secondary">range={{ range.join('~') }}</span>
        </div>
        <div>
          <TmCascader v-model="region" :options="regionOptions" style="width: 240px" />
          <span class="ml-2 text-secondary">region={{ region.join('/') }}</span>
        </div>
        <div>
          <TmTreeSelect v-model="treeValue" :tree-data="treeData" style="width: 240px" />
          <span class="ml-2 text-secondary">tree={{ treeValue }}</span>
        </div>
      </div>

      <a-divider orientation="left">TmForm 手动模式</a-divider>
      <TmForm
        ref="formRef"
        :model="formState"
        :disabled="submitting"
        :submitting="submitting"
        layout="horizontal"
      >
        <TmFormItem label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
          <TmInput v-model="formState.username" placeholder="请输入用户名" />
        </TmFormItem>
        <TmFormItem label="邮箱" name="email" :rules="[{ type: 'email', message: '邮箱格式错误' }]">
          <TmInput v-model="formState.email" placeholder="请输入邮箱" />
        </TmFormItem>
        <TmFormItem label="部门" name="dept">
          <TmSelect
            v-model="formState.dept"
            :options="[
              { label: '前端', value: 'fe' },
              { label: '后端', value: 'be' },
            ]"
            placeholder="请选择部门"
            style="width: 200px"
          />
        </TmFormItem>
        <TmFormItem v-if="formRef?.isDirty?.()" label=" ">
          <a-tag color="warning">已修改：{{ formRef?.getDirtyFields?.().join('、') }}</a-tag>
        </TmFormItem>
        <TmFormItem>
          <a-space>
            <TmButton type="primary" :loading="submitting" @click="onSubmit">提交（校验）</TmButton>
            <TmButton @click="onReset">重置到初始值</TmButton>
          </a-space>
        </TmFormItem>
      </TmForm>
    </a-space>
  </a-card>
</template>
```

- [ ] **Step 3: 挂到容器 `Components.view.vue`**

script 加 `import FormSection from '../components/Form.section.vue';`；模板在 `<GeneralSection />` 后加：

```vue
    <FormSection />
```

- [ ] **Step 4: 运行测试（GREEN）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components/features/components/Form.section.spec.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add apps/demo/src/pages/tm-components
git commit -m "feat(demo): tm-components 表单区（11 控件 v-model 回显 + TmForm 手动模式校验）"
```

---

### Task 4: 数据展示 DataDisplay section（TmTable / Tag / Empty / Badge）

**Files:**
- Create: `apps/demo/src/pages/tm-components/features/components/DataDisplay.section.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/DataDisplay.section.spec.ts`
- Modify: `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue`

**Interfaces:**
- Consumes: `mountSection`（Task 2）。
- Produces: `DataDisplaySection`（默认导出，根元素 `class="section-data-display"`）。

- [ ] **Step 1: 写失败的 section 测试（RED）`DataDisplay.section.spec.ts`**（仅断言同步渲染的 Tag/Badge 文案与容器，不断言 vxe 异步渲染的行数据）

```ts
import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import DataDisplaySection from './DataDisplay.section.vue';

describe('DataDisplaySection', () => {
  it('渲染 section 容器与标签 / 徽标 / 空态', () => {
    const wrapper = mountSection(DataDisplaySection);
    expect(wrapper.find('.section-data-display').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('自定义色');
    expect(text).toContain('运行中');
    expect(text).toContain('列表为空，请先创建');
  });
});
```

- [ ] **Step 2: 实现 `DataDisplay.section.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TmTable, TmTag, TmEmpty, TmBadge, TmMessage } from '@tm/ui';
import type { TmTableProps } from '@tm/ui';

defineOptions({ name: 'DataDisplaySection' });

// 本地静态数据：TmTable 静态模式（:data + :columns）+ 本地切片分页
const rows = ref<TmTableProps['data']>([
  { id: 1, name: 'Tom', age: 28, status: 'success' },
  { id: 2, name: 'Jack', age: 34, status: 'processing' },
  { id: 3, name: 'Lucy', age: 22, status: 'warning' },
  { id: 4, name: 'Lily', age: 31, status: 'failed' },
  { id: 5, name: 'Bob', age: 25, status: 'success' },
  { id: 6, name: 'Amy', age: 29, status: 'processing' },
]);

const columns = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
  { field: 'status', title: '状态', width: 120, slots: { default: 'status_default' } },
];

const pagerConfig = { pageSize: 5, pageSizes: [5, 10] };

function onRowClick(record: Record<string, unknown>) {
  TmMessage.info(`点击了行：${record.name}`);
}
</script>

<template>
  <a-card class="section-data-display" title="③ 数据展示 DataDisplay">
    <p class="mb-4 text-sm text-secondary">
      TmTable（vxe 底座，本地切片分页 + 行点击）；Tag / Empty / Badge 状态展示。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <TmTable :data="rows" :columns="columns" :pager-config="pagerConfig" @row-click="onRowClick">
        <template #status_default="{ row }">
          <TmTag :status="row.status">{{ row.status }}</TmTag>
        </template>
      </TmTable>

      <a-space wrap>
        <TmTag status="success">成功</TmTag>
        <TmTag status="processing">进行中</TmTag>
        <TmTag status="failed">失败</TmTag>
        <TmTag status="warning">警告</TmTag>
        <TmTag color="purple">自定义色</TmTag>
      </a-space>

      <a-space :size="24">
        <TmBadge :count="5"><span>通知</span></TmBadge>
        <TmBadge :count="150" :overflow-count="99"><span>邮件</span></TmBadge>
        <TmBadge status="processing"><span>运行中</span></TmBadge>
      </a-space>

      <TmEmpty description="列表为空，请先创建" />
    </a-space>
  </a-card>
</template>
```

- [ ] **Step 3: 挂到容器 `Components.view.vue`**（import + 模板追加 `<DataDisplaySection />`，同上两处改法）

- [ ] **Step 4: 运行测试（GREEN）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components/features/components/DataDisplay.section.spec.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add apps/demo/src/pages/tm-components
git commit -m "feat(demo): tm-components 数据展示区（TmTable 分页+行点击、Tag/Empty/Badge）"
```

---

### Task 5: 反馈 Feedback section（Message / Modal / Drawer / Notification）

**Files:**
- Create: `apps/demo/src/pages/tm-components/features/components/Feedback.section.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/Feedback.section.spec.ts`
- Modify: `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue`

**Interfaces:**
- Consumes: `mountSection`（Task 2）。
- Produces: `FeedbackSection`（默认导出，根元素 `class="section-feedback"`）。

- [ ] **Step 1: 写失败的 section 测试（RED）`Feedback.section.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import FeedbackSection from './Feedback.section.vue';

describe('FeedbackSection', () => {
  it('渲染 section 容器与全部触发按钮', () => {
    const wrapper = mountSection(FeedbackSection);
    expect(wrapper.find('.section-feedback').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('打开弹窗');
    expect(text).toContain('打开抽屉');
    expect(text).toContain('TmNotification');
  });
});
```

- [ ] **Step 2: 实现 `Feedback.section.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TmButton, TmMessage, TmModal, TmDrawer, TmNotification } from '@tm/ui';

defineOptions({ name: 'FeedbackSection' });

const modalOpen = ref(false);
const drawerOpen = ref(false);

// 无 TmApp 包裹时 TmMessage/TmNotification 自动降级 ant 全局实例，功能可用
function notify(type: 'success' | 'info' | 'warning' | 'error') {
  if (type === 'success') {
    TmNotification.success({ message: '任务完成', description: '导出已就绪，可查看结果' });
  }
  if (type === 'info') {
    TmNotification.info({ message: '系统升级', description: '今晚 02:00-04:00' });
  }
  if (type === 'warning') {
    TmNotification.warning({ message: '磁盘不足', description: '已使用 90%' });
  }
  if (type === 'error') {
    TmNotification.error({ message: '任务失败', description: '请重试' });
  }
}

function showLoading() {
  const close = TmMessage.loading('加载中...');
  setTimeout(close, 2000);
}
</script>

<template>
  <a-card class="section-feedback" title="④ 反馈 Feedback">
    <p class="mb-4 text-sm text-secondary">
      TmMessage / TmNotification 命令式调用；TmModal / TmDrawer 组件式 v-model 开关。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <div class="flex flex-col gap-2">
        <span class="text-sm text-secondary">TmMessage</span>
        <a-space wrap>
          <TmButton type="primary" @click="TmMessage.success('保存成功')">成功</TmButton>
          <TmButton @click="TmMessage.info('这是一条信息提示')">信息</TmButton>
          <TmButton @click="TmMessage.warning('磁盘空间不足')">警告</TmButton>
          <TmButton danger @click="TmMessage.error('操作失败，请重试')">错误</TmButton>
          <TmButton @click="showLoading">加载</TmButton>
        </a-space>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-sm text-secondary">TmModal / TmDrawer</span>
        <a-space wrap>
          <TmButton type="primary" @click="modalOpen = true">打开弹窗</TmButton>
          <TmButton @click="drawerOpen = true">打开抽屉</TmButton>
        </a-space>
      </div>

      <div class="flex flex-col gap-2">
        <span class="text-sm text-secondary">TmNotification</span>
        <a-space wrap>
          <TmButton type="primary" @click="notify('success')">成功</TmButton>
          <TmButton @click="notify('info')">信息</TmButton>
          <TmButton @click="notify('warning')">警告</TmButton>
          <TmButton danger @click="notify('error')">错误</TmButton>
        </a-space>
      </div>

      <TmModal v-model="modalOpen" title="基础弹窗" @ok="modalOpen = false" @cancel="modalOpen = false">
        <p>弹窗内容，支持任意插槽与 ant Modal 全部 props / events。</p>
      </TmModal>
      <TmDrawer v-model="drawerOpen" title="基础抽屉" placement="right" :width="400">
        <p>抽屉内容，支持任意插槽与 ant Drawer 全部 props / events。</p>
      </TmDrawer>
    </a-space>
  </a-card>
</template>
```

- [ ] **Step 3: 挂到容器 `Components.view.vue`**（import + 模板追加 `<FeedbackSection />`）

- [ ] **Step 4: 运行测试（GREEN）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components/features/components/Feedback.section.spec.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add apps/demo/src/pages/tm-components
git commit -m "feat(demo): tm-components 反馈区（Message/Modal/Drawer/Notification 触发演示）"
```

---

### Task 6: 全局配置 Config section（ConfigProvider / App）

**Files:**
- Create: `apps/demo/src/pages/tm-components/features/components/Config.section.vue`
- Create: `apps/demo/src/pages/tm-components/features/components/Config.section.spec.ts`
- Modify: `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue`

**Interfaces:**
- Consumes: `mountSection`（Task 2）。
- Produces: `ConfigSection`（默认导出，根元素 `class="section-config"`）。

- [ ] **Step 1: 写失败的 section 测试（RED）`Config.section.spec.ts`**

```ts
import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import ConfigSection from './Config.section.vue';

describe('ConfigSection', () => {
  it('渲染 section 容器与主题切换 / 桥接表格 / TmApp', () => {
    const wrapper = mountSection(ConfigSection);
    expect(wrapper.find('.section-config').exists()).toBe(true);
    const text = wrapper.text().replace(/\s+/g, '');
    expect(text).toContain('切换暗色');
    expect(text).toContain('在TmApp内触发消息');
  });
});
```

- [ ] **Step 2: 实现 `Config.section.vue`**

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { TmConfigProvider, TmTable, TmButton, TmApp, TmMessage } from '@tm/ui';
import type { TmTableProps } from '@tm/ui';

defineOptions({ name: 'ConfigSection' });

const themeMode = ref<'light' | 'dark'>('light');

// 桥接表格：验证 ant token → vxe CSS 变量联动
const bridgeRows = ref<TmTableProps['data']>([
  { name: '主色 primary', value: '由 ant colorPrimary 桥接' },
  { name: '边框 border', value: '由 ant colorBorder 桥接' },
  { name: '表头 header', value: '由 ant colorFillAlter 桥接' },
  { name: 'hover 行', value: '由 ant controlItemBgHover 桥接' },
]);
const bridgeColumns = [
  { field: 'name', title: '项目' },
  { field: 'value', title: '取值' },
];
</script>

<template>
  <a-card class="section-config" title="⑤ 全局配置 Config">
    <p class="mb-4 text-sm text-secondary">
      TmConfigProvider 驱动 ant token → vxe CSS 变量桥接；TmApp 为命令式组件提供 holder 上下文。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <TmConfigProvider :theme-mode="themeMode">
        <div class="mb-3 flex items-center gap-3">
          <TmButton @click="themeMode = themeMode === 'light' ? 'dark' : 'light'">
            切换{{ themeMode === 'light' ? '暗色' : '亮色' }}
          </TmButton>
          <TmButton type="primary">主按钮（随 theme-mode 联动）</TmButton>
        </div>
        <TmTable :data="bridgeRows" :columns="bridgeColumns" />
      </TmConfigProvider>

      <a-divider />

      <TmApp>
        <TmButton type="primary" @click="TmMessage.success('TmApp holder 内的全局消息')">
          在 TmApp 内触发消息
        </TmButton>
      </TmApp>
    </a-space>
  </a-card>
</template>
```

- [ ] **Step 3: 挂到容器 `Components.view.vue`**（import + 模板追加 `<ConfigSection />`）

- [ ] **Step 4: 运行测试（GREEN）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components/features/components/Config.section.spec.ts`
Expected: PASS。

- [ ] **Step 5: 提交**

```bash
git add apps/demo/src/pages/tm-components
git commit -m "feat(demo): tm-components 全局配置区（ConfigProvider 主题桥接 + TmApp holder）"
```

---

### Task 7: 收尾——最终 view 冒烟 + 全量验证

**Files:**
- Modify: `apps/demo/src/pages/tm-components/features/components/views/Components.view.spec.ts`

**Interfaces:**
- Consumes: 全部 5 个 section + `mountSection`。
- Produces: 满足设计规格「5 个 section 均渲染」的最终冒烟断言。

- [ ] **Step 1: 升级 view 冒烟测试为全 section 断言**

将 `views/Components.view.spec.ts` 替换为：

```ts
import { describe, it, expect } from 'vitest';
import { mountSection } from '../test-utils';
import ComponentsView from './Components.view.vue';

describe('ComponentsView', () => {
  it('渲染页头与全部 5 个分类 section', () => {
    const wrapper = mountSection(ComponentsView);
    expect(wrapper.find('.tm-components-page').exists()).toBe(true);
    for (const cls of [
      'section-general',
      'section-form',
      'section-data-display',
      'section-feedback',
      'section-config',
    ]) {
      expect(wrapper.find(`.${cls}`).exists(), `应渲染 ${cls}`).toBe(true);
    }
  });
});
```

- [ ] **Step 2: 运行 tm-components 全部测试（预期全绿）**

Run: `cd apps/demo && npx vitest run src/pages/tm-components`
Expected: 全部 PASS（6 个 spec：view + 5 sections）。

- [ ] **Step 3: 跑全量 demo 测试，确认无回归**

Run: `cd apps/demo && npx vitest run`
Expected: 除既有历史失败 `router.spec.ts:66`（「无菜单→/403」，与本次无关，属 dev-auth-bypass 干扰）外全部通过。

- [ ] **Step 4: 提交**

```bash
git add apps/demo/src/pages/tm-components
git commit -m "test(demo): tm-components 陈列页最终冒烟（5 section 全渲染）"
```

- [ ] **Step 5: 浏览器实测交互（run skill）**

启动 dev server 后用浏览器验证设计成功标准：菜单「TM 组件」进入 `/tm-components`；表单 v-model 回显、Table 分页/行点击消息、Modal/Drawer 开关、Message/Notification 弹出；顶栏切暗色后整页联动。若 `packages/ui` 的 `es/` 产物与源码不一致导致组件异常，先跑 `pnpm --filter @tm/ui build` 重建后重试。

---

## 自审记录

- **规格覆盖**：5 个 section 对设计第 5 节分区表逐项对应；3 处接入（router/menu/auth）在 Task 1；dev-only、显式导入、语义色、不新增依赖均在 Global Constraints 落地；测试（含既有 router.spec 历史失败说明）在 Task 7。
- **占位符扫描**：无 TBD/TODO；所有代码步骤含完整可编译内容。
- **类型一致性**：`mountSection` 签名在 Task 2 定义、Task 3-7 复用一致；section 根 class（`section-general/form/data-display/feedback/config`）在实现与最终 view 断言中一致；`TmTableProps['data']` 类型统一。
- **已修正的偏差**：use-tm-ui 技能 catalog 声称 TmTable 用 `dataSource`、TmForm 支持 schema——实际 0.1.0 用 `:data` 且无 schema，计划已按源码为准（见 API 速查）。
