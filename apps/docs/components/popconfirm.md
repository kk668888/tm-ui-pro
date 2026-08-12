# Popconfirm 气泡确认框

基于 [ant-design-vue](https://www.antdv.com/components/popconfirm) Popconfirm 的薄封装，提供公司默认确认/取消文案与 `danger` 危险确认语义（对齐 TmButton 删除二次确认视觉），并保留全部 ant 原生 props / slots / events。

## 基础用法

默认文案、危险确认与显式文案覆盖。

<script setup>
import PopconfirmDemo from '../../../packages/ui/src/components/popconfirm/demos/basic.vue'
import PopconfirmDemoCode from '../../../packages/ui/src/components/popconfirm/demos/basic.vue?raw'

const popconfirmProps = [
  { prop: 'danger', desc: '危险确认：置位时确认按钮以危险语义（红色）渲染', type: 'boolean', default: '-' },
  { prop: 'okText', desc: '确认按钮文案（公司默认「确定」）', type: 'string', default: '确定' },
  { prop: 'cancelText', desc: '取消按钮文案（公司默认「取消」）', type: 'string', default: '取消' },
  { prop: 'title', desc: '确认框标题', type: 'VueNode', default: '-' },
  { prop: 'description', desc: '确认框描述', type: 'VueNode', default: '-' },
  { prop: 'placement', desc: '气泡弹出位置', type: 'string', default: 'top' },
  { prop: 'showCancel', desc: '是否显示取消按钮', type: 'boolean', default: 'true' },
  { prop: 'onConfirm', desc: '点击确认按钮触发的回调', type: '() => void', default: '-' },
  { prop: 'onCancel', desc: '点击取消按钮触发的回调', type: '() => void', default: '-' },
]
</script>

<DemoBlock :code="PopconfirmDemoCode">
  <PopconfirmDemo />
</DemoBlock>

## API

### TmPopconfirm Props

<TmPropsTable :data="popconfirmProps" />
