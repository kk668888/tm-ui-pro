<!-- packages/ui/src/components/app/demos/basic.vue -->
<!--
  TmApp 详细演示：全局命令式反馈（TmMessage / TmModal.confirm）的上下文桥接

  说明：
  - TmApp 自身无可见输出（渲染反馈 holder 挂载点 + 业务子树），所以演示重点在
    「包裹后命令式 API 生效」：点击按钮弹出消息 / 确认框，样式与主题跟随
    ConfigProvider（文档站已由主题层注入 ant 与 Tm 的全局注册）。
  - 业务根组件应按「TmConfigProvider > TmApp > 业务内容」的层级包裹，
    才能让 message / notification / modal 拿到 locale 与 token。
-->
<script setup lang="ts">
import { TmApp } from '../index'
import { TmButton } from '../../button'
import { TmMessage } from '../../message'
import { TmModal } from '../../modal'

/** 全局提示：绑定 TmApp 捕获的上下文实例 */
function showSuccess(): void {
  TmMessage.success('已保存，命令式提示由 TmApp 桥接上下文')
}

/** 命令式确认框：同样消费 TmApp 的 holder */
function showConfirm(): void {
  TmModal.confirm({
    title: '确认删除该条记录？',
    content: '删除后不可恢复，请确认。',
    okText: '删除',
    okType: 'danger',
    cancelText: '取消',
    onOk: () => TmMessage.info('已删除'),
  })
}
</script>

<template>
  <TmApp>
    <div>
      <b>包裹在 TmApp 内的命令式反馈</b>
      <TmButton type="primary" @click="showSuccess">弹出全局提示</TmButton>
      <TmButton danger style="margin-left: 8px" @click="showConfirm">弹出确认框</TmButton>
    </div>
  </TmApp>
</template>
