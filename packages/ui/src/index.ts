// packages/ui/src/index.ts
// 组件库总出口：在此聚合所有 Tm 组件的注册与类型导出
import type { App } from 'vue'
// 按需 Resolver 工厂（unplugin-vue-components）：业务方零配置自动导入 <TmXxx>
// 子入口决策（brief Bug 2 方案 A）：TmResolver 走主入口导出，不声明独立 ./resolver 子入口——
// 它是 Tree Shaking 友好的配置函数（非大模块），与 index 一起打包，es/index.js 自然含其导出，
// 避免 T12 vite entry 回填新增 resolver 入口。Task 14 exports 据此不声明 ./resolver。
export { TmResolver } from './resolver'
// 全量注册组件清单（单一数据源，审查 P1 #10 重构）：新增组件只需在此数组 + export 两处维护
import { tmComponents } from './components'

/**
 * Vue 插件 install：app.use(@kibus/tm-ui-plus) 全量注册
 *
 * 由 tmComponents 数组统一驱动（审查 P1 #10 重构）：
 * - 旧实现为 103 行手写 app.use(TmXxx as unknown as {...})，与 export 清单重复维护，
 *   漏注册一行无编译错误、无测试兜底；现改为数组遍历，单一数据源。
 * - withInstall 已为每个组件附加 install 方法，数组元素可直接 app.use。
 *
 * 注（plan-bug #5）：form 模块含 TmForm + TmFormItem 两个组件，必须分别注册，
 * 否则业务侧 <TmFormItem> 会因未注册而报错。
 */
export const install = (app: App): void => {
  for (const comp of tmComponents) {
    app.use(comp)
  }
  // TmMessage / TmNotification 是函数式 API（非组件），不 app.use 注册，仅 named export
}

// 组件 export：业务方可按需 import { TmButton, TmInput, TmSelect, TmForm, TmFormItem, TmTable } from '@kibus/tm-ui-plus'
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
export { TmInputIp } from './components/input-ip'
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
// 类型 export：业务方可直接 import type { TmButtonProps, InputProps, SelectProps, FormProps, TmTableProps, ... } from '@kibus/tm-ui-plus'
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
export type { TmInputIpProps } from './components/input-ip'
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
