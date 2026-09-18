# @trustmo/tm-ui 组件速查

> 本文件是 `prefer-tm-ui` skill 的参考资料。写 UI 代码时若不确定该用哪个 Tm 组件，查本表。
> 子组件（配套父容器的结构件、模板写法与陷阱）→ `tm-subcomponent-guide.md`。

## ant-design-vue → Tm 快速映射

需求出现时优先用右侧 Tm 组件，不要写 ant 原生组件：

| ant 原生（不要用） | 优先用 | 备注 |
| --- | --- | --- |
| `a-button` | `TmButton` | 默认 primary；支持 `debounce` / `confirm` |
| `a-button-group` | `TmButtonGroup` | 相邻按钮共享边框，仅首尾保留圆角 |
| `a-input` | `TmInput` | 默认 allowClear、middle、bordered |
| `a-input-password` | `TmInputPassword` | 与 TmInput 同源默认 + 保留可见性切换图标 |
| `a-input.search` | `TmInputSearch` | 搜索框，`enterButton` 等原生能力照常透传 |
| `a-textarea` | `TmTextarea` | 默认 allowClear；`autoSize` 自动高度 |
| `a-input-group` / `a-space-compact` | `TmInputGroup` / `TmCompact` | 控件贴合为一体；新代码优先 `TmCompact`（更通用） |
| `a-input-number` | `TmInputNumber` | |
| IP / MAC 地址输入 | `TmInputIp` / `TmInputMac` | 自研能力，ant 无对应；分段输入 + 内置校验 |
| `a-select` | `TmSelect` | 默认 showSearch + allowClear + 防抖 300ms；支持远程搜索 |
| `a-auto-complete` | `TmAutoComplete` | |
| `a-mentions` | `TmMentions` | 候选用 `:options`（ant 4.2.6 已废弃 Option 子组件写法） |
| `a-week-picker` / `a-month-picker` / `a-quarter-picker` | `TmWeekPicker` / `TmMonthPicker` / `TmQuarterPicker` | 字符串模式配 `value-format`（周用 `YYYY-ww`，勿用 `wo`） |
| `a-date-picker` / `a-range-picker` / `a-time-picker` | `TmDatePicker` / `TmRangePicker` / `TmTimePicker` | |
| `a-time-picker` 选时间段 | `TmTimeRangePicker` | 开始~结束一条输入框 |
| `a-cascader` / `a-tree-select` / `a-tree` | `TmCascader` / `TmTreeSelect` / `TmTree` | 目录树另有 `TmDirectoryTree` |
| `a-radio-group` / `a-checkbox-group` | `TmRadioGroup` / `TmCheckboxGroup` | 用 `options` prop 驱动；模板子组件写法受限（见子组件 guide） |
| `a-radio-button` | `TmRadioButton` | 按钮态单选的值单元，**必须配原生 `a-radio-group`** |
| `a-form` / `a-form-item` | `TmForm` / `TmFormItem` | 提供 submitting/readonly/disabled 级联 + 脏追踪 |
| `a-table` | `TmTable` | vxe 底座；远程 `request` + 声明式 `search` + 密度档位 |
| `a-modal` / `a-drawer` | `TmModal` / `TmDrawer` | |
| `message.*` / `notification.*` | `TmMessage.*` / `TmNotification.*` | 函数式 API，需 `<tm-app>` 包裹跟随主题 |
| `a-tag` / `a-tag` 可选态 / `a-badge` / `a-empty` | `TmTag` / `TmCheckableTag` / `TmBadge` / `TmEmpty` | 可选标签：`v-model:checked` 双向 |
| `a-space` / `a-divider` / `a-flex` | `TmSpace` / `TmDivider` / `TmFlex` | |
| `a-menu` / `a-tabs` / `a-breadcrumb` / `a-pagination` | `TmMenu` / `TmTabs` / `TmBreadcrumb` / `TmPagination` | |
| `a-upload` / `a-upload-dragger` | `TmUpload` / `TmUploadDragger` | 同一套 `v-model:file-list` 契约 |
| `a-config-provider` | `TmConfigProvider` | ant 与 vxe 主题同源 |
| `a-typography` | `TmTypography`（+ Title / Paragraph / Text / Link） | 本体入口 `TmTypography` 与四个子组件均在主入口导出 |

## 组件清单（按分类，与主入口导出一致）

### 数据录入 / 通用
`TmButton`（+ `TmButtonGroup`）`TmInput`（+ `TmInputGroup`）`TmInputPassword` `TmInputSearch` `TmTextarea` `TmInputNumber` `TmInputIp` `TmInputMac` `TmSelect` `TmAutoComplete` `TmMentions` `TmTransfer` `TmTree` `TmDirectoryTree` `TmCascader` `TmTreeSelect` `TmDatePicker` `TmRangePicker` `TmTimePicker` `TmMonthPicker` `TmWeekPicker` `TmQuarterPicker` `TmTimeRangePicker` `TmUpload` `TmUploadDragger` `TmCheckbox` `TmCheckboxGroup` `TmRadio` `TmRadioGroup` `TmRadioButton` `TmSwitch` `TmRate` `TmSlider`

### 表单
`TmForm` `TmFormItem`（+ `TmFormItemRest`）

### 布局
`TmSpace`（+ `TmCompact`）`TmDivider` `TmFlex` `TmRow` `TmCol` `TmLayout` `TmSider` `TmHeader` `TmContent` `TmFooter`

### 导航
`TmBreadcrumb`（+ `TmBreadcrumbItem` `TmBreadcrumbSeparator`）`TmDropdown`（+ `TmDropdownButton`）`TmMenu`（+ `TmMenuItem` `TmSubMenu` `TmMenuItemGroup` `TmMenuDivider`）`TmPagination` `TmSteps`（+ `TmStep`）`TmTabs`（+ `TmTabPane`）`TmAffix` `TmAnchor`（+ `TmAnchorLink`）`TmPageHeader`

### 数据展示
`TmTable` `TmTag` `TmCheckableTag` `TmEmpty` `TmBadge`（+ `TmBadgeRibbon`）`TmAvatar`（+ `TmAvatarGroup`）`TmCalendar` `TmCarousel` `TmCollapse`（+ `TmCollapsePanel`）`TmComment` `TmDescriptions`（+ `TmDescriptionsItem`）`TmImage`（+ `TmImagePreviewGroup`）`TmList`（+ `TmListItem` `TmListItemMeta`）`TmQRCode` `TmSegmented` `TmStatistic`（+ `TmCountdown`）`TmTimeline`（+ `TmTimelineItem`）`TmTooltip` `TmCard`（+ `TmCardGrid` `TmCardMeta`）

### 反馈
`TmAlert` `TmModal` `TmDrawer` `TmPopconfirm` `TmPopover` `TmResult` `TmSpin` `TmProgress` `TmSkeleton`（+ `TmSkeletonTitle` `TmSkeletonAvatar` `TmSkeletonImage` `TmSkeletonInput` `TmSkeletonButton`）`TmTour` `TmFloatButton`（+ `TmFloatButtonGroup` `TmFloatButtonBackTop`）

### 全局 / 其它
`TmConfigProvider` `TmApp` `TmMessage` `TmNotification` `TmTypography`（+ `TmTypographyTitle` `TmTypographyParagraph` `TmTypographyText` `TmTypographyLink`）`TmWatermark`

### 结构子组件（模板写法，需配对应父容器）
`TmSelectOption` `TmSelectOptGroup` `TmAutoCompleteOption` `TmAutoCompleteOptGroup` `TmTreeNode` `TmTreeSelectNode` `TmMentionsOption` `TmTableColumn` `TmTableColumnGroup` `TmTableSummary` `TmTableSummaryRow` `TmTableSummaryCell`

> 这批组件不是独立控件，只在父容器的模板写法里出现，且各有实测陷阱（空数组 options 会关掉模板模式、`TmTableColumn` 只对原生 `a-table` 有效等）。**用前必读 `tm-subcomponent-guide.md`。**

## 公司默认值（业务显式传同名 prop 可覆盖）

| 组件 | 默认值 |
| --- | --- |
| `TmButton` | `type: 'primary'`、`debounce: 0`（不防抖，保持 ant 原生点击语义） |
| `TmInput` | `allowClear: true`、`size: 'middle'`、`bordered: true` |
| `TmInputPassword` | 同 `TmInput`，另 `visibilityToggle: true`（否则密码可见性图标消失） |
| `TmTextarea` | `allowClear: true`、`bordered: true`（ant Textarea 无 `size`，不设尺寸档） |
| `TmInputSearch` | 继承 `TmInput` 系列默认 |
| `TmSelect` | `showSearch: true`、`allowClear: true`、`debounce: 300`、`minLength: 1` |
| `TmUpload` / `TmUploadDragger` | `showUploadList: true` |
| `TmTable` | `border: true`、`stripe: true`、`showOverflow: true`、`fit: true`、分页 `pageSize: 10` |
| `TmForm` | `layout: 'horizontal'`、`hideRequiredMark: false` |
| `TmConfigProvider` | `locale: zh_CN` |
| 周 / 月 / 季 / 时间段选择器 | 无默认档位；`valueFormat` 不传时 `modelValue` 为 Dayjs 对象 |

## 业务扩展键（ant 原生没有的能力）

| 组件 | 扩展键 | 说明 |
| --- | --- | --- |
| `TmButton` | `debounce` | 点击防抖（ms），>0 启用 |
| `TmButton` | `confirm` | 传入文案后点击前二次确认（Popconfirm 包裹） |
| `TmSelect` | `debounce` | 搜索防抖间隔（ms） |
| `TmSelect` | `remote` | 远程搜索能力 |
| `TmWeekPicker` / `TmMonthPicker` / `TmQuarterPicker` | `valueFormat` | 配置后 `modelValue` 变成字符串，内部做 string↔Dayjs 双向转换 |
| `TmWeekPicker` / `TmMonthPicker` / `TmQuarterPicker` / `TmTimeRangePicker` | `readonly` | 只读语义：锁死弹层，比 `disabled` 保留正常视觉 |
| `TmForm` | `submitting` / `readonly` / `disabled` | 经 provide/inject 级联下发到 TmFormItem 及子控件 |
| `TmForm` | `isDirty` / `getDirtyFields` / `resetToInitial` / `markInitial` | 表单脏追踪（挂载时快照 model） |
| `TmTable` | `request` | 远程数据函数，返回 `{ data, total }`；params 为 `{ currentPage, pageSize, query }` |
| `TmTable` | `search` | 声明式搜索表单，`{ fields: [{ field, label }] }` |
| `TmTable` | `density` | `'compact' \| 'default' \| 'loose'` 密度档位 |

## 关键入口

- 主入口：`import { TmButton, ... } from '@trustmo/tm-ui'`（含全部组件 + 类型 + `TmResolver`）
- 子入口（隔离 chunk）：`import { TmTable } from '@trustmo/tm-ui/table'`
- 自动导入：vite 配 `Components({ resolvers: [TmResolver()] })`，模板直接用 `<tm-button>`
- 无样式产物：`@trustmo/tm-ui/style.css` 不存在；vxe 样式需业务侧引入 `vxe-pc-ui/lib/style.css` + `vxe-table/lib/style.css`
