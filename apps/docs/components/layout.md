# Layout 布局

基于 [ant-design-vue](https://www.antdv.com/components/layout-cn) Layout 的薄封装。导出 `TmLayout` / `TmSider` / `TmHeader` / `TmContent` / `TmFooter` 五子组件，保留 ant 布局骨架全部能力（含可折叠侧边栏），无公司扩展键。

## 何时使用

- 搭建页面整体骨架：顶部导航 + 内容区 + 页脚。
- 侧边栏布局（菜单 + 主区），含折叠 / 断点自动折叠能力。

## 基础用法

标准页骨架 + 侧边栏布局。

<script setup>
import LayoutDemo from '../../../packages/ui/src/components/layout/demos/basic.vue'
import LayoutDemoCode from '../../../packages/ui/src/components/layout/demos/basic.vue?raw'

const layoutProps = [
  {
    prop: 'hasSider',
    desc: '容器内是否含侧边栏（决定子布局渲染结构）',
    type: 'boolean',
    default: '-',
  },
]

const siderProps = [
  {
    prop: 'collapsible / collapsed',
    desc: '是否可折叠 + 当前折叠态',
    type: 'boolean',
    default: '-',
  },
  {
    prop: 'breakpoint',
    desc: '断点自动折叠（如 `lg`）',
    type: 'xs | sm | md | lg | xl | xxl',
    default: '-',
  },
  {
    prop: 'width / collapsedWidth / theme',
    desc: '宽度 / 折叠宽度 / 主题（light | dark）',
    type: 'SiderProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="LayoutDemoCode">
  <LayoutDemo />
</DemoBlock>

## API

### TmLayout / TmSider / TmHeader / TmContent / TmFooter

| 组件 | 对应 ant | 说明 |
| --- | --- | --- |
| `TmLayout` | Layout | 布局容器（`hasSider`） |
| `TmSider` | Layout.Sider | 侧边栏 |
| `TmHeader` | Layout.Header | 顶部区域 |
| `TmContent` | Layout.Content | 内容区域 |
| `TmFooter` | Layout.Footer | 页脚区域 |

### TmLayout Props

<TmPropsTable :data="layoutProps" />

### TmSider Props

<TmPropsTable :data="siderProps" />

其余属性透传 ant Layout / Layout.Sider 全部 props / slots / events。

### Methods

业务侧通过 `ref` 可访问内部 ant Layout 各实例（经 `useForwardRef` 透传）。
