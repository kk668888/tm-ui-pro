# tm-ui 组件陈列页设计规格（Design Spec）

- **日期**：2026-08-11
- **项目**：`tm-ui-new` 的 `apps/demo`
- **状态**：已获批准（Approved）
- **产物范围**：demo 内新增一个 dev-only 的 tm-ui 组件陈列页 `/tm-components`，卡片分区展示全部 tm-ui 组件（21 个组件 + 命令式 Message/Notification），核心组件带交互示例

---

## 1. 背景与目标

demo 应用已正确安装、注册 `@tm/ui`（theme-preview 页仅做了 Button/Input/Select/Tag 的冒烟验证），但缺少一个**完整、可交互的组件陈列页**，无法直观验证组件库全貌、交互行为与主题联动。

**目标**：按 demo 既有页面规范新建「TM 组件」陈列页，集中呈现全部 21 个组件；核心组件带真实 v-model 与联动，其余静态渲染，作为组件库的「实战陈列」与回归观测面。

**成功标准**：

1. 侧边栏 dev 菜单出现「TM 组件」，点击进入 `/tm-components`，五个分类卡片完整渲染无报错；
2. 表单类组件（Input/Select/RadioGroup/CheckboxGroup/Switch/InputNumber/DatePicker/Cascader/TreeSelect/TmForm）v-model 实时回显；
3. TmTable 展示 dataSource + 分页 + 排序 + 行点击；
4. Message/Modal/Drawer/Notification 触发可用，状态可关闭复位；
5. 亮色 / 暗色主题下组件与页面容器均正常适配；
6. 页面有挂载冒烟测试，且全量 demo 测试通过。

---

## 2. 现状与依据

| 维度 | 情况 |
| --- | --- |
| `@tm/ui` 版本 | 0.1.0，共 21 个组件（`packages/ui/src/components` 19 个目录，Message/Notification 为命令式 API） |
| 组件清单 | Button / Input / Select / Form+FormItem / Table / ConfigProvider / RadioGroup / CheckboxGroup / Switch / InputNumber / DatePicker+RangePicker / Cascader / TreeSelect / Tag / Empty / Badge / App / Modal / Drawer + Message / Notification |
| demo 页面规范 | `pages/<域>/` + `<域>.routes.ts` + `pages/*.page.vue`（薄壳）+ `features/<特性>/views/*.view.vue`；展示页用 `components/*.section.vue` 分段 |
| 最佳范式 | `theme-preview`：dev-only 展示页、devOnlyMenus 菜单、meta.code 权限、语义色适配亮暗 |
| 菜单/权限 | `menu.config.ts` 单一真相源 → mock `auth.ts` admin 回吐 → 侧边栏；新页需加菜单项 + admin 权限码 |
| routeNames | vite route-names 插件扫描 `*.routes.ts` 自动生成 `ROUTE_NAMES`，无需手工维护 |
| tm 组件导入 | demo 未启用 TmResolver 自动导入，需显式 `import { TmXxx } from '@tm/ui'`（与 TmUiShowcase 一致） |
| 脚手架 | `scaffold:domain/feature` 仅生成 CRUD 业务域（list/overview），不适用展示页，本次手工按 theme-preview 范式创建 |

> 注：`use-tm-ui` 技能的 `component-catalog.md` 为泛化清单（~100 组件），与实际 `@tm/ui` 0.1.0 不符，设计以 `packages/ui` 实际组件为准。

---

## 3. 核心决策

| # | 维度 | 决策 |
| --- | --- | --- |
| 1 | 页面定位 | **组件陈列页**（非文档式、非按组件拆子页） |
| 2 | 结构方案 | **方案 A**：单域 `tm-components` + 单展示页，分类 section 卡片，仿 theme-preview |
| 3 | 环境归属 | dev-only（`import.meta.env.DEV` 分支注册路由 + devOnlyMenus），生产不打包不暴露 |
| 4 | 交互深度 | **核心交互 + 其余静态**：表单类/Table/反馈组件带状态与联动，Tag/Empty/Badge/ConfigProvider/App 静态 |
| 5 | 数据流 | 纯本地静态 demo 数据（section 内 ref/常量），不调 API、不建 store |

---

## 4. 页面结构

```
apps/demo/src/pages/tm-components/
├── tm-components.routes.ts            # /tm-components, name=TmComponents, meta:{code,title}
├── pages/TmComponents.page.vue        # 薄壳（defineOptions name，渲染 view）
└── features/components/
    ├── views/Components.view.vue      # 容器：页头说明 + 5 个分类 section，语义色适配亮暗
    └── components/
        ├── General.section.vue        # 通用
        ├── Form.section.vue           # 表单（交互主力）
        ├── DataDisplay.section.vue    # 数据展示
        ├── Feedback.section.vue       # 反馈
        └── Config.section.vue         # 全局配置
```

### 接入点（3 处注册）

1. `apps/demo/src/core/bootstrap/router.ts`：DEV 分支追加 `...tmComponentsRoutes`（与 theme-preview/readme 同款条件展开）；
2. `apps/demo/src/modules/app/config/menu.config.ts`：`devOnlyMenus` 追加 `{ label: 'TM 组件', code: 'TmComponents', routeName: 'TmComponents' }`；
3. `apps/demo/src/mock/handlers/auth.ts`：admin 角色 `permissions` 追加 `'TmComponents'`（供路由守卫 meta.code 校验）。

`ROUTE_NAMES.TmComponents` 由 route-names 插件自动生成。

---

## 5. 组件分区与交互清单

| Section | 组件 | 交互 |
| --- | --- | --- |
| 通用 General | TmButton | type/danger/loading/disabled/size/icon/confirm 确认回调 |
| 表单 Form | TmInput、TmInputNumber、TmSelect、TmRadioGroup、TmCheckboxGroup、TmSwitch、TmDatePicker、TmRangePicker、TmCascader、TmTreeSelect、TmForm | **全部 v-model + 实时回显**；TmForm 做 schema 自动生成 + 必填/邮箱校验 + 提交回显 |
| 数据展示 DataDisplay | TmTable、TmTag、TmEmpty、TmBadge | Table：dataSource + 分页 + 排序 + 行点击；Tag/Empty/Badge 静态 |
| 反馈 Feedback | TmMessage、TmModal、TmDrawer、TmNotification | 全交互：触发按钮、open 状态、回调、防连点 |
| 全局配置 Config | TmConfigProvider、TmApp | 静态渲染 + 作用说明 |

---

## 6. 数据流 / 样式 / 测试

- **数据流**：纯本地静态数据；表格 mock 数据、级联/树选项、表单模型均为 section 内 `ref`/常量，不引入 API 层。
- **导入**：tm 组件显式 `import { TmXxx } from '@tm/ui'`；`a-card`/`a-space`/`a-tag` 等由 `AntDesignVueResolver` 自动解析（`Components` 插件仅配 Ant resolver，未配 TmResolver）。
- **样式**：复用语义变量（`--bg-container` / `--text-title` / `--text-secondary` / `--border-light`），每 section 一张 `<a-card>`；页面级间距沿用 theme-preview 的宽松节奏。
- **错误处理**：Table 空数据用 TmEmpty 兜底；Modal/Drawer 关闭复位状态；Message/Notification 触发按钮防重复连点；表单校验失败不提交。
- **测试**：新增 `Components.view.spec.ts` 挂载冒烟测试，断言 5 个 section 均渲染；跑全量 demo 测试（注意：既有 `router.spec.ts:66`「无菜单→/403」为历史失败，与本次无关，不作为通过项）。

---

## 7. 明确不做

- 不给 demo 加代码/API 面板（陈列页非文档式手册）；
- 不动 theme-preview 现有 `TmUiShowcase.section.vue`（保留其主题冒烟用途）；
- 不引入新依赖、不新增 mock API；
- 不启用 TmResolver 自动导入（保持与既有 TmUiShowcase 一致的显式导入约定）。

---

## 8. 文件级改动清单

| 操作 | 文件 |
| --- | --- |
| 新建 | `apps/demo/src/pages/tm-components/tm-components.routes.ts` |
| 新建 | `apps/demo/src/pages/tm-components/pages/TmComponents.page.vue` |
| 新建 | `apps/demo/src/pages/tm-components/features/components/views/Components.view.vue` |
| 新建 | `apps/demo/src/pages/tm-components/features/components/components/{General,Form,DataDisplay,Feedback,Config}.section.vue` |
| 新建 | `apps/demo/src/pages/tm-components/features/components/views/Components.view.spec.ts` |
| 修改 | `apps/demo/src/core/bootstrap/router.ts`（DEV 分支挂路由） |
| 修改 | `apps/demo/src/modules/app/config/menu.config.ts`（devOnlyMenus 加菜单项） |
| 修改 | `apps/demo/src/mock/handlers/auth.ts`（admin permissions 加 `TmComponents`） |
