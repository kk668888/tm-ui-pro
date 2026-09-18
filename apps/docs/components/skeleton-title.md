# SkeletonTitle 骨架标题条

Skeleton 骨架屏的库内别名：骨架占位的标题条。与原生 `<a-skeleton-title>` **完全等价**——`withInstall` 别名复用让两者是同一个组件对象，行为与原生写法一致。

## 何时使用

- **自定义骨架组合**：`TmSkeleton` 的内置布局不满足需求时，用 `TmSkeletonTitle` 搭配其它骨架子组件（`TmSkeletonAvatar` / `TmSkeletonButton` …）自行拼装骨架。
- 需要单独控制标题条宽度（`width`）时。

> **视觉前置条件**：标题条的骨架底色来自 ant 骨架容器样式，**独立渲染时只有结构、没有底色**。自定义组合时请放进骨架容器结构内（demo 已演示两种形态的差异）。

## 基础用法

`width` 接受数字（px）或百分比字符串。demo 第 1 例展示容器内的正确视觉，第 2 例展示独立渲染时的纯结构形态。

<script setup>
// 直接 import packages/ui 的 demo 源文件，确保文档与组件库 demo 同步
import SkeletonTitleDemo from '../../../packages/ui/src/components/skeleton/demos/title.vue'
import SkeletonTitleDemoCode from '../../../packages/ui/src/components/skeleton/demos/title.vue?raw'

// TmPropsTable 数据：TmSkeletonTitle Props 表格（ant 原生 API）
const skeletonTitleProps = [
  {
    prop: 'width',
    desc: '标题条宽度：数字按 px，字符串支持百分比（如 `\'60%\'`）',
    type: 'number | string',
    default: '-',
  },
]
</script>

<DemoBlock :code="SkeletonTitleDemoCode">
  <SkeletonTitleDemo />
</DemoBlock>

## API

### TmSkeletonTitle Props

<TmPropsTable :data="skeletonTitleProps" />

### 与 TmSkeleton 子组件的分工

| 组件 | 说明 |
| --- | --- |
| `TmSkeleton` | 骨架容器（`loading` / `avatar` / `title` / `paragraph` 一站式） |
| `TmSkeletonTitle` | 仅标题条，供自定义组合 |
| `TmSkeletonAvatar` / `TmSkeletonImage` / `TmSkeletonInput` / `TmSkeletonButton` | 头像 / 图片 / 输入框 / 按钮占位（见 [Skeleton 页](./skeleton)) |

### 其余能力

透传 ant 原生全部 props / slots / events，无公司扩展键、无公司默认值；完整清单见 [ant-design-vue Skeleton 文档](https://www.antdv.com/components/skeleton-cn)。
