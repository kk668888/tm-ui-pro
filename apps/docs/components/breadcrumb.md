# Breadcrumb 面包屑

基于 [ant-design-vue](https://www.antdv.com/components/breadcrumb-cn) Breadcrumb 的薄封装。导出 `TmBreadcrumb` / `TmBreadcrumbItem` / `TmBreadcrumbSeparator`，保留 ant 全部能力，无公司扩展键。

## 何时使用

- 页面层级导航，展示当前位置路径。
- 需要自定义分隔符或 itemRender 的场景。

## 基础用法

默认分隔符 + 自定义 `separator`。

<script setup>
import BreadcrumbDemo from '../../../packages/ui/src/components/breadcrumb/demos/basic.vue'
import BreadcrumbDemoCode from '../../../packages/ui/src/components/breadcrumb/demos/basic.vue?raw'

const props = [
  {
    prop: 'separator',
    desc: '分隔符：默认 `/`，业务可传自定义字符',
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

## API

### 子组件映射

| Tm 组件 | 对应 ant |
| --- | --- |
| `TmBreadcrumb` | Breadcrumb |
| `TmBreadcrumbItem` | Breadcrumb.Item |
| `TmBreadcrumbSeparator` | Breadcrumb.Separator |

### TmBreadcrumb Props

<TmPropsTable :data="props" />

### Methods

业务侧通过 `ref` 可访问内部 ant Breadcrumb 实例（经 `useForwardRef` 透传）。
