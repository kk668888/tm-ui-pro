<!-- packages/ui/src/components/button/src/Button.vue -->
<!--
  TmButton 范本组件：M3 首个薄封装组件，作为后续 Input/Select/Form/Table 的模板参照
  核心机制（全部在本文件验证）：
  1. Props/类型透传：defineProps<TmButtonProps>() 接收 ant 原生 + 公司扩展
  2. $attrs + emits 透传：inheritAttrs:false + v-bind="$attrs"，事件经 defineEmits 透传
  3. 插槽透传：v-for $slots 动态转发全部插槽
  4. 扩展 props 剥离：antProps computed 解构剥离扩展属性，只把 ant 认识的属性绑给内部按钮
  5. 行为扩展：useDebounceClick 实现 click 防抖
  6. 结构扩展：confirm 模式下用 Popconfirm 包裹
-->
<script setup lang="ts">
import { computed, useSlots } from 'vue'
import { Button as AButton, Popconfirm } from 'ant-design-vue'
import type { TmButtonProps } from './props'
import { tmButtonDefaults } from './defaults'
import { useForwardBindings } from '../../../composables/useForwardBindings'
import { useDebounceClick } from './composables/useDebounceClick'

// name 用于全局注册与 devtools 识别；inheritAttrs:false 关闭自动透传，改为手动 $attrs 绑定
defineOptions({ name: 'TmButton', inheritAttrs: false })

// 类型透传：TmButtonProps = ButtonProps & TmButtonExtProps
// withDefaults 仅对公司默认值（type / debounce）兜底，其余 ant 默认保持原样
const props = withDefaults(defineProps<TmButtonProps>(), {
  type: tmButtonDefaults.type,
  debounce: tmButtonDefaults.debounce,
  confirm: undefined,
})

// click 事件透传：业务方仍按原生 click 监听
const emit = defineEmits<{ (e: 'click', ev: MouseEvent): void }>()

// 行为扩展：防抖点击（未配置时零开销透传）
const { onClick } = useDebounceClick(props, emit)

// slot keys 显式抽出并断言为 string[]：让 vue-tsc/vite:dts 双路径对 v-for + 动态 #[name]
// 不再触发 TS7022 circular inference（T14 收口 2）。
// useSlots() 拿到响应式 slots 对象；Object.keys 一次性快照（slot 集合在 mount 后稳定，无需响应式）。
const slotNames = Object.keys(useSlots()) as string[]

// ★ 扩展属性剥离：从 props 中解构出 debounce/confirm/onClick，剩余 rest 即 ant 认识的原生属性
// 这样内部 AButton 不会收到 ant 不识别的 props 而产生 console warning
// 解构出的扩展属性用不到，重命名为 _d/_c/_oc 下划线前缀以标记「故意未使用」
//
// onClick 剥离（2026-08-10 修复）：模板 `<AButton @click="onClick">`（useDebounceClick 防抖）是
// click 唯一入口——它 emit('click') 触发 props.onClick（业务 @click）。若 onClick 同时透传到
// forwardBindings，AButton 会收到两个 onClick（透传的 props.onClick + 模板防抖），点击触发 2 次
// 业务回调（一次直接调 props.onClick，一次经防抖 emit 再调 props.onClick）。
const antProps = computed(() => {
  const { debounce: _d, confirm: _c, onClick: _oc, ...rest } = props
  return rest
})

/** 透传对象：$attrs + 业务显式 props + 公司默认 type（幻影 false 跳过，见 useForwardBindings）
 * onClick 由 antProps 剥离（模板 @click="onClick" 防抖是 click 唯一入口，避免双触发） */
const forwardBindings = useForwardBindings(antProps, ['type'])
</script>

<template>
  <!-- 结构扩展：confirm 模式下用 Popconfirm 包裹；@confirm 透传到 onClick 走防抖链路 -->
  <Popconfirm v-if="props.confirm" :title="props.confirm" @confirm="(e) => onClick(e as MouseEvent)">
    <AButton v-bind="forwardBindings">
      <!--
        slot 全透传：用 Object.keys($slots) 迭代字符串键
        （避免 v-for="(_, name) in $slots" 触发 vue-tsc TS7022 circular inference）
      -->
      <template v-for="name in slotNames" :key="name" #[name]="slotData">
        <slot :name="name" v-bind="slotData ?? {}" />
      </template>
    </AButton>
  </Popconfirm>

  <!-- 无 confirm：原生能力仍 100% 透传 -->
  <AButton v-else v-bind="forwardBindings" @click="onClick">
    <template v-for="name in slotNames" :key="name" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </AButton>
</template>
