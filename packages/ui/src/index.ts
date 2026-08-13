// packages/ui/src/index.ts
// 组件库总出口：在此聚合所有 Tm 组件的注册与类型导出
import type { App } from 'vue'
// 按需 Resolver 工厂（unplugin-vue-components）：业务方零配置自动导入 <TmXxx>
// 子入口决策（brief Bug 2 方案 A）：TmResolver 走主入口导出，不声明独立 ./resolver 子入口——
// 它是 Tree Shaking 友好的配置函数（非大模块），与 index 一起打包，es/index.js 自然含其导出，
// 避免 T12 vite entry 回填新增 resolver 入口。Task 14 exports 据此不声明 ./resolver。
export { TmResolver } from './resolver'
import { TmButton } from './components/button'
import { TmInput } from './components/input'
import { TmSelect } from './components/select'
import { TmForm, TmFormItem } from './components/form'
import { TmTable } from './components/table'
import { TmConfigProvider } from './config-provider'
import { TmRadioGroup } from './components/radio-group'
import { TmCheckboxGroup } from './components/checkbox-group'
import { TmSwitch } from './components/switch'
import { TmInputNumber } from './components/input-number'
import { TmDatePicker, TmRangePicker } from './components/date-picker'
import { TmCascader } from './components/cascader'
import { TmTreeSelect } from './components/tree-select'
import { TmTag } from './components/tag'
import { TmEmpty } from './components/empty'
import { TmBadge } from './components/badge'
import { TmApp } from './components/app'
import { TmModal } from './components/modal'
import { TmDrawer } from './components/drawer'
import { TmMessage } from './components/message'
import { TmNotification } from './components/notification'
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

/**
 * Vue 插件 install：app.use(@tm/ui) 全量注册
 * 后续 task 每新增一个组件，在此追加 app.use(组件)
 *
 * 注（plan-bug #5）：form 模块含 TmForm + TmFormItem 两个组件，必须分别 app.use 注册，
 * 否则业务侧 <TmFormItem> 会因未注册而报错。
 */
export const install = (app: App): void => {
  app.use(TmButton as unknown as { install: (app: App) => void })
  app.use(TmInput as unknown as { install: (app: App) => void })
  app.use(TmSelect as unknown as { install: (app: App) => void })
  app.use(TmForm as unknown as { install: (app: App) => void })
  app.use(TmFormItem as unknown as { install: (app: App) => void })
  app.use(TmTable as unknown as { install: (app: App) => void })
  app.use(TmConfigProvider as unknown as { install: (app: App) => void })
  app.use(TmRadioGroup as unknown as { install: (app: App) => void })
  app.use(TmCheckboxGroup as unknown as { install: (app: App) => void })
  app.use(TmSwitch as unknown as { install: (app: App) => void })
  app.use(TmInputNumber as unknown as { install: (app: App) => void })
  app.use(TmDatePicker as unknown as { install: (app: App) => void })
  app.use(TmRangePicker as unknown as { install: (app: App) => void })
  app.use(TmCascader as unknown as { install: (app: App) => void })
  app.use(TmTreeSelect as unknown as { install: (app: App) => void })
  app.use(TmTag as unknown as { install: (app: App) => void })
  app.use(TmEmpty as unknown as { install: (app: App) => void })
  app.use(TmBadge as unknown as { install: (app: App) => void })
  app.use(TmApp as unknown as { install: (app: App) => void })
  app.use(TmModal as unknown as { install: (app: App) => void })
  app.use(TmDrawer as unknown as { install: (app: App) => void })
  app.use(TmAlert as unknown as { install: (app: App) => void })
  app.use(TmPopconfirm as unknown as { install: (app: App) => void })
  app.use(TmSpin as unknown as { install: (app: App) => void })
  app.use(TmPopover as unknown as { install: (app: App) => void })
  app.use(TmResult as unknown as { install: (app: App) => void })
  app.use(TmTimePicker as unknown as { install: (app: App) => void })
  app.use(TmUpload as unknown as { install: (app: App) => void })
  app.use(TmSpace as unknown as { install: (app: App) => void })
  app.use(TmDivider as unknown as { install: (app: App) => void })
  app.use(TmFlex as unknown as { install: (app: App) => void })
  app.use(TmRow as unknown as { install: (app: App) => void })
  app.use(TmCol as unknown as { install: (app: App) => void })
  app.use(TmLayout as unknown as { install: (app: App) => void })
  app.use(TmSider as unknown as { install: (app: App) => void })
  app.use(TmHeader as unknown as { install: (app: App) => void })
  app.use(TmContent as unknown as { install: (app: App) => void })
  app.use(TmFooter as unknown as { install: (app: App) => void })
  app.use(TmTypographyTitle as unknown as { install: (app: App) => void })
  app.use(TmTypographyParagraph as unknown as { install: (app: App) => void })
  app.use(TmTypographyText as unknown as { install: (app: App) => void })
  app.use(TmTypographyLink as unknown as { install: (app: App) => void })
  app.use(TmBreadcrumb as unknown as { install: (app: App) => void })
  app.use(TmBreadcrumbItem as unknown as { install: (app: App) => void })
  app.use(TmBreadcrumbSeparator as unknown as { install: (app: App) => void })
  app.use(TmDropdown as unknown as { install: (app: App) => void })
  app.use(TmDropdownButton as unknown as { install: (app: App) => void })
  app.use(TmMenu as unknown as { install: (app: App) => void })
  app.use(TmMenuItem as unknown as { install: (app: App) => void })
  app.use(TmSubMenu as unknown as { install: (app: App) => void })
  app.use(TmMenuItemGroup as unknown as { install: (app: App) => void })
  app.use(TmMenuDivider as unknown as { install: (app: App) => void })
  app.use(TmPagination as unknown as { install: (app: App) => void })
  app.use(TmSteps as unknown as { install: (app: App) => void })
  app.use(TmStep as unknown as { install: (app: App) => void })
  app.use(TmTabs as unknown as { install: (app: App) => void })
  app.use(TmTabPane as unknown as { install: (app: App) => void })
  app.use(TmAffix as unknown as { install: (app: App) => void })
  app.use(TmAnchor as unknown as { install: (app: App) => void })
  app.use(TmAnchorLink as unknown as { install: (app: App) => void })
  app.use(TmPageHeader as unknown as { install: (app: App) => void })
  app.use(TmSlider as unknown as { install: (app: App) => void })
  app.use(TmRate as unknown as { install: (app: App) => void })
  app.use(TmTree as unknown as { install: (app: App) => void })
  app.use(TmDirectoryTree as unknown as { install: (app: App) => void })
  app.use(TmAutoComplete as unknown as { install: (app: App) => void })
  app.use(TmMentions as unknown as { install: (app: App) => void })
  app.use(TmMentionsOption as unknown as { install: (app: App) => void })
  app.use(TmTransfer as unknown as { install: (app: App) => void })
  app.use(TmCheckbox as unknown as { install: (app: App) => void })
  app.use(TmRadio as unknown as { install: (app: App) => void })
  app.use(TmCard as unknown as { install: (app: App) => void })
  app.use(TmCollapse as unknown as { install: (app: App) => void })
  app.use(TmCollapsePanel as unknown as { install: (app: App) => void })
  app.use(TmDescriptions as unknown as { install: (app: App) => void })
  app.use(TmDescriptionsItem as unknown as { install: (app: App) => void })
  app.use(TmTimeline as unknown as { install: (app: App) => void })
  app.use(TmAvatar as unknown as { install: (app: App) => void })
  app.use(TmAvatarGroup as unknown as { install: (app: App) => void })
  app.use(TmImage as unknown as { install: (app: App) => void })
  app.use(TmImagePreviewGroup as unknown as { install: (app: App) => void })
  app.use(TmList as unknown as { install: (app: App) => void })
  app.use(TmListItem as unknown as { install: (app: App) => void })
  app.use(TmListItemMeta as unknown as { install: (app: App) => void })
  app.use(TmSegmented as unknown as { install: (app: App) => void })
  app.use(TmStatistic as unknown as { install: (app: App) => void })
  app.use(TmCountdown as unknown as { install: (app: App) => void })
  app.use(TmCalendar as unknown as { install: (app: App) => void })
  app.use(TmCarousel as unknown as { install: (app: App) => void })
  app.use(TmQRCode as unknown as { install: (app: App) => void })
  app.use(TmTooltip as unknown as { install: (app: App) => void })
  app.use(TmComment as unknown as { install: (app: App) => void })
  app.use(TmWatermark as unknown as { install: (app: App) => void })
  app.use(TmProgress as unknown as { install: (app: App) => void })
  app.use(TmSkeleton as unknown as { install: (app: App) => void })
  app.use(TmSkeletonAvatar as unknown as { install: (app: App) => void })
  app.use(TmSkeletonImage as unknown as { install: (app: App) => void })
  app.use(TmSkeletonInput as unknown as { install: (app: App) => void })
  app.use(TmSkeletonButton as unknown as { install: (app: App) => void })
  app.use(TmTour as unknown as { install: (app: App) => void })
  app.use(TmFloatButton as unknown as { install: (app: App) => void })
  app.use(TmFloatButtonGroup as unknown as { install: (app: App) => void })
  app.use(TmFloatButtonBackTop as unknown as { install: (app: App) => void })
  // TmMessage / TmNotification 是函数式 API（非组件），不 app.use 注册，仅 named export
}

// 组件 export：业务方可按需 import { TmButton, TmInput, TmSelect, TmForm, TmFormItem, TmTable } from '@tm/ui'
export { TmButton } from './components/button'
export { TmInput } from './components/input'
export { TmSelect } from './components/select'
export { TmForm, TmFormItem } from './components/form'
export { TmTable } from './components/table'
export { TmConfigProvider } from './config-provider'
export { TmRadioGroup } from './components/radio-group'
export { TmCheckboxGroup } from './components/checkbox-group'
export { TmSwitch } from './components/switch'
export { TmInputNumber } from './components/input-number'
export { TmDatePicker, TmRangePicker } from './components/date-picker'
export { TmCascader } from './components/cascader'
export { TmTreeSelect } from './components/tree-select'
export { TmTag } from './components/tag'
export { TmEmpty } from './components/empty'
export { TmBadge } from './components/badge'
export { TmApp } from './components/app'
export { TmModal } from './components/modal'
export { TmDrawer } from './components/drawer'
export { TmAlert } from './components/alert'
export { TmPopconfirm } from './components/popconfirm'
export { TmSpin } from './components/spin'
export { TmPopover } from './components/popover'
export { TmResult } from './components/result'
export { TmTimePicker } from './components/time-picker'
export { TmUpload } from './components/upload'
export { TmSpace } from './components/space'
export { TmDivider } from './components/divider'
export { TmFlex } from './components/flex'
export { TmRow, TmCol } from './components/grid'
export { TmLayout, TmSider, TmHeader, TmContent, TmFooter } from './components/layout'
export {
  TmTypographyTitle,
  TmTypographyParagraph,
  TmTypographyText,
  TmTypographyLink,
} from './components/typography'
export { TmBreadcrumb, TmBreadcrumbItem, TmBreadcrumbSeparator } from './components/breadcrumb'
export { TmDropdown, TmDropdownButton } from './components/dropdown'
export { TmMenu, TmMenuItem, TmSubMenu, TmMenuItemGroup, TmMenuDivider } from './components/menu'
export { TmPagination } from './components/pagination'
export { TmSteps, TmStep } from './components/steps'
export { TmTabs, TmTabPane } from './components/tabs'
export { TmAffix } from './components/affix'
export { TmAnchor, TmAnchorLink } from './components/anchor'
export { TmPageHeader } from './components/page-header'
export { TmSlider } from './components/slider'
export { TmRate } from './components/rate'
export { TmTree, TmDirectoryTree } from './components/tree'
export { TmAutoComplete } from './components/auto-complete'
export { TmMentions, TmMentionsOption } from './components/mentions'
export { TmTransfer } from './components/transfer'
export { TmCheckbox } from './components/checkbox'
export { TmRadio } from './components/radio'
export { TmCard } from './components/card'
export { TmCollapse, TmCollapsePanel } from './components/collapse'
export { TmDescriptions, TmDescriptionsItem } from './components/descriptions'
export { TmTimeline } from './components/timeline'
export { TmAvatar, TmAvatarGroup } from './components/avatar'
export { TmImage, TmImagePreviewGroup } from './components/image'
export { TmList, TmListItem, TmListItemMeta } from './components/list'
export { TmSegmented } from './components/segmented'
export { TmStatistic, TmCountdown } from './components/statistic'
export { TmCalendar } from './components/calendar'
export { TmCarousel } from './components/carousel'
export { TmQRCode } from './components/qrcode'
export { TmTooltip } from './components/tooltip'
export { TmComment } from './components/comment'
export { TmWatermark } from './components/watermark'
export { TmProgress } from './components/progress'
export {
  TmSkeleton,
  TmSkeletonAvatar,
  TmSkeletonImage,
  TmSkeletonInput,
  TmSkeletonButton,
} from './components/skeleton'
export { TmTour } from './components/tour'
export {
  TmFloatButton,
  TmFloatButtonGroup,
  TmFloatButtonBackTop,
} from './components/float-button'
// 函数式 API（非组件）：全局消息/通知命令式调用
export { TmMessage } from './components/message'
export { TmNotification } from './components/notification'
// 类型 export：业务方可直接 import type { TmButtonProps, InputProps, SelectProps, FormProps, TmTableProps, ... } from '@tm/ui'
export type { TmButtonProps, TmButtonExtProps } from './components/button'
export type { TmInputProps, TmInputExtProps, InputProps } from './components/input'
export type { TmSelectProps, TmSelectExtProps, SelectProps } from './components/select'
export type { FormProps, FormInstance, FormItemProps, FormItemInstance } from './components/form'
export type {
  TmTableProps,
  TmTableExtProps,
  TmTablePageParam,
  TmTableResult,
  VxeGridProps,
  VxeGridInstance,
  VxeColumnProps,
  VxeGridListeners,
} from './components/table'
export type { TmRadioGroupProps, TmRadioGroupExtProps, RadioGroupProps } from './components/radio-group'
export type {
  TmCheckboxGroupProps,
  TmCheckboxGroupExtProps,
  CheckboxGroupProps,
} from './components/checkbox-group'
export type { TmSwitchProps, TmSwitchExtProps, SwitchProps } from './components/switch'
export type { TmInputNumberProps, TmInputNumberExtProps, InputNumberProps } from './components/input-number'
export type {
  TmDatePickerProps,
  TmDatePickerExtProps,
  DatePickerProps,
  TmRangePickerProps,
  TmRangePickerExtProps,
  RangePickerProps,
} from './components/date-picker'
export type { TmCascaderProps, TmCascaderExtProps, CascaderProps } from './components/cascader'
export type { TmTreeSelectProps, TmTreeSelectExtProps, TreeSelectProps } from './components/tree-select'
export type { TmTagProps, TmTagExtProps, TagProps } from './components/tag'
export type { TmEmptyProps, EmptyProps } from './components/empty'
export type { TmBadgeProps, BadgeProps } from './components/badge'
export type { TmModalProps, TmModalExtProps, ModalProps } from './components/modal'
export type { TmDrawerProps, TmDrawerExtProps, DrawerProps } from './components/drawer'
export type { TmAlertProps, TmAlertExtProps, AlertProps } from './components/alert'
export type { TmPopconfirmProps, TmPopconfirmExtProps, PopconfirmProps } from './components/popconfirm'
export type { TmSpinProps, SpinProps } from './components/spin'
export type { TmPopoverProps, PopoverProps } from './components/popover'
export type { TmResultProps, ResultProps } from './components/result'
export type { TmTimePickerProps, TmTimePickerExtProps, TimePickerProps } from './components/time-picker'
export type { TmUploadProps, UploadProps, UploadFile, UploadChangeParam } from './components/upload'
export type { TmSpaceProps, SpaceProps } from './components/space'
export type { TmDividerProps, DividerProps } from './components/divider'
export type { TmFlexProps, FlexProps } from './components/flex'
export type { TmRowProps, TmColProps, RowProps, ColProps } from './components/grid'
export type {
  TmLayoutProps,
  TmSiderProps,
  TmHeaderProps,
  TmContentProps,
  TmFooterProps,
  LayoutProps,
  SiderProps,
} from './components/layout'
export type {
  TmTypographyTitleProps,
  TmTypographyParagraphProps,
  TmTypographyTextProps,
  TmTypographyLinkProps,
  TitleProps,
  ParagraphProps,
  TextProps,
  LinkProps,
} from './components/typography'
export type {
  TmBreadcrumbProps,
  TmBreadcrumbItemProps,
  TmBreadcrumbSeparatorProps,
  BreadcrumbProps,
  BreadcrumbItemProps,
  BreadcrumbSeparatorProps,
} from './components/breadcrumb'
export type { TmDropdownProps, TmDropdownButtonProps, DropdownProps } from './components/dropdown'
export type {
  TmMenuProps,
  TmMenuItemProps,
  TmSubMenuProps,
  TmMenuItemGroupProps,
  TmMenuDividerProps,
  MenuProps,
  MenuItemProps,
  SubMenuProps,
  MenuItemGroupProps,
  MenuDividerProps,
  MenuTheme,
  MenuMode,
} from './components/menu'
export type { TmPaginationProps, PaginationProps } from './components/pagination'
export type { TmStepsProps, TmStepProps, StepsProps, StepProps } from './components/steps'
export type { TmTabsProps, TmTabPaneProps, TabsProps, TabPaneProps } from './components/tabs'
export type { TmAffixProps, AffixProps } from './components/affix'
export type { TmAnchorProps, TmAnchorLinkProps, AnchorProps, AnchorLinkProps } from './components/anchor'
export type { TmPageHeaderProps, PageHeaderProps } from './components/page-header'
export type { TmSliderProps, SliderProps } from './components/slider'
export type { TmRateProps, RateProps } from './components/rate'
export type {
  TmTreeProps,
  TmDirectoryTreeProps,
  TreeProps,
  DirectoryTreeProps,
} from './components/tree'
export type { TmAutoCompleteProps, AutoCompleteProps } from './components/auto-complete'
export type { TmMentionsProps, TmMentionsOptionProps, MentionsProps } from './components/mentions'
export type { TmTransferProps, TransferProps } from './components/transfer'
export type { TmCheckboxProps, CheckboxProps } from './components/checkbox'
export type { TmRadioProps, RadioProps } from './components/radio'
export type { TmCardProps, CardProps } from './components/card'
export type {
  TmCollapseProps,
  TmCollapsePanelProps,
  CollapseProps,
  CollapsePanelProps,
} from './components/collapse'
export type {
  TmDescriptionsProps,
  TmDescriptionsItemProps,
  DescriptionsProps,
} from './components/descriptions'
export type { TmTimelineProps, TimelineProps } from './components/timeline'
export type { TmAvatarProps, TmAvatarGroupProps, AvatarProps, AvatarGroupProps } from './components/avatar'
export type { TmImageProps, TmImagePreviewGroupProps, ImageProps } from './components/image'
export type {
  TmListProps,
  TmListItemProps,
  TmListItemMetaProps,
  ListProps,
  ListItemProps,
  ListItemMetaProps,
} from './components/list'
export type { TmSegmentedProps, SegmentedProps } from './components/segmented'
export type { TmStatisticProps, TmCountdownProps, StatisticProps } from './components/statistic'
export type { TmCalendarProps, CalendarProps } from './components/calendar'
export type { TmCarouselProps, CarouselProps, CarouselRef } from './components/carousel'
export type { TmQRCodeProps, QRCodeProps } from './components/qrcode'
export type { TmTooltipProps, TooltipProps, TooltipPlacement } from './components/tooltip'
export type { TmCommentProps, CommentProps } from './components/comment'
export type { TmWatermarkProps, WatermarkProps } from './components/watermark'
export type { TmProgressProps, TmProgressStatus, ProgressProps } from './components/progress'
export type {
  TmSkeletonProps,
  TmSkeletonAvatarProps,
  TmSkeletonImageProps,
  TmSkeletonInputProps,
  TmSkeletonButtonProps,
  SkeletonProps,
  SkeletonAvatarProps,
  SkeletonImageProps,
  SkeletonInputProps,
  SkeletonButtonProps,
} from './components/skeleton'
export type { TmTourProps, TourProps } from './components/tour'
export type {
  TmFloatButtonProps,
  TmFloatButtonGroupProps,
  TmFloatButtonBackTopProps,
  FloatButtonProps,
  FloatButtonGroupProps,
  BackTopProps,
} from './components/float-button'

export default { install }
