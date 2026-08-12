# PageHeader 页头

基于 [ant-design-vue](https://www.antdv.com/components/page-header-cn) PageHeader 的薄封装。保留 ant 全部能力，无公司扩展键。

> 注：ant PageHeader 在 React antd 5 中已废弃，ant-design-vue 4.2.6 仍提供；本组件为全覆盖保留，新页面可用 Layout + Typography 组合替代。

## 何时使用

- 页面顶部标题区：标题 + 副标题 + 返回 + 操作区。
- 需要 `tags` / `avatar` / `extra` 等区块。

## 基础用法

标题 + 副标题 + 操作区。

<script setup>
import PageHeaderDemo from '../../../packages/ui/src/components/page-header/demos/basic.vue'
import PageHeaderDemoCode from '../../../packages/ui/src/components/page-header/demos/basic.vue?raw'

const props = [
  {
    prop: 'title / subTitle',
    desc: '主标题 / 副标题',
    type: 'string | VNode',
    default: '-',
  },
  {
    prop: 'backIcon',
    desc: '返回图标：默认显示，传 `false` 隐藏',
    type: 'VNode | boolean',
    default: 'true',
  },
  {
    prop: 'tags / extra / avatar',
    desc: '标签 / 操作区 / 头像（ant 原生）',
    type: 'PageHeaderProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="PageHeaderDemoCode">
  <PageHeaderDemo />
</DemoBlock>

## API

### TmPageHeader Props

<TmPropsTable :data="props" />

### TmPageHeader Slots

| 名称 | 说明 |
| --- | --- |
| `default` | 页头下方内容区 |
| `title` / `subTitle` / `tags` / `extra` / `avatar` / `backIcon` | 各区块插槽（透传 ant） |

### TmPageHeader Events

| 事件 | 说明 |
| --- | --- |
| `back` | 点击返回区域时触发（透传 ant） |

### Methods

业务侧通过 `ref` 可访问内部 ant PageHeader 实例（经 `useForwardRef` 透传）。
