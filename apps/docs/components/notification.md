# Notification 通知提醒

`TmNotification` 是全局通知**命令式 API**（非组件），在任意位置调用即显示右上角通知卡片。有 `<TmApp>` 包裹时自动绑定 ConfigProvider 上下文，无则降级 ant 全局。

## 基础用法

点击按钮触发右上角通知（demo 依赖 `<TmApp>` 包裹绑定 ConfigProvider 上下文）。

<script setup>
import NotificationDemo from '../../../packages/ui/src/components/notification/demos/basic.vue'
import NotificationDemoCode from '../../../packages/ui/src/components/notification/demos/basic.vue?raw'

// 命令式 API 方法表格数据（TmMethodsTable 渲染，替代手写 markdown 表格）
const notificationMethods = [
  { method: 'success(args)', desc: '成功通知，args 支持 message / description / duration 等', returns: 'close: () => void' },
  { method: 'info(args)', desc: '信息通知', returns: 'close: () => void' },
  { method: 'warning(args)', desc: '警告通知', returns: 'close: () => void' },
  { method: 'error(args)', desc: '错误通知', returns: 'close: () => void' },
]
</script>

<DemoBlock :code="NotificationDemoCode">
  <NotificationDemo />
</DemoBlock>
## 关闭

各方法返回销毁函数，可提前关闭（调用 `close()`）。

## API

### TmNotification 方法

<TmMethodsTable :data="notificationMethods" />

### 行为

- 有 `<TmApp>`：用绑定 ConfigProvider 上下文的实例（主题 / locale 跟随）
- 无 `<TmApp>`：降级 ant 全局 notification（功能可用、主题不跟随、不抛错）

