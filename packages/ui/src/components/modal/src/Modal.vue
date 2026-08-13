<!-- packages/ui/src/components/modal/src/Modal.vue -->
<!--
  TmModal 组件式薄封装：ant Modal + v-model:open 桥接
  核心机制：
  1. v-model 桥接：业务 modelValue ↔ ant Modal 的 open（v-model:open="inner"）
  2. 陷阱剥离：visible（deprecated Boolean，类型化 defineProps 默认 false 会锁死）、
     open/onUpdate:open（v-model 单点写入的数值通道）从透传对象剔除
  3. ant 原生透传：title/width/footer/confirmLoading 等 + 插槽全透传
  4. $attrs 合并 + useForwardRef 方法透传
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Modal as AModal } from 'ant-design-vue'
import type { TmModalProps } from './props'
import { useForwardRef } from '../../../composables/useForwardRef'
import { useForwardBindings } from '../../../composables/useForwardBindings'

/** ant Modal 实例类型（ant 未导出 ModalInstance，用 InstanceType 推导） */
type ModalInstance = InstanceType<typeof AModal>

defineOptions({ name: 'TmModal', inheritAttrs: false })

/** 组件 props：TmModalProps = ModalProps（ant 原生）+ { modelValue? }
 * closable/mask/maskClosable/keyboard 显式兜底 true（2026-08-10 / 2026-08-12）：
 * ant ModalProps 的这四个 Boolean 属性默认启用（keyboard 默认 Esc 关闭），类型化
 * defineProps 会把未传时默认成 false（Boolean 陷阱）→ 关闭 X 图标与遮罩消失、
 * 键盘 Esc 无法关闭。必须 withDefaults 显式兜底；业务显式传 false 仍可覆盖 */
const props = withDefaults(defineProps<TmModalProps>(), {
  modelValue: undefined,
  closable: true,
  mask: true,
  maskClosable: true,
  keyboard: true,
})

/** v-model 桥接事件：computed setter 在 v-model:open 中转换发回 */
const emit = defineEmits<{
  (e: 'update:modelValue', v: boolean): void
}>()

// slot keys 快照（mount 后稳定，无需响应式）
const slotNames = Object.keys(useSlots()) as string[]

/** 方法透传：父组件 ref 可直接访问内部 ant Modal 实例 */
const { innerRef, exposed } = useForwardRef<ModalInstance>()
defineExpose(exposed)

/**
 * 扩展属性剥离：
 * - modelValue：公司扩展键，ant 不识别，必须剔除
 * - visible：ant deprecated Boolean prop（默认 undefined），类型化 defineProps 默认成 false，
 *   传给 ant 会锁死弹窗——必须剥离（2026-08-10 同类陷阱）
 * - open/onUpdate:open：v-model:open="inner" 单点写入的数值通道，必须剥离避免冲突
 */
const antProps = computed(() => {
  const {
    modelValue: _mv,
    visible: _v,
    open: _o,
    'onUpdate:open': _uo,
    ...rest
  } = props
  return rest
})

/** 透传对象：$attrs + 业务显式 props + 公司默认（closable/mask/maskClosable/keyboard 兜底，见 useForwardBindings） */
const forwardBindings = useForwardBindings(antProps, ['closable', 'mask', 'maskClosable', 'keyboard'])

/** v-model 双向桥接：modelValue ↔ ant open（computed get/set） */
const inner = computed<boolean>({
  get: () => props.modelValue ?? false,
  set: (v: boolean) => emit('update:modelValue', v),
})
</script>

<template>
  <AModal ref="innerRef" v-bind="forwardBindings" v-model:open="inner">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AModal>
</template>
