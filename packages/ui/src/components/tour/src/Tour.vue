<!-- packages/ui/src/components/tour/src/Tour.vue -->
<!--
  TmTour 薄封装组件：ant Tour 引导
  核心机制：
  1. ant 原生透传：open / current / steps / mask / placement / arrow 等原样下发。
     注意：未传 open 时 ant 非受控默认打开（mergedOpen 兜底 true），业务需显式
     open=false 或 v-model:open 控制
  2. 公司默认：无（ant 原生遮罩与步骤兜底）
  3. 关闭桥接：ant Tour（4.2.6）关闭/完成只调用 onClose / onFinish 回调、不发射
     update:open 事件，TmTour 将两者桥接为 update:open=false，业务仅需 v-model:open
     即可开合；onClose / onFinish 从透传对象剔除，避免与桥接合并成数组监听器。
     注意：onClose / onFinish 在 ant TourProps 中声明为 prop，与本组件 emits 的
     close / finish 同名共存——模板 @close 走 ant prop 通道，业务 @close 监听依赖
     emit 经 vnode.props 查询单次触发（无数组合并）
  4. 动态插槽透传 + useForwardRef 方法透传
     —— 仅 ant 实际消费的插槽生效（indicatorsRender 等），其余静默忽略；
     open 缺省不形成受控幻影 false（useForwardBindings 跳过缺省值）
-->
<script setup lang="ts">
import { useSlots } from 'vue'
import { Tour as ATour } from 'ant-design-vue'
import type { TmTourProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Tour 实例类型（用 InstanceType 推导） */
type TourInstance = InstanceType<typeof ATour>

defineOptions({ name: 'TmTour', inheritAttrs: false })

/** 组件 props：TmTourProps = TourProps（无公司默认） */
const props = defineProps<TmTourProps>()

/** 事件：关闭/完成桥接为 update:open（ant 不发射，需手动闭合 v-model）+ 透传 close / finish */
const emit = defineEmits<{
  (e: 'update:open', v: boolean): void
  (e: 'close', current: number): void
  (e: 'finish'): void
}>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Tour 实例 */
const { innerRef, exposed } = useForwardRef<TourInstance>()
defineExpose(exposed)

/** 透传对象：$attrs + 业务显式 props；剔除 onClose / onFinish 由模板桥接独占
 * （否则业务监听器会与桥接合并成数组，ant 内部 onClose?.() 调用崩溃） */
const forwardBindings = useForwardBindings(props, [], ['onClose', 'onFinish'])

/** ant 关闭回调桥接：置业务 open=false 并透传 close（参数为当前步骤索引） */
const onCloseBridge = (current: number) => {
  emit('update:open', false)
  emit('close', current)
}

/** ant 完成回调桥接：置业务 open=false 并透传 finish */
const onFinishBridge = () => {
  emit('update:open', false)
  emit('finish')
}
</script>

<template>
  <ATour ref="innerRef" v-bind="forwardBindings" @close="onCloseBridge" @finish="onFinishBridge">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </ATour>
</template>
