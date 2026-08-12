# Alert 警告提示

基于 [ant-design-vue](https://www.antdv.com/components/alert) Alert 的薄封装，在保留全部 ant 原生 props / slots / events 的基础上，新增 `status`（业务语义枚举 → 语义类型映射），与 TmTag 共享同一套状态语义。

## 基础用法

四种状态提示 + 显式 `type` 覆盖。

<script setup>
import AlertDemo from '../../../packages/ui/src/components/alert/demos/basic.vue'
import AlertDemoCode from '../../../packages/ui/src/components/alert/demos/basic.vue?raw'

const alertProps = [
  { prop: 'status', desc: '状态枚举，映射为语义类型：`success`→成功 / `processing`→信息 / `failed`→错误 / `warning`→警告；显式 `type` 优先', type: 'StatusValue', default: '-' },
  { prop: 'type', desc: 'ant 原生语义类型（`success` / `info` / `warning` / `error`）；显式传值时优先于 `status`', type: 'string', default: 'info' },
  { prop: 'closable', desc: '是否可关闭', type: 'boolean', default: 'false' },
  { prop: 'showIcon', desc: '是否显示图标', type: 'boolean', default: 'false' },
  { prop: 'banner', desc: '是否作为顶部通告条', type: 'boolean', default: 'false' },
  { prop: 'message', desc: '提示内容（也可用 `message` 插槽）', type: 'VueNode', default: '-' },
  { prop: 'description', desc: '描述内容（也可用 `description` 插槽）', type: 'VueNode', default: '-' },
  { prop: 'onClose', desc: '关闭时触发的回调', type: '() => void', default: '-' },
]
</script>

<DemoBlock :code="AlertDemoCode">
  <AlertDemo />
</DemoBlock>

## API

### TmAlert Props

<TmPropsTable :data="alertProps" />
