# @kibus/tm-ui-plus

公司内部基于 **ant-design-vue + vxe-table** 二次封装的 Vue 3 组件库，采用「薄封装」策略：尽可能透传 ant / vxe 原生能力，仅在公司层叠加默认视觉规范与业务扩展键，避免重复造轮子、保持与 ant 生态零摩擦。

> 已发布至 npm：`@kibus/tm-ui-plus@0.1.1`（public）

---

## 特性

- **薄封装**：组件 props / slots / 方法 与 ant、vxe 原生对齐，升级 ant 版本无需改业务代码
- **公司默认值**：`type`、`size`、`allowClear`、`border` 等视觉键有统一默认，业务可逐个覆盖
- **业务扩展键**：`debounce` 防抖、`remote` 远程搜索、`confirm` 二次确认、`submitting` 提交 loading、`isDirty` 脏追踪
- **主题同源**：`TmConfigProvider` 以 ant design token 为单一真相源，映射为 `--vxe-ui-*` CSS 变量，ant 与 vxe-table **视觉同源**、暗色联动
- **按需引入**：内置 `TmResolver`，配合 `unplugin-vue-components` 零配置自动导入
- **全量注册**：`app.use(TmUI)` 一次注册全部 60+ 组件

---

## 环境要求（peerDependencies）

组件库自身不打包这些依赖，**业务侧必须自行安装**：

| 依赖 | 版本要求 | 用途 |
| --- | --- | --- |
| `vue` | ^3.5.0 | 框架 |
| `ant-design-vue` | ^4.2.6 | 基础组件底座 |
| `@ant-design/icons-vue` | ^7.0.0 | 图标 |
| `vxe-table` | 4.20.7 | 表格主体（TmTable） |
| `vxe-pc-ui` | 4.16.21 | vxe 界面组件（分页、输入等） |
| `@vxe-ui/core` | 4.4.18 | vxe 核心 |

---

## 安装

```bash
pnpm add @kibus/tm-ui-plus vue ant-design-vue @ant-design/icons-vue vxe-table vxe-pc-ui @vxe-ui/core
```

---

## 快速开始（全量注册）

在入口文件注册：**先注册 vxe，再注册组件库**（vxe 是独立依赖，需业务侧手动 `app.use`）。

```ts
// main.ts
import { createApp } from 'vue'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'
import App from './App.vue'
import TmUI from '@kibus/tm-ui-plus'

const app = createApp(App)

// 业务需自行注册 vxe（组件库不代为注入）
app.use(VxeTable)
app.use(VxeUI)
// 全量注册全部 Tm 组件
app.use(TmUI)

app.mount('#app')
```

> **样式说明**：组件库自身无样式产物（`@kibus/tm-ui-plus/style.css` 不存在）。
> ant 组件样式由 CSS-in-JS 自动注入；vxe 样式需按上面引入预编译 CSS。
> `main` / `module` / `types` 均指向构建产物 `dist/`。

---

## 按需导入

### 直接 import（推荐，tree-shaking 友好）

```ts
import { TmButton, TmInput, TmSelect } from '@kibus/tm-ui-plus'
import type { TmTableProps, FormInstance } from '@kibus/tm-ui-plus'
```

### 自动导入（unplugin-vue-components + TmResolver）

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import Components from 'unplugin-vue-components/vite'
import { TmResolver } from '@kibus/tm-ui-plus'

export default defineConfig({
  plugins: [
    Components({
      resolvers: [TmResolver()],
      // 生成自动导入的类型声明
      dts: 'src/auto-components.d.ts',
    }),
  ],
})
```

之后模板中直接写 `<TmButton>` 即可，无需 import。`TmResolver` 仅识别 `Tm` 前缀组件，`a-button` 等原生 / 其它库组件不受影响。

### 子入口

`TmTable` 体积较大（vxe 底座），提供独立子入口隔离 chunk：

```ts
import { TmTable } from '@kibus/tm-ui-plus/table'
```

---

## 组件清单

所有组件以 `Tm` 前缀命名，命名空间对应 ant 分类：

| 分类 | 组件 |
| --- | --- |
| 通用 | `TmButton` `TmInput` `TmInputNumber` `TmSelect` `TmAutoComplete` `TmCheckbox` `TmCheckboxGroup` `TmRadio` `TmRadioGroup` `TmSwitch` `TmRate` `TmSlider` `TmMentions` `TmTransfer` `TmTree` `TmCascader` `TmTreeSelect` `TmDatePicker` `TmRangePicker` `TmTimePicker` `TmUpload` |
| 表单 | `TmForm` `TmFormItem` |
| 布局 | `TmSpace` `TmDivider` `TmFlex` `TmRow` `TmCol` `TmLayout` `TmSider` `TmHeader` `TmContent` `TmFooter` |
| 导航 | `TmBreadcrumb` `TmDropdown` `TmMenu` `TmPagination` `TmSteps` `TmTabs` `TmAffix` `TmAnchor` `TmPageHeader` |
| 数据展示 | `TmTable` `TmTag` `TmEmpty` `TmBadge` `TmAvatar` `TmCalendar` `TmCarousel` `TmCollapse` `TmComment` `TmDescriptions` `TmImage` `TmList` `TmQRCode` `TmSegmented` `TmStatistic` `TmTimeline` `TmTooltip` `TmCard` |
| 反馈 | `TmAlert` `TmModal` `TmDrawer` `TmPopconfirm` `TmPopover` `TmResult` `TmSpin` `TmProgress` `TmSkeleton` `TmTour` `TmFloatButton` |
| 全局 / 其它 | `TmConfigProvider` `TmApp` `TmMessage` `TmNotification` `TmTypography` `TmWatermark` |

各组件均透传 ant / vxe 原生 props、slots、方法（ref 直接调用内部实例方法），并叠加公司默认值：

| 组件 | 公司默认值（可覆盖） |
| --- | --- |
| `TmButton` | `type: 'primary'`、`debounce: 0` |
| `TmInput` | `allowClear: true`、`size: 'middle'`、`bordered: true` |
| `TmSelect` | `showSearch: true`、`allowClear: true`、`debounce: 300`、`minLength: 1` |
| `TmTable` | `border: true`、`stripe: true`、`showOverflow: true`、`fit: true`、分页 `pageSize: 10` |
| `TmForm` | `layout: 'horizontal'`、`hideRequiredMark: false` |
| `TmConfigProvider` | `locale: zh_CN` |

---

## 全局配置与主题

### TmConfigProvider

以 ant design token 为单一真相源，把 ant 主题映射为 vxe CSS 变量，实现 ant 组件与 vxe-table **视觉同源**；同时下发 ant `locale`（默认中文）。

```vue
<template>
  <TmConfigProvider :theme-mode="isDark ? 'dark' : 'light'">
    <router-view />
  </TmConfigProvider>
</template>
```

| Prop | 类型 | 默认 | 说明 |
| --- | --- | --- | --- |
| `themeMode` | `'light' \| 'dark'` | `light` | 明暗主题（内部切换 ant algorithm） |
| `locale` | `Locale` | `zh_CN` | ant 组件语言包 |

### TmApp

业务根组件用 `<TmApp>` 包裹后，全局命令式 API（`TmMessage` / `TmNotification`）自动绑定 `TmConfigProvider` 上下文（主题 / locale 跟随）。

```vue
<TmConfigProvider>
  <TmApp>
    <App />
  </TmApp>
</TmConfigProvider>
```

---

## 函数式 API

`TmMessage` / `TmNotification` 为命令式 API，任意位置（组件内外）可调用；配合 `TmApp` 包裹后主题 / locale 自动跟随：

```ts
import { TmMessage, TmNotification } from '@kibus/tm-ui-plus'

// 轻提示
TmMessage.success('保存成功')
TmMessage.error('操作失败')
TmMessage.loading('加载中…')

// 通知卡片
TmNotification.info({ message: '新消息', description: '你有 3 条未读' })
TmNotification.warning({ message: '磁盘不足', description: '请及时清理' })
```

---

## 表单联动（TmForm / TmFormItem）

`TmForm` 经 `provide/inject` 下发 `submitting` / `readonly` / `disabled`，`TmFormItem` 通过 default slot props 暴露给子控件（第三方控件也可消费）；`TmInput` / `TmSelect` 直接 inject 自动级联（业务显式传同名 prop 优先）。

内置 **脏追踪**：挂载时自动快照 model，提供 `isDirty()` / `getDirtyFields()` / `resetToInitial()` / `markInitial()`。

```vue
<script setup lang="ts">
import { reactive, ref } from 'vue'
import { TmForm, TmFormItem, TmInput, TmSelect, TmButton, TmMessage, type FormInstance } from '@kibus/tm-ui-plus'

const formState = reactive({ username: '', dept: '' })
const formRef = ref<FormInstance>()
const submitting = ref(false)

async function onSubmit() {
  try {
    await formRef.value?.validate()
  } catch {
    TmMessage.warning('表单校验未通过')
    return
  }
  submitting.value = true
  // ... 提交
  formRef.value?.markInitial?.()
}
</script>

<template>
  <TmForm ref="formRef" :model="formState" :submitting="submitting" layout="horizontal">
    <TmFormItem label="用户名" name="username" :rules="[{ required: true, message: '请输入用户名' }]">
      <TmInput v-model="formState.username" />
    </TmFormItem>
    <TmFormItem label="部门" name="dept">
      <TmSelect v-model="formState.dept" :options="[{ label: '前端', value: 'fe' }]" />
    </TmFormItem>
    <TmFormItem v-if="formRef?.isDirty?.()">
      已修改：{{ formRef?.getDirtyFields?.().join('、') }}
    </TmFormItem>
    <TmButton type="primary" :loading="submitting" @click="onSubmit">提交</TmButton>
  </TmForm>
</template>
```

---

## 表格（TmTable）

基于 vxe-grid，叠加 ant 分页器、声明式搜索表单、密度档位等。

### 静态数据（本地切片分页）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable, type TmTableProps } from '@kibus/tm-ui-plus'

const rows = ref<TmTableProps['data']>([
  { id: 1, name: 'Tom', age: 28 },
  { id: 2, name: 'Jack', age: 34 },
])
const columns: TmTableProps['columns'] = [
  { field: 'id', title: 'ID', width: 80 },
  { field: 'name', title: '姓名' },
  { field: 'age', title: '年龄', width: 100 },
]
</script>

<template>
  <TmTable :data="rows" :columns="columns" :pager-config="{ pageSize: 10, pageSizes: [10, 20, 50] }" />
</template>
```

### 远程数据（request + search + density）

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { TmTable, TmButton, type TmTableProps, type TmTableResult } from '@kibus/tm-ui-plus'

const density = ref<'compact' | 'default' | 'loose'>('default')

async function fetchRemote(
  params: Parameters<NonNullable<TmTableProps['request']>>[0],
): Promise<TmTableResult<Record<string, unknown>>> {
  // params: { currentPage, pageSize, query }
  const res = await fetch(`/api/users?page=${params.currentPage}&pageSize=${params.pageSize}`).then((r) => r.json())
  return { data: res.list, total: res.total }
}
</script>

<template>
  <TmTable
    :request="fetchRemote"
    :columns="columns"
    :search="{ fields: [{ field: 'name', label: '姓名' }] }"
    :density="density"
  />
  <TmButton size="small" @click="density = 'compact'">紧凑</TmButton>
  <TmButton size="small" @click="density = 'default'">默认</TmButton>
</template>
```

---

## 类型系统

组件与类型统一导出，`import type` 即可获得 ant / vxe 完整类型 + 公司扩展类型：

```ts
import type {
  TmButtonProps,      // 公司扩展 props（含 ant 原生）
  TmTableProps,       // vxe 列 / 数据 / 请求类型
  TmTableResult,      // 远程分页返回结构
  FormInstance,       // 表单实例（validate / resetFields / isDirty）
  InputProps,         // ant 原生类型透传
  SelectProps,
} from '@kibus/tm-ui-plus'
```

---

## 本地开发

```bash
pnpm install                 # 安装依赖
pnpm --filter @kibus/tm-ui-plus test    # 运行单测（Vitest + jsdom）
pnpm --filter @kibus/tm-ui-plus build   # 构建（dist/：ESM .js + CJS .cjs + .d.ts）
```

Monorepo 详情、OpenSpec 开发流程见仓库根目录 `README.md`。

---

## 版本与发布

- 当前版本：`0.1.1`，已发布至 npm（public），可直接 `pnpm add @kibus/tm-ui-plus`
- 发布命令（需 bypass 2FA 的 npm token）：

```bash
pnpm --filter @kibus/tm-ui-plus publish
```

> 发布前确认 `packages/ui/package.json` 的 `repository` 已替换为公司真实仓库地址。

---

## License

内部组件库，未对外开源。
