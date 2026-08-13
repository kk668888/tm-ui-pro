# FloatButton 浮动按钮

基于 [ant-design-vue](https://www.antdv.com/components/float-button-cn) FloatButton 的薄封装，含 `TmFloatButtonGroup` / `TmFloatButtonBackTop` 子组件。`TmFloatButtonBackTop` 承接 ant 5 移除的独立 `BackTop` 能力。无公司默认。

## 何时使用

- 悬浮操作入口（帮助 / 反馈 / 快捷操作）。
- 返回顶部能力（`TmFloatButtonBackTop`，替代 ant 5 已移除的独立 BackTop）。

## 基础用法

<script setup>
import FloatButtonDemo from '../../../packages/ui/src/components/float-button/demos/basic.vue'
import FloatButtonDemoCode from '../../../packages/ui/src/components/float-button/demos/basic.vue?raw'

const props = [
  { prop: 'icon / description', desc: '按钮图标 / 描述文案（可插槽传入）', type: 'VueNode | slot', default: '-' },
  { prop: 'shape', desc: '形状：circle（圆形） / square（方形）', type: "'circle' | 'square'", default: "'circle'" },
  { prop: 'type', desc: '类型：default / primary', type: "'default' | 'primary'", default: "'default'" },
  { prop: 'badge / tooltip', desc: '徽标 / 气泡提示（ant 原生）', type: 'FloatButtonProps', default: '-' },
  { prop: 'open', desc: '按钮组展开状态（TmFloatButtonGroup，v-model:open）', type: 'boolean', default: 'false' },
  { prop: 'target / visibilityHeight / duration', desc: '滚动容器 / 显示阈值 / 滚动时长（TmFloatButtonBackTop）', type: 'BackTopProps', default: '-' },
]
</script>

<DemoBlock :code="FloatButtonDemoCode">
  <FloatButtonDemo />
</DemoBlock>

### BackTop 迁移说明

ant-design-vue 5 移除独立 `BackTop` 组件，返回顶部能力由 `FloatButton.BackTop` 承接。业务从原 `BackTop`（或 `TmBackTop`，若存在）迁移：

- 将 `<BackTop />` 替换为 `<TmFloatButtonBackTop />`，props（`target` / `visibilityHeight` / `duration`）与事件（`click`）保持一致。
- 布局：`TmFloatButtonBackTop` 作为浮动按钮渲染在右下角，可通过 `style` 调整位置。

## API

### TmFloatButton / TmFloatButtonGroup / TmFloatButtonBackTop Props

<TmPropsTable :data="props" />

### 子组件

- `TmFloatButtonGroup`：浮动按钮组（展开收起 `open`，子项为 `TmFloatButton`）。
- `TmFloatButtonBackTop`：返回顶部浮动按钮（透传 `target` / `visibilityHeight` / `duration`）。

### Methods

业务侧通过 `ref` 可访问内部 ant FloatButton 实例（经 `useForwardRef` 透传）。
