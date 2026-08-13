# Skeleton 骨架屏

基于 [ant-design-vue](https://www.antdv.com/components/skeleton-cn) Skeleton 的薄封装，含 `TmSkeletonAvatar` / `TmSkeletonImage` / `TmSkeletonInput` / `TmSkeletonButton` 子组件。无公司默认（ant 原生骨架占位兜底）。

## 何时使用

- 页面 / 区块内容加载时的骨架占位。
- 需要与加载态联动、切换真实内容的场景。

## 基础用法

<script setup>
import SkeletonDemo from '../../../packages/ui/src/components/skeleton/demos/basic.vue'
import SkeletonDemoCode from '../../../packages/ui/src/components/skeleton/demos/basic.vue?raw'

const props = [
  { prop: 'loading', desc: '是否显示骨架（false 时渲染默认插槽的真实内容）', type: 'boolean', default: 'true' },
  { prop: 'active', desc: '是否显示骨架动画', type: 'boolean', default: 'false' },
  { prop: 'avatar', desc: '是否显示头像占位（或头像配置）', type: 'boolean | SkeletonAvatarProps', default: 'false' },
  { prop: 'title / paragraph', desc: '标题 / 段落占位配置', type: 'boolean | SkeletonTitleProps | SkeletonParagraphProps', default: '-' },
  { prop: 'round', desc: '是否显示圆角占位', type: 'boolean', default: 'false' },
  { prop: 'default', desc: '加载完成后的真实内容（loading=false 时渲染）', type: 'slot', default: '-' },
]
</script>

<DemoBlock :code="SkeletonDemoCode">
  <SkeletonDemo />
</DemoBlock>

### 子组件

- `TmSkeletonAvatar`：骨架头像占位（`size` / `shape`）。
- `TmSkeletonImage`：骨架图片占位。
- `TmSkeletonInput`：骨架输入框占位（`size`）。
- `TmSkeletonButton`：骨架按钮占位（`size` / `shape` / `block`）。

## API

### TmSkeleton Props

<TmPropsTable :data="props" />

### 子组件 Props

`TmSkeletonAvatar` / `TmSkeletonImage` / `TmSkeletonInput` / `TmSkeletonButton` 分别透传 ant `SkeletonAvatarProps` / `SkeletonImageProps` / `SkeletonInputProps` / `SkeletonButtonProps`。

### Methods

业务侧通过 `ref` 可访问内部 ant Skeleton 实例（经 `useForwardRef` 透传）。
