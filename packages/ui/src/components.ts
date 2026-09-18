// packages/ui/src/components.ts
// 组件清单（单一数据源）：install 注册驱动。
//
// 审查 P1 #10 重构的产物：
// - 新增组件只需 ① import ② 加入本数组 ③ 在 index.ts 加 export 行；
// - install() 遍历本数组注册，不再维护重复的 app.use 清单；
// - 本文件可被测试直接遍历断言「数组内每个组件都有 install 方法且注册后 app.component 可见」，
//   杜绝「漏注册无编译错误无测试兜底」的历史隐患。
import { TmButton } from './components/button'
import { TmInput } from './components/input'
import { TmInputPassword } from './components/input-password'
import { TmSelect } from './components/select'
import { TmForm, TmFormItem } from './components/form'
import { TmTable } from './components/table'
import { TmConfigProvider } from './config-provider'
import { TmRadioGroup } from './components/radio-group'
import { TmCheckboxGroup } from './components/checkbox-group'
import { TmSwitch } from './components/switch'
import { TmInputNumber } from './components/input-number'
import { TmInputIp } from './components/input-ip'
import { TmInputMac } from './components/input-mac'
import { TmDatePicker, TmRangePicker } from './components/date-picker'
import { TmCascader } from './components/cascader'
import { TmTreeSelect } from './components/tree-select'
import { TmTag } from './components/tag'
import { TmEmpty } from './components/empty'
import { TmBadge } from './components/badge'
import { TmApp } from './components/app'
import { TmModal } from './components/modal'
import { TmDrawer } from './components/drawer'
import { TmAlert } from './components/alert'
import { TmPopconfirm } from './components/popconfirm'
import { TmSpin } from './components/spin'
import { TmPopover } from './components/popover'
import { TmResult } from './components/result'
import { TmTimePicker } from './components/time-picker'
import { TmUpload } from './components/upload'
import { TmSpace } from './components/space'
import { TmDivider } from './components/divider'
import { TmFlex } from './components/flex'
import { TmRow, TmCol } from './components/grid'
import { TmLayout, TmSider, TmHeader, TmContent, TmFooter } from './components/layout'
import {
  TmTypographyTitle,
  TmTypographyParagraph,
  TmTypographyText,
  TmTypographyLink,
} from './components/typography'
import { TmBreadcrumb, TmBreadcrumbItem, TmBreadcrumbSeparator } from './components/breadcrumb'
import { TmDropdown, TmDropdownButton } from './components/dropdown'
import { TmMenu, TmMenuItem, TmSubMenu, TmMenuItemGroup, TmMenuDivider } from './components/menu'
import { TmPagination } from './components/pagination'
import { TmSteps, TmStep } from './components/steps'
import { TmTabs, TmTabPane } from './components/tabs'
import { TmAffix } from './components/affix'
import { TmAnchor, TmAnchorLink } from './components/anchor'
import { TmPageHeader } from './components/page-header'
import { TmSlider } from './components/slider'
import { TmRate } from './components/rate'
import { TmTree, TmDirectoryTree } from './components/tree'
import { TmAutoComplete } from './components/auto-complete'
import { TmMentions, TmMentionsOption } from './components/mentions'
import { TmTransfer } from './components/transfer'
import { TmCheckbox } from './components/checkbox'
import { TmRadio } from './components/radio'
import { TmCard } from './components/card'
import { TmCollapse, TmCollapsePanel } from './components/collapse'
import { TmDescriptions, TmDescriptionsItem } from './components/descriptions'
import { TmTimeline } from './components/timeline'
import { TmAvatar, TmAvatarGroup } from './components/avatar'
import { TmImage, TmImagePreviewGroup } from './components/image'
import { TmList, TmListItem, TmListItemMeta } from './components/list'
import { TmSegmented } from './components/segmented'
import { TmStatistic, TmCountdown } from './components/statistic'
import { TmCalendar } from './components/calendar'
import { TmCarousel } from './components/carousel'
import { TmQRCode } from './components/qrcode'
import { TmTooltip } from './components/tooltip'
import { TmComment } from './components/comment'
import { TmWatermark } from './components/watermark'
import { TmProgress } from './components/progress'
import {
  TmSkeleton,
  TmSkeletonAvatar,
  TmSkeletonImage,
  TmSkeletonInput,
  TmSkeletonButton,
} from './components/skeleton'
import { TmTour } from './components/tour'
import {
  TmFloatButton,
  TmFloatButtonGroup,
  TmFloatButtonBackTop,
} from './components/float-button'
// ── add-missing-subcomponents 批次：有值通道组件（完整封装）──
import { TmTextarea } from './components/textarea'
import { TmInputSearch } from './components/input-search'
import { TmCheckableTag } from './components/checkable-tag'
import { TmMonthPicker } from './components/month-picker'
import { TmWeekPicker } from './components/week-picker'
import { TmQuarterPicker } from './components/quarter-picker'
import { TmTimeRangePicker } from './components/time-range-picker'
import { TmUploadDragger } from './components/upload-dragger'
import { TmRadioButton } from './components/radio-button'
// ── add-missing-subcomponents 批次：结构子组件（ant 顶层导出别名复用）──
import { TmSelectOption, TmSelectOptGroup } from './components/select'
import { TmAutoCompleteOption, TmAutoCompleteOptGroup } from './components/auto-complete'
import { TmTreeNode } from './components/tree'
import { TmTreeSelectNode } from './components/tree-select'
import { TmTimelineItem } from './components/timeline'
import { TmBadgeRibbon } from './components/badge'
import { TmCardGrid, TmCardMeta } from './components/card'
import {
  TmTableColumn,
  TmTableColumnGroup,
  TmTableSummary,
  TmTableSummaryRow,
  TmTableSummaryCell,
} from './components/table-columns'
import { TmInputGroup } from './components/input'
import { TmButtonGroup } from './components/button'
import { TmCompact } from './components/space'
import { TmFormItemRest } from './components/form'
import { TmSkeletonTitle } from './components/skeleton'
import { TmTypography } from './components/typography'
import type { Plugin } from 'vue'

/**
 * 全量注册组件清单（单一数据源）。
 * 全部组件经 withInstall 附加了 install 方法，可直接作为 Vue Plugin 使用。
 */
export const tmComponents: readonly Plugin[] = [
  TmButton,
  TmInput,
  TmInputPassword,
  TmSelect,
  TmForm,
  TmFormItem,
  TmTable,
  TmConfigProvider,
  TmRadioGroup,
  TmCheckboxGroup,
  TmSwitch,
  TmInputNumber,
  TmDatePicker,
  TmRangePicker,
  TmCascader,
  TmTreeSelect,
  TmTag,
  TmEmpty,
  TmBadge,
  TmApp,
  TmModal,
  TmDrawer,
  TmAlert,
  TmPopconfirm,
  TmSpin,
  TmPopover,
  TmResult,
  TmTimePicker,
  TmUpload,
  TmSpace,
  TmDivider,
  TmFlex,
  TmRow,
  TmCol,
  TmLayout,
  TmSider,
  TmHeader,
  TmContent,
  TmFooter,
  TmTypographyTitle,
  TmTypographyParagraph,
  TmTypographyText,
  TmTypographyLink,
  TmBreadcrumb,
  TmBreadcrumbItem,
  TmBreadcrumbSeparator,
  TmDropdown,
  TmDropdownButton,
  TmMenu,
  TmMenuItem,
  TmSubMenu,
  TmMenuItemGroup,
  TmMenuDivider,
  TmPagination,
  TmSteps,
  TmStep,
  TmTabs,
  TmTabPane,
  TmAffix,
  TmAnchor,
  TmAnchorLink,
  TmPageHeader,
  TmSlider,
  TmRate,
  TmTree,
  TmDirectoryTree,
  TmAutoComplete,
  TmMentions,
  TmMentionsOption,
  TmTransfer,
  TmCheckbox,
  TmRadio,
  TmCard,
  TmCollapse,
  TmCollapsePanel,
  TmDescriptions,
  TmDescriptionsItem,
  TmTimeline,
  TmAvatar,
  TmAvatarGroup,
  TmImage,
  TmImagePreviewGroup,
  TmList,
  TmListItem,
  TmListItemMeta,
  TmSegmented,
  TmStatistic,
  TmCountdown,
  TmCalendar,
  TmCarousel,
  TmQRCode,
  TmTooltip,
  TmComment,
  TmWatermark,
  TmProgress,
  TmSkeleton,
  TmSkeletonAvatar,
  TmSkeletonImage,
  TmSkeletonInput,
  TmSkeletonButton,
  TmTour,
  TmFloatButton,
  TmFloatButtonGroup,
  TmFloatButtonBackTop,
  TmInputIp,
  TmInputMac,
  // ── add-missing-subcomponents 批次（30 项能力，design D1/D2 分类实现）──
  TmTextarea,
  TmInputSearch,
  TmCheckableTag,
  TmMonthPicker,
  TmWeekPicker,
  TmQuarterPicker,
  TmTimeRangePicker,
  TmUploadDragger,
  TmRadioButton,
  TmSelectOption,
  TmSelectOptGroup,
  TmAutoCompleteOption,
  TmAutoCompleteOptGroup,
  TmTreeNode,
  TmTreeSelectNode,
  TmTimelineItem,
  TmBadgeRibbon,
  TmCardGrid,
  TmCardMeta,
  TmTableColumn,
  TmTableColumnGroup,
  TmTableSummary,
  TmTableSummaryRow,
  TmTableSummaryCell,
  TmInputGroup,
  TmButtonGroup,
  TmCompact,
  TmFormItemRest,
  TmSkeletonTitle,
  TmTypography,
]
