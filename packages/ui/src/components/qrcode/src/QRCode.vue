<!-- packages/ui/src/components/qrcode/src/QRCode.vue -->
<!--
  TmQRCode 薄封装组件：ant QRCode 二维码
  核心机制：
  1. ant 原生透传：value / size / color / bgColor / icon / status / errorLevel 等原样下发
  2. 公司默认：无（ant 原生 size 等兜底）
  3. 动态插槽全透传（icon / default）+ useForwardRef 方法透传
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { QRCode as AQRCode } from 'ant-design-vue'
import type { TmQRCodeProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant QRCode 实例类型（ant 未导出 QRCodeInstance，用 InstanceType 推导） */
type QRCodeInstance = InstanceType<typeof AQRCode>

defineOptions({ name: 'TmQRCode', inheritAttrs: false })

/** 组件 props：TmQRCodeProps = QRCodeProps（无公司默认） */
const props = defineProps<TmQRCodeProps>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant QRCode 实例 */
const { innerRef, exposed } = useForwardRef<QRCodeInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props（幻影 false 跳过） */
const forwardBindings = useForwardBindings(props, [])
</script>

<template>
  <AQRCode ref="innerRef" v-bind="forwardBindings">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AQRCode>
</template>
