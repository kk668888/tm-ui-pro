# Breadcrumb 面包屑

基于 [ant-design-vue](https://www.antdv.com/components/breadcrumb-cn) Breadcrumb 的薄封装。导出 `TmBreadcrumb` / `TmBreadcrumbItem` / `TmBreadcrumbSeparator`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 页面层级导航，展示当前位置路径。
- 需要自定义分隔符或 itemRender 的场景。

## 基础用法

默认分隔符 + 自定义 `separator`。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
// ?raw 取源码字符串传给 DemoBlock 做代码折叠展示
import BreadcrumbDemo from '../../../packages/ui/src/components/breadcrumb/demos/basic.vue'
import BreadcrumbDemoCode from '../../../packages/ui/src/components/breadcrumb/demos/basic.vue?raw'
import BreadcrumbSepDemo from '../../../packages/ui/src/components/breadcrumb/demos/separator.vue'
import BreadcrumbSepDemoCode from '../../../packages/ui/src/components/breadcrumb/demos/separator.vue?raw'

// TmPropsTable 数据：TmBreadcrumb Props 表格（数据驱动渲染）
const props = [
  {
    prop: 'separator',
    desc: '分隔符：默认 `/`，业务可传自定义字符；**传空串 `""` 可关闭子项自带分隔符**，交由 `TmBreadcrumbSeparator` 逐段声明',
    type: 'string | VNode',
    default: '/',
  },
  {
    prop: 'routes / params / itemRender',
    desc: 'ant 原生：路由配置与自定义渲染',
    type: 'BreadcrumbProps',
    default: '-',
  },
]
</script>

<DemoBlock :code="BreadcrumbDemoCode">
  <BreadcrumbDemo />
</DemoBlock>

## 分隔符自定义

两种可控写法，下面的卡片里能直接看到差别：

1. **容器级 `separator`**：全局替换分隔符（最常用）。
2. **`separator=""` + 显式 `TmBreadcrumbSeparator`**：逐段声明，分隔符内容可以是任意节点（如带颜色的图标）。

> **两个实测坑（ant-design-vue 4.2.6，别再踩）**
>
> - **Item 级 `separator=">"` 无效**：Breadcrumb 会用容器的 `separator` 经 `cloneVNode` 覆盖子项的同名属性，写 `>` 仍显示默认 `/`。要改就用容器级。
> - **单独放 `TmBreadcrumbSeparator` 会重复渲染**：子项自身已经渲染了一个分隔符，此时显式分隔符成了「额外」的第二个。必须同时把容器 `separator` 置为空串，子项才不再渲染自带的那个。

<DemoBlock :code="BreadcrumbSepDemoCode">
  <BreadcrumbSepDemo />
</DemoBlock>

## API

### 子组件映射

| Tm 组件 | 对应 ant | 说明 |
| --- | --- | --- |
| `TmBreadcrumb` | Breadcrumb | 容器：`separator` / `routes` / `itemRender` |
| `TmBreadcrumbItem` | Breadcrumb.Item | 单个层级（`href` / 默认插槽为文案） |
| `TmBreadcrumbSeparator` | Breadcrumb.Separator | 独立分隔符节点：配合容器 `separator=""` 逐段自定义（见上一节） |

### TmBreadcrumb Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Breadcrumb 实例（经 `useForwardRef` 透传）。
