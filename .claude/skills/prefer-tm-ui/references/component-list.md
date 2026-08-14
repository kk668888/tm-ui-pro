# @kibus/tm-ui-plus 组件速查

> 本文件是 `prefer-tm-ui` skill 的参考资料。写 UI 代码时若不确定该用哪个 Tm 组件，查本表。

## ant-design-vue → Tm 快速映射

需求出现时优先用右侧 Tm 组件，不要写 ant 原生组件：

| ant 原生（不要用） | 优先用 | 备注 |
| --- | --- | --- |
| `a-button` | `TmButton` | 默认 primary；支持 `debounce` / `confirm` |
| `a-input` | `TmInput` | 默认 allowClear、middle、bordered |
| `a-select` | `TmSelect` | 默认 showSearch + allowClear + 防抖 300ms；支持远程搜索 |
| `a-input-number` | `TmInputNumber` | |
| `a-date-picker` / `a-range-picker` / `a-time-picker` | `TmDatePicker` / `TmRangePicker` / `TmTimePicker` | |
| `a-cascader` / `a-tree-select` / `a-tree` | `TmCascader` / `TmTreeSelect` / `TmTree` | |
| `a-radio-group` / `a-checkbox-group` | `TmRadioGroup` / `TmCheckboxGroup` | |
| `a-form` / `a-form-item` | `TmForm` / `TmFormItem` | 提供 submitting/readonly/disabled 级联 + 脏追踪 |
| `a-table` | `TmTable` | vxe 底座；远程 `request` + 声明式 `search` + 密度档位 |
| `a-modal` / `a-drawer` | `TmModal` / `TmDrawer` | |
| `message.*` / `notification.*` | `TmMessage.*` / `TmNotification.*` | 函数式 API，需 `<TmApp>` 包裹跟随主题 |
| `a-tag` / `a-badge` / `a-empty` | `TmTag` / `TmBadge` / `TmEmpty` | |
| `a-space` / `a-divider` / `a-flex` | `TmSpace` / `TmDivider` / `TmFlex` | |
| `a-menu` / `a-tabs` / `a-breadcrumb` / `a-pagination` | `TmMenu` / `TmTabs` / `TmBreadcrumb` / `TmPagination` | |
| `a-config-provider` | `TmConfigProvider` | ant 与 vxe 主题同源 |

## 组件清单（按分类）

### 通用
`TmButton` `TmInput` `TmInputNumber` `TmSelect` `TmAutoComplete` `TmCheckbox` `TmCheckboxGroup` `TmRadio` `TmRadioGroup` `TmSwitch` `TmRate` `TmSlider` `TmMentions` `TmTransfer` `TmTree` `TmCascader` `TmTreeSelect` `TmDatePicker` `TmRangePicker` `TmTimePicker` `TmUpload`

### 表单
`TmForm` `TmFormItem`

### 布局
`TmSpace` `TmDivider` `TmFlex` `TmRow` `TmCol` `TmLayout` `TmSider` `TmHeader` `TmContent` `TmFooter`

### 导航
`TmBreadcrumb`（+ `TmBreadcrumbItem` `TmBreadcrumbSeparator`）`TmDropdown`（+ `TmDropdownButton`）`TmMenu`（+ `TmMenuItem` `TmSubMenu` `TmMenuItemGroup` `TmMenuDivider`）`TmPagination` `TmSteps`（+ `TmStep`）`TmTabs`（+ `TmTabPane`）`TmAffix` `TmAnchor`（+ `TmAnchorLink`）`TmPageHeader`

### 数据展示
`TmTable` `TmTag` `TmEmpty` `TmBadge` `TmAvatar` `TmCalendar` `TmCarousel` `TmCollapse` `TmComment` `TmDescriptions` `TmImage` `TmList` `TmQRCode` `TmSegmented` `TmStatistic` `TmTimeline` `TmTooltip` `TmCard`

### 反馈
`TmAlert` `TmModal` `TmDrawer` `TmPopconfirm` `TmPopover` `TmResult` `TmSpin` `TmProgress` `TmSkeleton` `TmTour` `TmFloatButton`

### 全局 / 其它
`TmConfigProvider` `TmApp` `TmMessage` `TmNotification` `TmTypography`（+ `TmTypographyTitle` `TmTypographyParagraph` `TmTypographyText` `TmTypographyLink`）`TmWatermark`

## 公司默认值（业务显式传同名 prop 可覆盖）

| 组件 | 默认值 |
| --- | --- |
| `TmButton` | `type: 'primary'`、`debounce: 0`（不防抖，保持 ant 原生点击语义） |
| `TmInput` | `allowClear: true`、`size: 'middle'`、`bordered: true` |
| `TmSelect` | `showSearch: true`、`allowClear: true`、`debounce: 300`、`minLength: 1` |
| `TmTable` | `border: true`、`stripe: true`、`showOverflow: true`、`fit: true`、分页 `pageSize: 10` |
| `TmForm` | `layout: 'horizontal'`、`hideRequiredMark: false` |
| `TmConfigProvider` | `locale: zh_CN` |

## 业务扩展键（ant 原生没有的能力）

| 组件 | 扩展键 | 说明 |
| --- | --- | --- |
| `TmButton` | `debounce` | 点击防抖（ms），>0 启用 |
| `TmButton` | `confirm` | 传入文案后点击前二次确认（Popconfirm 包裹） |
| `TmSelect` | `debounce` | 搜索防抖间隔（ms） |
| `TmSelect` | `remote` | 远程搜索能力 |
| `TmForm` | `submitting` / `readonly` / `disabled` | 经 provide/inject 级联下发到 TmFormItem 及子控件 |
| `TmForm` | `isDirty` / `getDirtyFields` / `resetToInitial` / `markInitial` | 表单脏追踪（挂载时快照 model） |
| `TmTable` | `request` | 远程数据函数，返回 `{ data, total }`；params 为 `{ currentPage, pageSize, query }` |
| `TmTable` | `search` | 声明式搜索表单，`{ fields: [{ field, label }] }` |
| `TmTable` | `density` | `'compact' \| 'default' \| 'loose'` 密度档位 |

## 关键入口

- 主入口：`import { TmButton, ... } from '@kibus/tm-ui-plus'`（含全部组件 + 类型 + `TmResolver`）
- 子入口（隔离 chunk）：`import { TmTable } from '@kibus/tm-ui-plus/table'`
- 自动导入：vite 配 `Components({ resolvers: [TmResolver()] })`，模板直接用 `<TmButton>`
- 无样式产物：`@kibus/tm-ui-plus/style.css` 不存在；vxe 样式需业务侧引入 `vxe-pc-ui/lib/style.css` + `vxe-table/lib/style.css`
