# Tabs 标签页

基于 [ant-design-vue](https://www.antdv.com/components/tabs-cn) Tabs 的薄封装。导出 `TmTabs` / `TmTabPane`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 页面级标签导航，内容分区展示。
- 需要卡片式、可编辑、居中、受控激活等能力。

## 基础用法

基础标签 + 卡片式。

<script setup>
import TabsDemo from '../../../packages/ui/src/components/tabs/demos/basic.vue'
import TabsDemoCode from '../../../packages/ui/src/components/tabs/demos/basic.vue?raw'

const props = [
  {
    prop: 'type',
    desc: '标签类型：line / card / editable-card',
    type: 'string',
    default: 'line',
  },
  {
    prop: 'activeKey',
    desc: '受控激活标签（v-model:activeKey）',
    type: 'string',
    default: '-',
  },
  {
    prop: 'position / size / centered / destroyInactiveTabPane',
    desc: '位置 / 尺寸 / 居中 / 销毁非激活（ant 原生）',
    type: 'TabsProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="TabsDemoCode">
  <TabsDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmTabs` | Tabs |
| `TmTabPane` | Tabs.TabPane |

### TmTabs Props

<TmPropsTable :data="props" />

### TmTabPane Props

| 属性 | 说明 |
| --- | --- |
| `key` / `tab` / `disabled` / `closable` | 面板标识 / 标签文案 / 禁用 / 可关闭（ant 原生） |

### Methods

业务侧通过 `ref` 可访问内部 ant Tabs 实例（经 `useForwardRef` 透传）。
