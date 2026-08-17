<!-- packages/ui/src/components/input-ip/src/InputIp.vue -->
<!--
  TmInputIp：四段式 IPv4 地址输入（库内第一个自研交互组件，非 ant 薄封装）

  架构（见 openspec add-input-ip design.md）：
  1. 分段内核：useSegmentedInput 承载全部段状态机（跳段/回跳/拦截/兜底/粘贴分发/受控回写），
     本组件只做渲染接线 + FormContext 级联 + emit 桥接
  2. 视觉外壳：完全自包含，不复用 ant-input 类名。
     【教训 2026-08-17】antd v5 样式按「组件实例」经 cssinjs 动态注入，.ant-input 类的边框等
     样式只有在真的渲染 <AntInput> 时才存在；TmInputIp 内部是纯原生 input，无 ant 组件实例，
     挂 .ant-input 类名不会得到任何样式（demo 里其他组件正常是因为它们渲染了 ant 实例）。
     因此本组件自带对齐 ant 主题的完整视觉：底色/边框/圆角/hover/focus 环/disabled/error/size，
     颜色优先取 antd CSS 变量（消费方开启 ConfigProvider theme.cssVar 时跟随主题），回退 ant 默认色值。
  3. v-model 契约：四段齐且全合法 → emit 点分串（前导零按原文）；否则 emit ''
  4. ARIA：单一逻辑字段拆四个物理 input，根节点 role=group + 逐段 aria-label 补齐可访问性
-->
<script setup lang="ts">
import { computed, useAttrs, useId } from 'vue'
import type { TmInputIpProps } from './props'
import { tmInputIpDefaults } from './defaults'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { useSegmentedInput } from '../../../composables/useSegmentedInput'

defineOptions({ name: 'TmInputIp', inheritAttrs: false })

const props = withDefaults(defineProps<TmInputIpProps>(), {
  modelValue: '',
  size: tmInputIpDefaults.size,
  // undefined 显式兜底：类型化 defineProps 会把 Boolean 未传归一为 false，
  // 导致 `false ?? formContext?.disabled` 永不落空、TmForm 级联失效（与 TmInput 同坑）
  disabled: undefined,
  readonly: undefined,
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
}>()

/** 注入祖先 TmForm 联动上下文（无祖先时 undefined，独立使用不受影响） */
const formContext = useFormContext()

/** 级联合成：业务显式传优先，未传级联 TmForm，皆无则默认可编辑 */
const isDisabled = computed(() => props.disabled ?? formContext?.value?.disabled ?? false)
const isReadonly = computed(() => props.readonly ?? formContext?.value?.readonly ?? false)

/**
 * 分段内核接入（IPv4 格式参数注入）：
 * - acceptChar/sanitize 保证只进数字；validate 保证每段 0-255（1-3 位数字）
 * - onUpdate 即 v-model 桥接：内核已按「未齐 → ''」契约收敛，组件层直发
 */
const si = useSegmentedInput({
  segments: 4,
  maxLen: 3,
  separator: '.',
  acceptChar: /^[0-9]$/,
  sanitize: (s: string) => s.replace(/\D/g, ''),
  validate: (s: string) => /^[0-9]{1,3}$/.test(s) && Number(s) <= 255,
  modelValue: () => props.modelValue ?? '',
  onUpdate: v => emit('update:modelValue', v),
})

/** 任一段非空且非法（如程序设值 999）→ 外壳进入 error 视觉态（不 clamp，spec「初始非法值展示」） */
const hasError = computed(() => si.segErrors.value.some(Boolean))

/** 尺寸类：middle 无类（默认高 32），small/large 挂自备尺寸类 */
const sizeClass = computed(() =>
  props.size && props.size !== 'middle' ? `tm-input-ip-${props.size}` : '',
)

/** 错误描述节点 id（useId 保证多实例唯一），末段 aria-describedby 指向（D6） */
const errorDescId = useId()
const attrs = useAttrs()
const ariaLabel = computed(() => (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'IP 地址'))

/** 对外 ref 接口：focus 定位首个空段（全满则末段），blur 失焦（spec「焦点方法」） */
defineExpose({
  focus: si.focus,
  blur: si.blur,
})
</script>

<template>
  <!--
    外壳视觉：tm-input-ip 自带对齐 ant 主题的边框/圆角/底色等（见 <style>），
    关键非视觉职责：focus 态由 CSS :focus-within 驱动（无需 JS 状态类），
    hover/focus/error/disabled 优先级在 <style> 中通过状态类叠加控制
  -->
  <div
    :class="['tm-input-ip', sizeClass, isDisabled && 'tm-input-ip-disabled', hasError && 'tm-input-ip-error']"
    role="group"
    :aria-label="ariaLabel"
    :aria-invalid="hasError || undefined"
    v-bind="attrs"
  >
    <template v-for="i in 4" :key="i">
      <!-- 分隔符只在段与段之间渲染（i>1 前不渲染，避免开头多出一点） -->
      <span v-if="i > 1" class="tm-input-ip-sep" aria-hidden="true">.</span>
      <!-- 段 input：value 由内核段状态受控驱动；只读走原生 readonly；maxlength 与内核 maxLen 双保险 -->
      <input
        :ref="(el: unknown) => si.setSegmentRef(i - 1, el)"
        class="tm-input-ip-segment"
        :class="{ 'tm-input-ip-segment-error': si.segErrors.value[i - 1] }"
        :value="si.segValues[i - 1]"
        type="text"
        inputmode="numeric"
        autocomplete="off"
        :maxlength="3"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :aria-label="`第 ${i} 段`"
        :aria-invalid="si.segErrors.value[i - 1] || undefined"
        :aria-describedby="hasError && i === 4 ? errorDescId : undefined"
        @keydown="si.onSegmentKeydown(i - 1, $event)"
        @input="si.onSegmentInput(i - 1, $event)"
        @compositionstart="si.onCompositionStart()"
        @compositionend="si.onCompositionEnd(i - 1, $event)"
        @paste="si.onSegmentPaste(i - 1, $event)"
      />
    </template>
    <!-- 错误描述节点：视觉隐藏但可被读屏读取（aria-describedby 目标不能 display:none） -->
    <span v-if="hasError" :id="errorDescId" class="tm-input-ip-sr-only" role="alert">
      IP 地址格式不正确
    </span>
  </div>
</template>

<style scoped>
/* ── 外壳视觉：对齐 ant v5 Input（antd cssVar 变量 + ant 默认色值回退）── */
.tm-input-ip {
  /* ant token 变量映射（开启 ConfigProvider theme.cssVar 时跟随主题；否则回退 ant 默认值） */
  --tip-border: var(--ant-color-border, #d9d9d9);
  --tip-primary: var(--ant-color-primary, #1677ff);
  --tip-primary-hover: var(--ant-color-primary-hover, #4096ff);
  --tip-outline: var(--ant-color-primary-outline-bg, rgba(5, 145, 255, 0.1));
  --tip-error: var(--ant-color-error, #ff4d4f);
  --tip-error-hover: var(--ant-color-error-hover, #ff7875);
  --tip-error-outline: var(--ant-color-error-outline-bg, rgba(255, 77, 79, 0.1));
  --tip-bg: var(--ant-color-bg-container, #ffffff);
  --tip-bg-disabled: var(--ant-color-bg-container-disabled, #f5f5f5);
  --tip-text-disabled: var(--ant-color-text-disabled, rgba(0, 0, 0, 0.25));
  --tip-radius: var(--ant-border-radius, 6px);

  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px; /* ant control-height 默认（middle） */
  padding: 0 11px; /* ant paddingInline（middle） */
  border: 1px solid var(--tip-border);
  border-radius: var(--tip-radius);
  background: var(--tip-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

/* 尺寸三档：高度/内边距对齐 ant control-height + paddingInline */
.tm-input-ip-sm {
  height: 24px;
  padding: 0 7px;
}

.tm-input-ip-lg {
  height: 40px;
  padding: 0 11px;
  font-size: 16px;
}

/* hover：边框高亮（ant colorPrimaryHover）；disabled 不响应 */
.tm-input-ip:hover:not(.tm-input-ip-disabled) {
  border-color: var(--tip-primary-hover);
}

/* focus：CSS :focus-within 捕获任一内部段的聚焦，复刻 ant 输入框 focus 环 */
.tm-input-ip:focus-within:not(.tm-input-ip-disabled) {
  border-color: var(--tip-primary);
  box-shadow: 0 0 0 2px var(--tip-outline);
}

/* error 态：红框优先于 hover/focus 的默认蓝 */
.tm-input-ip-error,
.tm-input-ip-error:hover:not(.tm-input-ip-disabled),
.tm-input-ip-error:focus-within:not(.tm-input-ip-disabled) {
  border-color: var(--tip-error);
}

.tm-input-ip-error:focus-within:not(.tm-input-ip-disabled) {
  box-shadow: 0 0 0 2px var(--tip-error-outline);
}

/* disabled：置灰底色 + 弱化文字 + 禁止光标；取消 hover/focus 反馈 */
.tm-input-ip-disabled,
.tm-input-ip-disabled:hover,
.tm-input-ip-disabled:focus-within {
  border-color: var(--tip-border);
  background: var(--tip-bg-disabled);
  color: var(--tip-text-disabled);
  cursor: not-allowed;
  box-shadow: none;
}

/* ── 内部段 —— 无边框透明体，颜色/字体继承外壳（disabled 置灰天然继承）── */
.tm-input-ip-segment {
  flex: 1 1 0;
  min-width: 0;
  padding: 0;
  border: none;
  outline: none;
  background: transparent;
  color: inherit;
  font: inherit;
  text-align: center;
  cursor: inherit;
}

/* 越界段（如程序设值 999）：段内文字标红强调，外框同时挂 tm-input-ip-error */
.tm-input-ip-segment-error {
  color: var(--tip-error);
}

/* 点分隔符：弱化色 + 不可选中，避免双击选中干扰 */
.tm-input-ip-sep {
  color: var(--ant-color-text-placeholder, rgba(0, 0, 0, 0.45));
  user-select: none;
  flex: none;
}

/* 视觉隐藏（仅供读屏）：保留布局流外的可访问性文本 */
.tm-input-ip-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}
</style>