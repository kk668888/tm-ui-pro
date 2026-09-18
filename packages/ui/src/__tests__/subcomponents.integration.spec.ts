// packages/ui/src/__tests__/subcomponents.integration.spec.ts
// add-missing-subcomponents 批次的 D2 验证点：结构子组件「别名复用」集成测试
//
// 核心断言：Tm 结构子组件与 ant 原组件是【同一组件对象】（withInstall 原对象附加 install
// 返回同一引用）——vnode.type 全等成立，ant 父组件对模板子组件的识别不被破坏。
// 再配 Select/Tree/Typography/ButtonGroup/Compact/FormItemRest 渲染冒烟锁定真实行为。
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import {
  SelectOption as ASelectOption,
  SelectOptGroup as ASelectOptGroup,
  TreeNode as ATreeNode,
  TimelineItem as ATimelineItem,
  BadgeRibbon as ABadgeRibbon,
  CardGrid as ACardGrid,
  CardMeta as ACardMeta,
  ButtonGroup as AButtonGroup,
  Compact as ACompact,
  FormItemRest as AFormItemRest,
  InputGroup as AInputGroup,
  SkeletonTitle as ASkeletonTitle,
  Typography as ATypography,
  TableColumn as ATableColumn,
  TableColumnGroup as ATableColumnGroup,
  TableSummary as ATableSummary,
  TableSummaryRow as ATableSummaryRow,
  TableSummaryCell as ATableSummaryCell,
  AutoCompleteOption as AAutoCompleteOption,
  AutoCompleteOptGroup as AAutoCompleteOptGroup,
  TreeSelectNode as ATreeSelectNode,
} from 'ant-design-vue'
import {
  TmSelect,
  TmSelectOption,
  TmSelectOptGroup,
  TmAutoCompleteOption,
  TmAutoCompleteOptGroup,
  TmTree,
  TmTreeNode,
  TmTreeSelectNode,
  TmTimelineItem,
  TmBadgeRibbon,
  TmCardGrid,
  TmCardMeta,
  TmButtonGroup,
  TmCompact,
  TmFormItemRest,
  TmInputGroup,
  TmSkeletonTitle,
  TmTypography,
  TmTableColumn,
  TmTableColumnGroup,
  TmTableSummary,
  TmTableSummaryRow,
  TmTableSummaryCell,
  TmButton,
} from '../index'

describe('结构子组件别名复用（design D2 同一性）', () => {
  const pairs: [unknown, unknown, string][] = [
    [TmSelectOption, ASelectOption, 'TmSelectOption'],
    [TmSelectOptGroup, ASelectOptGroup, 'TmSelectOptGroup'],
    [TmAutoCompleteOption, AAutoCompleteOption, 'TmAutoCompleteOption'],
    [TmAutoCompleteOptGroup, AAutoCompleteOptGroup, 'TmAutoCompleteOptGroup'],
    [TmTreeNode, ATreeNode, 'TmTreeNode'],
    [TmTreeSelectNode, ATreeSelectNode, 'TmTreeSelectNode'],
    [TmTimelineItem, ATimelineItem, 'TmTimelineItem'],
    [TmBadgeRibbon, ABadgeRibbon, 'TmBadgeRibbon'],
    [TmCardGrid, ACardGrid, 'TmCardGrid'],
    [TmCardMeta, ACardMeta, 'TmCardMeta'],
    [TmTableColumn, ATableColumn, 'TmTableColumn'],
    [TmTableColumnGroup, ATableColumnGroup, 'TmTableColumnGroup'],
    [TmTableSummary, ATableSummary, 'TmTableSummary'],
    [TmTableSummaryRow, ATableSummaryRow, 'TmTableSummaryRow'],
    [TmTableSummaryCell, ATableSummaryCell, 'TmTableSummaryCell'],
    [TmInputGroup, AInputGroup, 'TmInputGroup'],
    [TmButtonGroup, AButtonGroup, 'TmButtonGroup'],
    [TmCompact, ACompact, 'TmCompact'],
    [TmFormItemRest, AFormItemRest, 'TmFormItemRest'],
    [TmSkeletonTitle, ASkeletonTitle, 'TmSkeletonTitle'],
    [TmTypography, ATypography, 'TmTypography'],
  ]
  it.each(pairs)('%s 与 ant 原组件同一（vnode.type 全等）', (tm, ant) => {
    expect(tm).toBe(ant)
  })
})

describe('模板子组件写法渲染冒烟', () => {
  it('TmSelect 内 TmSelectOption 模板子组件正常渲染选项文本', () => {
    const wrapper = mount({
      components: { TmSelect, TmSelectOption },
      template: `
        <TmSelect :model-value="'a'" style="width: 120px">
          <TmSelectOption value="a">选项A</TmSelectOption>
          <TmSelectOption value="b">选项B</TmSelectOption>
        </TmSelect>
      `,
    })
    // 选中值回显（ant 用 children 里的 Option 匹配 label；值通道走 modelValue，
    // :value 会被 TmSelect 的值通道剥离丢弃——这本身就是要锁定的封装行为）
    expect(wrapper.text()).toContain('选项A')
  })

  it('TmTree 内 TmTreeNode 模板子组件渲染层级（历史决策翻案的回归锁）', () => {
    const wrapper = mount({
      components: { TmTree, TmTreeNode },
      template: `
        <TmTree default-expand-all>
          <TmTreeNode title="父节点" key="0-0">
            <TmTreeNode title="子节点" key="0-0-1" />
          </TmTreeNode>
        </TmTree>
      `,
    })
    expect(wrapper.text()).toContain('父节点')
    // 树默认折叠子级，default-expand-all 展开后子节点文本可见
    expect(wrapper.text()).toContain('子节点')
  })

  it('TmTypography 本体渲染 component 容器标签透传', () => {
    const wrapper = mount({
      components: { TmTypography },
      template: `<TmTypography component="article">正文内容</TmTypography>`,
    })
    expect(wrapper.find('article').exists()).toBe(true)
    expect(wrapper.text()).toContain('正文内容')
  })

  it('TmButtonGroup 组合渲染按钮组（相邻边框合并形态）', () => {
    const wrapper = mount({
      components: { TmButtonGroup, TmButton },
      template: `
        <TmButtonGroup>
          <TmButton>左</TmButton>
          <TmButton>右</TmButton>
        </TmButtonGroup>
      `,
    })
    expect(wrapper.find('.ant-btn-group').exists()).toBe(true)
    expect(wrapper.text()).toContain('左')
  })

  it('TmCompact 紧凑排布容器渲染', () => {
    const wrapper = mount({
      components: { TmCompact, TmButton },
      template: `
        <TmCompact>
          <TmButton>确认</TmButton>
          <TmButton>取消</TmButton>
        </TmCompact>
      `,
    })
    expect(wrapper.find('.ant-space-compact').exists()).toBe(true)
  })
})
