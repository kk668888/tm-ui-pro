# Badge 徽标

基于 [ant-design-vue](https://www.antdv.com/components/badge-cn) Badge 的薄封装。保留全部 ant 原生 props / slots / events，无公司扩展键，纯透传。

## 何时使用

- 数字角标（未读消息、待办数量等）、状态点（在线/离线）等场景。

## 基础用法

`count` / `overflowCount` / `status` 原生透传。

<script setup>
import BadgeDemo from '../../../packages/ui/src/components/badge/demos/basic.vue'
import BadgeDemoCode from '../../../packages/ui/src/components/badge/demos/basic.vue?raw'

const badgeProps = [
  {
    prop: 'count',
    desc: '展示的数字或文本',
    type: 'number | string',
    default: '-',
  },
  {
    prop: 'overflowCount',
    desc: '超过该值显示 `count+`',
    type: 'number',
    default: '99',
  },
  {
    prop: 'status',
    desc: '状态点（success / processing / default / error / warning）',
    type: 'string',
    default: '-',
  },
  {
    prop: '其余属性',
    desc: '透传 ant Badge 全部 props / slots / events（如 `dot` / `showZero` / default 包裹内容 / count 插槽）',
    type: 'BadgeProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="BadgeDemoCode">
  <BadgeDemo />
</DemoBlock>

## API

### TmBadge Props

<TmPropsTable :data="badgeProps" />

### TmBadge Types

- `TmBadgeProps = BadgeProps`（ant 原生）
- `BadgeProps` 可直接从 `@kibus/tm-ui-plus` 导入。
