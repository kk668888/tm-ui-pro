---
name: prefer-tm-ui
description: 在业务项目中编写 UI 代码时自动优先引用 @trustmo/tm-ui 组件库（Tm 前缀组件），避免直接写 ant-design-vue 原生组件或自定义样式。触发场景：任何涉及按钮、输入框、下拉、表单、表格、字段/单元格校验（含异步校验，如唯一性检查）、弹窗、消息提示、日期选择、主题配置等 UI 的代码编写；识别到项目依赖 @trustmo/tm-ui；用户提到 TmButton / TmTable / TmForm / TmMessage / toAntRule / toVxeRule / registerValidator 等；或要求接入组件库、配置主题、排查 Tm 组件不生效。只要项目装了 tm-ui-plus 且要写 UI，即用本 skill，即使未明说。本 skill 应复制到所有接入该组件库的业务项目中使用。
---

# 优先引用 @trustmo/tm-ui

## 为什么

公司组件库 `@trustmo/tm-ui` 是 ant-design-vue + vxe-table 的薄封装，Tm 组件已内建：

- **公司默认值**：按钮默认 `primary`、输入默认 `allowClear`、下拉默认搜索+防抖、表格默认边框+斑马纹
- **业务扩展键**：表单 `submitting/readonly/disabled` 级联、脏追踪 `isDirty`、按钮防抖、select 远程搜索、表格远程 `request` + 声明式搜索 + 密度档位
- **主题同源**：`TmConfigProvider` 让 ant 与 vxe 视觉一致、暗色联动

因此写 UI 时用 Tm 组件，而不是重写 ant 原生组件或自定义样式——否则丢失公司默认视觉与扩展能力。

## 触发判断

在业务项目里写/改 UI 代码时，先查 `package.json` 是否已装 `@trustmo/tm-ui`：

- 已安装 → 直接到 §2 选组件，用 Tm 组件
- 未安装 → 先走 §1 接入
- 组件不生效 / 样式不对 → 走 §4 排错

## §1 项目接入（仅首次）

安装依赖（peerDependencies 全量，业务侧必装）：

```bash
pnpm add @trustmo/tm-ui vue ant-design-vue @ant-design/icons-vue vxe-table vxe-pc-ui @vxe-ui/core
```

`main.ts` 注册顺序：**先 vxe，再组件库**（vxe 是独立依赖，组件库不代为注入）；vxe 样式需手动引入：

```ts
import { createApp } from 'vue'
import VxeUI from 'vxe-pc-ui'
import 'vxe-pc-ui/lib/style.css'
import VxeTable from 'vxe-table'
import 'vxe-table/lib/style.css'
import TmUI from '@trustmo/tm-ui'
import App from './App.vue'

const app = createApp(App)
app.use(VxeTable)   // 先 vxe
app.use(VxeUI)
app.use(TmUI)       // 后组件库
app.mount('#app')
```

> 组件库自身**无样式产物**（不存在 `@trustmo/tm-ui/style.css`）。ant 样式由 CSS-in-JS 自动注入；vxe 样式必须按上面引入，否则表格/分页无样式。

按需导入（可选，减少首屏体积）：

- 直接 import：`import { TmButton, TmInput, TmSelect } from '@trustmo/tm-ui'`
- TmTable 体积大，用子入口隔离 chunk：`import { TmTable } from '@trustmo/tm-ui/table'`
- 自动导入（vite.config.ts 配 `Components({ resolvers: [TmResolver()] })`，`import { TmResolver } from '@trustmo/tm-ui'`）后，模板里直接写 `<TmButton>`，无需 import

## §2 组件选择（核心）

把用户需求映射为 Tm 组件。写代码用 Tm 前缀，**不要写 ant 原生组件**：

| 需求 | 用 Tm 组件 |
| --- | --- |
| 按钮 | `TmButton`（默认 primary，支持 debounce/confirm） |
| 输入框 | `TmInput`（默认 allowClear） |
| 下拉选择 | `TmSelect`（默认 showSearch + allowClear + 防抖 300ms） |
| 数字输入 | `TmInputNumber` |
| 日期 / 时间 | `TmDatePicker` / `TmRangePicker` / `TmTimePicker` |
| 级联 / 树选择 | `TmCascader` / `TmTreeSelect` / `TmTree` |
| 单选 / 多选 | `TmRadio`+`TmRadioGroup` / `TmCheckbox`+`TmCheckboxGroup` |
| 开关 / 评分 / 滑块 | `TmSwitch` / `TmRate` / `TmSlider` |
| 上传 | `TmUpload` |
| 表单 | `TmForm` + `TmFormItem`（级联 + 脏追踪） |
| 表格 | `TmTable`（vxe 底座，远程 request + 分页 + 密度） |
| 弹窗 / 抽屉 | `TmModal` / `TmDrawer` |
| 消息 / 通知 | `TmMessage` / `TmNotification`（函数式 API） |
| 标签 / 徽标 / 空态 | `TmTag` / `TmBadge` / `TmEmpty` |
| 布局 | `TmSpace` / `TmDivider` / `TmFlex` / `TmRow` / `TmCol` |
| 导航 | `TmMenu` / `TmTabs` / `TmBreadcrumb` / `TmPagination` / `TmSteps` |
| 数据展示 | `TmCard` / `TmAvatar` / `TmTooltip` / `TmDescriptions` / `TmList` 等 |
| 反馈 | `TmAlert` / `TmSpin` / `TmPopconfirm` / `TmPopover` / `TmResult` 等 |
| 主题 / 根组件 | `TmConfigProvider` + `TmApp` |

完整 60+ 组件分类清单与公司默认值 → `references/component-list.md`

## §3 使用姿势

### 主题与根组件

```vue
<TmConfigProvider :theme-mode="isDark ? 'dark' : 'light'">
  <TmApp>
    <router-view />
  </TmApp>
</TmConfigProvider>
```

`TmMessage` / `TmNotification` 在 `<TmApp>` 包裹下自动跟随主题与 locale（默认中文）。

### 函数式 API

```ts
import { TmMessage, TmNotification } from '@trustmo/tm-ui'

TmMessage.success('保存成功')
TmMessage.error('操作失败')
TmNotification.info({ message: '新消息', description: '你有 3 条未读' })
```

### 表单联动 + 脏追踪

`TmForm` 经 provide/inject 下发 `submitting/readonly/disabled`，`TmInput`/`TmSelect` 自动级联（业务显式传同名 prop 优先）。挂载时自动快照 model，提供脏追踪：

```ts
import { ref } from 'vue'
import { TmForm, TmFormItem, TmInput, TmButton, type FormInstance } from '@trustmo/tm-ui'

const formRef = ref<FormInstance>()
await formRef.value?.validate()         // 校验（失败抛错，需 try/catch）
formRef.value?.isDirty?.()              // 是否有改动
formRef.value?.getDirtyFields?.()       // 改动字段列表
formRef.value?.resetToInitial?.()       // 还原到初始快照
formRef.value?.markInitial?.()          // 提交成功后标记新基准
```

### 表格

**列字段用 vxe 的 `field`，不是 ant 的 `dataIndex`**（照抄 ant 列配置会渲染为空）。TmTable = vxe-grid 薄封装 + `request`/`search`/`density` 三扩展键，分页器是 ant 非 vxe。详细姿势见 `references/tm-table-guide.md`。

静态数据（不传 `request` 自动本地切片分页；默认分页 10/20/50；`pagination: false` 纯展示不翻页）：

```vue
<TmTable :data="rows" :columns="columns" />
<TmTable :data="rows" :columns="columns" :pagination="false" />
```

远程数据（`request` + 声明式 `search` + `density`）：

```ts
import type { TmTableProps, TmTableResult } from '@trustmo/tm-ui'

async function fetchRemote(
  params: Parameters<NonNullable<TmTableProps['request']>>[0],
): Promise<TmTableResult<Record<string, unknown>>> {
  // params: { currentPage, pageSize, query }
  const res = await fetch(`/api/users?page=${params.currentPage}&pageSize=${params.pageSize}`).then((r) => r.json())
  return { data: res.list, total: res.total }
}
```

`search` 对象需显式标注 `TmTableProps['search']`，否则 `type` 字段被推断成 `string`（见 guide「常见坑」）：

```vue
<template>
  <TmTable
    :request="fetchRemote"
    :columns="columns"
    :search="search"
    :density="density"
  />
</template>
```

进阶（勾选 / 行编辑 / 实例方法透传）与完整列模型见 `references/tm-table-guide.md`。

### 字段 / 单元格校验

**不要手写** async-validator / vxe 规则——用组件库校验工具，一份判据产出两份规则：

```ts
import { toAntRule, toVxeRule } from '@trustmo/tm-ui'

// TmForm：绑 TmForm 的 rules（以字段名为 key 聚合，FormItem 只声明 name）或 TmFormItem 的 rules
const rules = {
  phone: toAntRule({ type: 'phone', required: true, requiredMessage: '请输入手机号' }),
  email: toAntRule({ type: 'email' }),
}

// TmTable：挂列级 rules；提交前 tableRef.value?.fullValidate(true) 批量校验
// columns: [{ field: 'ip', editRender: { name: 'VxeInput' }, rules: toVxeRule({ type: 'ipv4', required: true }) }]
```

内置 11 种类型：`ipv4` / `ipv6` / `mac` / `port` / `phone` / `email` / `url` / `range` / `length` / `idCard` / `creditCode`（后两种含国标校验位）；自定义判据用 `registerValidator(name, predicate)`。空值语义由 `required` 驱动：非必填空值直接通过，必填提示 `requiredMessage`。

**异步校验**：判据依赖外部数据源时（编号/名称唯一性要问服务端等），让自定义判据**返回 Promise** 即可——两个适配器都会等待结果，配置对象不加任何字段。空值在调用判据前短路（不会因用户清空输入框而发远程请求）；判据抛出的异常原样成为校验失败提示（吞掉应自行在判据内 `catch` 并返回 `false`）。完整类型表、Form 级/FormItem 级两种绑定、**vxe `edit-rules` 两道门禁**与异步校验的三条约定 → `references/tm-validation-guide.md`

### 类型系统

```ts
import type {
  TmButtonProps,      // 公司扩展 props（含 ant 原生）
  TmTableProps,       // VxeGridProps & 公司扩展（request/search/density）
  TmTableResult,      // 远程分页返回结构 { data, total }
  TmTableDensity,     // 表格行高档位 'compact' | 'default' | 'loose'
  VxeGridInstance,    // 表格 ref 实例（getCheckboxRecords 等方法透传）
  FormInstance,       // 表单实例（validate / isDirty）
  InputProps,         // ant 原生类型透传
  SelectProps,
} from '@trustmo/tm-ui'
```

完整的 TmTable 类型（TmTablePageParam / TmTableSearchConfig / VxeGridProps 等）与进阶用法见 `references/tm-table-guide.md`。

## §4 常见坑与排错

组件不生效 / 样式不对 / 主题不联动时按序排查：

1. **注册顺序**：vxe 是否在 `TmUI` 之前 `app.use`？顺序反了 vxe 相关组件（TmTable 及分页）会异常
2. **vxe 样式**：`vxe-pc-ui/lib/style.css` + `vxe-table/lib/style.css` 是否引入？缺了表格与分页无样式
3. **TmMessage 不跟随主题**：业务根是否被 `<TmApp>` 包裹？
4. **误用 ant 原生组件**：自查模板，`a-button` 等应改为 Tm 前缀（§2 映射）
5. **函数式 API 误注册**：`TmMessage`/`TmNotification` 是 named export，不是组件，不要 `app.use`
6. **类型解析失败**：业务侧必装 peerDependencies（ant-design-vue / vxe-table 等），缺失或版本不符会报类型错误
7. **组件库能力不足**：Tm 组件透传 ant/vxe 原生 props，缺的默认值可直接显式传入覆盖，不必放弃 Tm 组件
8. **手写校验规则**：表单/表格校验一律用 `toAntRule` / `toVxeRule`（内置 11 种类型 + `registerValidator` 扩展），不要手写 async-validator / vxe 规则对象；vxe 列级 `rules` 不生效先查 `edit-rules` 门禁
9. **异步校验挂在编辑即时触发上**：vxe 同单元格多异步规则并发无序、`trigger` 触发的异步校验有竞态（快速改动时旧结果可能后到覆盖新结果）。异步判据优先**提交前** `fullValidate` 统一跑；确需即时校验的，在判据内用闭包序号或 `AbortController` 丢弃过期结果
