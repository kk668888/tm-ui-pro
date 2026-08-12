# Popover 气泡卡片

基于 [ant-design-vue](https://www.antdv.com/components/popover) Popover 的薄封装，保留全部 ant 原生 props / slots / events，并显式兜底 `autoAdjustOverflow` 默认值（Boolean 陷阱）以还原 ant 默认自动调整语义。

## 基础用法

标题 + 内容 + 触发方式。

<script setup>
import PopoverDemo from '../../../packages/ui/src/components/popover/demos/basic.vue'
import PopoverDemoCode from '../../../packages/ui/src/components/popover/demos/basic.vue?raw'

const popoverProps = [
  { prop: 'title', desc: '卡片标题（也可用 `title` 插槽）', type: 'VueNode', default: '-' },
  { prop: 'content', desc: '卡片内容（也可用 `content` 插槽）', type: 'VueNode', default: '-' },
  { prop: 'trigger', desc: '触发方式（`hover` / `click` / `focus` / `contextmenu`）', type: 'string', default: 'hover' },
  { prop: 'placement', desc: '弹出位置', type: 'string', default: 'top' },
  { prop: 'autoAdjustOverflow', desc: '气泡是否随视口自动调整位置', type: 'boolean', default: 'true' },
  { prop: 'onOpenChange', desc: '打开/关闭状态变化回调', type: '(open: boolean) => void', default: '-' },
]
</script>

<DemoBlock :code="PopoverDemoCode">
  <PopoverDemo />
</DemoBlock>

## API

### TmPopover Props

<TmPropsTable :data="popoverProps" />
