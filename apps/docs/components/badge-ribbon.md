# BadgeRibbon 缎带徽标

Badge 徽标的库内别名：把插槽内容包进带缎带角标的容器。与原生 `<a-badge-ribbon>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- 卡片/图片/模块需要角标提示（推荐、已上线、内测等）。
- 需要角标位于容器四角之一（`placement`）或自定义底色（`color`）。

## 基础用法

`text` 指定角标文案，默认贴在右上角；`placement="start"` 贴左上角，`color` 自定义缎带底色。插槽内容即被包裹的容器。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import BadgeRibbonDemo from '../../../packages/ui/src/components/badge/demos/ribbon.vue'
import BadgeRibbonDemoCode from '../../../packages/ui/src/components/badge/demos/ribbon.vue?raw'

// TmPropsTable 数据：TmBadgeRibbon Props 表格（ant 原生 API）
const badgeRibbonProps = [
  {
    prop: 'text',
    desc: '缎带文案（也可传节点）',
    type: 'string | VNode',
    default: '-',
  },
  {
    prop: 'placement',
    desc: '缎带位置：`end` 右上角 / `start` 左上角',
    type: "'start' | 'end'",
    default: "'end'",
  },
  {
    prop: 'color',
    desc: '缎带底色：预设色名（如 `pink` / `red` / `green`）走 ant 预设样式，其它值按自定义色值生效',
    type: 'string',
    default: '-（未传走 ant 默认缎带样式）',
  },
  {
    prop: '默认插槽',
    desc: '被缎带包裹的内容容器',
    type: 'slot',
    default: '-',
  },
]
</script>

<DemoBlock :code="BadgeRibbonDemoCode">
  <BadgeRibbonDemo />
</DemoBlock>

## API

### TmBadgeRibbon Props

<TmPropsTable :data="badgeRibbonProps" />

### TmBadgeRibbon Slots

| 插槽 | 说明 |
| --- | --- |
| `default` | 被包裹的容器内容 |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Badge.Ribbon 文档](https://www.antdv.com/components/badge-cn)。
