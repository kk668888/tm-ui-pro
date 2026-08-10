# Notification 通知提醒

`TmNotification` 是全局通知**命令式 API**（非组件），在任意位置调用即显示右上角通知卡片。有 `<TmApp>` 包裹时自动绑定 ConfigProvider 上下文，无则降级 ant 全局。

## 基础用法

点击按钮触发右上角通知（demo 依赖 `<TmApp>` 包裹绑定 ConfigProvider 上下文）。

<script setup>
import NotificationDemo from '../../../packages/ui/src/components/notification/demos/basic.vue'
import NotificationDemoCode from '../../../packages/ui/src/components/notification/demos/basic.vue?raw'

// 命令式调用示例（CodeBlock 默认折叠展示）
const notificationCode = `import { TmNotification } from '@tm/ui'

TmNotification.success({ message: '任务完成', description: '导出已就绪' })
TmNotification.error({ message: '任务失败', description: '请重试' })
TmNotification.warning({ message: '磁盘不足', description: '已使用 90%' })
TmNotification.info({ message: '系统升级', description: '今晚 02:00-04:00' })`
</script>

<DemoBlock :code="NotificationDemoCode">
  <NotificationDemo />
</DemoBlock>

<CodeBlock :code="notificationCode" />

## 关闭

各方法返回销毁函数，可提前关闭（调用 `close()`）。

## API

### TmNotification 方法

| 方法 | 说明 |
| --- | --- |
| `success(args)` | 成功通知，`args: { message, description, duration, ... }` |
| `info(args)` | 信息通知 |
| `warning(args)` | 警告通知 |
| `error(args)` | 错误通知 |

### 行为

- 有 `<TmApp>`：用绑定 ConfigProvider 上下文的实例（主题 / locale 跟随）
- 无 `<TmApp>`：降级 ant 全局 notification（功能可用、主题不跟随、不抛错）
