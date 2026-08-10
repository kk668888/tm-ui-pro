<!-- packages/ui/src/components/app/src/AppContextHolder.vue -->
<!--
  AppContextHolder：在 ant <App> 内用 ant hooks 创建绑定 ConfigProvider 上下文的
  全局反馈实例，存到模块级 feedbackHolder，供 TmMessage/TmNotification/TmModal 命令式 API 消费。

  设计（design.md 决策 2）：
  - useMessage/useNotification/useModal 在组件树内调用，返回绑定当前 ConfigProvider 的实例
  - contextHolder 渲染到组件树内，反馈实际挂载点
  - setHolder 一次性捕获，命令式 API 读 getHolder()（无 TmApp 时降级 ant 全局）
-->
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { message as antMessage } from 'ant-design-vue'
import { notification as antNotification } from 'ant-design-vue'
import { Modal as antModal } from 'ant-design-vue'
import { setHolder, resetHolder, type FeedbackHolder } from '../../../utils/feedbackHolder'

// hooks 在 <App> 上下文内调用，拿到绑定 ConfigProvider locale/token 的实例
const [messageApi, messageContextHolder] = antMessage.useMessage()
const [notificationApi, notificationContextHolder] = antNotification.useNotification()
const [modalApi, modalContextHolder] = antModal.useModal()

// 一次性捕获到模块级 holder（业务在 TmApp 外任意位置调 TmMessage 即消费）
// useModal() 返回 Omit<ModalStaticFunctions<ModalFuncWithRef>,'warn'>，与 FeedbackHolder['modal']
// （ModalStaticFunctions）有 ref 泛型差异，cast 兼容（命令式方法签名一致）
setHolder({
  message: messageApi,
  notification: notificationApi,
  modal: modalApi as unknown as FeedbackHolder['modal'],
})

// TmApp 销毁时清空 holder，避免命令式 API 把消息渲染到已卸载的 contextHolder DOM
onUnmounted(() => resetHolder())
</script>

<template>
  <messageContextHolder />
  <notificationContextHolder />
  <modalContextHolder />
</template>
