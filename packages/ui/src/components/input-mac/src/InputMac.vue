<!-- packages/ui/src/components/input-mac/src/InputMac.vue -->
<!--
  TmInputMac：六段式 MAC 地址输入（segment 系第二个自研交互组件，内核复用 useSegmentedInput）

  与 TmInputIp 的差异仅在「格式规则 + 归一化时机」：
  1. 格式：segments=6 / maxLen=2 / 十六进制 0-9A-F（acceptChar+sanitize 保证）
  2. 实时大写：sanitize 内置 toUpperCase，段内输入 a-f 即时显示 A-F（方案 D_MAC4）
  3. blur 归一化：失焦时非空单字符段补前导 0 + 兜底大写（normalize hook + normalizeSegments，D_MAC1/2）
     ——通过 relatedTarget 判断焦点是否完全离开外壳，段间跳转不触发归一
  4. separator 可配置（默认 ':'），组装/粘贴解析/显示共用（D_MAC5）
  5. v-model 契约：六段均已是规范形（2 位大写）时 emit 规范串；否则 emit ''（spec「v-model 值契约」）
  6. 视觉外壳完全自包含（同 input-ip D2：var(--ant-*, 默认值) + :focus-within + size/disabled/readonly/error）
-->
<script setup lang="ts">
import { computed, ref, useAttrs, useId } from 'vue'
import type { TmInputMacProps } from './props'
import { tmInputMacDefaults } from './defaults'
import { useFormContext } from '../../form/src/composables/useFormContext'
import { useSegmentedInput } from '../../../composables/useSegmentedInput'

defineOptions({ name: 'TmInputMac', inheritAttrs: false })

const props = withDefaults(defineProps<TmInputMacProps>(), {
  modelValue: '',
  size: tmInputMacDefaults.size,
  // undefined 显式兜底：与 TmInputIp 同坑——类型化 Boolean 未传会归一为 false，
  // 导致 `false ?? formContext?.disabled` 永不落空、TmForm 级联失效
  disabled: undefined,
  readonly: undefined,
  separator: tmInputMacDefaults.separator,
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
 * 分段内核接入（MAC 格式参数注入，D_MAC1/D_MAC4）：
 * - acceptChar/sanitize：只放行十六进制，sanitize 剥非 hex 并实时转大写
 * - validate：输入期接收校验（宽松 1-2 位）；isComplete 走 normalize 后的完成期判据
 * - normalize：blur 归一（补前导 0 + 兜底大写），由组件在真正失焦时调用 normalizeSegments()
 */
const si = useSegmentedInput({
  segments: 6,
  maxLen: 2,
  separator: props.separator,
  acceptChar: /^[0-9a-fA-F]$/,
  sanitize: (s: string) => s.replace(/[^0-9a-fA-F]/g, '').toUpperCase(),
  validate: (s: string) => /^[0-9A-F]{1,2}$/.test(s),
  normalize: (s: string) => s.toUpperCase().padStart(2, '0'),
  modelValue: () => props.modelValue ?? '',
  onUpdate: v => emit('update:modelValue', v),
})

/** 任一段非空且非法（如程序设值 "GG:..."）→ 外壳进入 error 视觉态（不 clamp，spec「error 态」） */
const hasError = computed(() => si.segErrors.value.some(Boolean))

/** 尺寸类：middle 无类（默认高 32），small/large 挂自备尺寸类 */
const sizeClass = computed(() =>
  props.size && props.size !== 'middle' ? `tm-input-mac-${props.size}` : '',
)

/** 错误描述节点 id（useId 保证多实例唯一），末段 aria-describedby 指向 */
const errorDescId = useId()
const attrs = useAttrs()
const ariaLabel = computed(() => (typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'MAC 地址'))

/** 外壳 DOM 引用：blur 归一用 relatedTarget 判断焦点是否完全离开组件 */
const rootEl = ref<HTMLElement | null>(null)

/**
 * 段 input blur：仅在焦点真正离开整个外壳时触发归一化（D_MAC2）。
 * 段间跳转（满段自动跳/方向键跨段）的 relatedTarget 指向组件内另一段 input → 跳过；
 * 焦点移到组件外（relatedTarget 为空或外壳外节点）→ 归一化补零 + 兜底大写
 */
function onSegmentBlur(e: FocusEvent): void {
  const related = e.relatedTarget
  if (related instanceof Node && rootEl.value?.contains(related)) return
  si.normalizeSegments()
}

/** 对外 ref 接口：focus 定位首个空段（全满则末段），blur 失焦（spec「焦点方法」） */
defineExpose({
  focus: si.focus,
  blur: si.blur,
})
</script>

<template>
  <!--
    外壳视觉：tm-input-mac 自含对齐 ant 主题的边框/圆角/底色等（见 <style>），
    focus 由 CSS :focus-within 驱动，hover/focus/error/disabled 优先级在 <style> 中叠加控制
  -->
  <div
    :ref="(el: unknown) => (rootEl = (el as HTMLElement | null))"
    :class="['tm-input-mac', sizeClass, isDisabled && 'tm-input-mac-disabled', hasError && 'tm-input-mac-error']"
    role="group"
    :aria-label="ariaLabel"
    :aria-invalid="hasError || undefined"
    v-bind="attrs"
  >
    <template v-for="i in 6" :key="i">
      <!-- 分隔符只在段与段之间渲染（i>1 前不渲染，避免开头多出一点） -->
      <span v-if="i > 1" class="tm-input-mac-sep" aria-hidden="true">{{ separator }}</span>
      <!-- 段 input：value 由内核段状态受控驱动；maxlength 与内核 maxLen 双保险 -->
      <input
        :ref="(el: unknown) => si.setSegmentRef(i - 1, el)"
        class="tm-input-mac-segment"
        :class="{ 'tm-input-mac-segment-error': si.segErrors.value[i - 1] }"
        :value="si.segValues[i - 1]"
        type="text"
        autocomplete="off"
        :maxlength="2"
        :disabled="isDisabled"
        :readonly="isReadonly"
        :aria-label="`第 ${i} 段`"
        :aria-invalid="si.segErrors.value[i - 1] || undefined"
        :aria-describedby="hasError && i === 6 ? errorDescId : undefined"
        @keydown="si.onSegmentKeydown(i - 1, $event)"
        @input="si.onSegmentInput(i - 1, $event)"
        @blur="onSegmentBlur"
        @compositionstart="si.onCompositionStart()"
        @compositionend="si.onCompositionEnd(i - 1, $event)"
        @paste="si.onSegmentPaste(i - 1, $event)"
      />
    </template>
    <!-- 错误描述节点：视觉隐藏但可被读屏读取（aria-describedby 目标不能 display:none） -->
    <span v-if="hasError" :id="errorDescId" class="tm-input-mac-sr-only" role="alert">
      MAC 地址格式不正确
    </span>
  </div>
</template>

<style scoped>
/* ── 外壳视觉：对齐 ant v5 Input（antd cssVar 变量 + ant 默认色值回退）── */
.tm-input-mac {
  /* ant token 变量映射（开启 ConfigProvider theme.cssVar 时跟随主题；否则回退 ant 默认值） */
  --tmm-border: var(--ant-color-border, #d9d9d9);
  --tmm-primary: var(--ant-color-primary, #1677ff);
  --tmm-primary-hover: var(--ant-color-primary-hover, #4096ff);
  --tmm-outline: var(--ant-color-primary-outline-bg, rgba(5, 145, 255, 0.1));
  --tmm-error: var(--ant-color-error, #ff4d4f);
  --tmm-error-hover: var(--ant-color-error-hover, #ff7875);
  --tmm-error-outline: var(--ant-color-error-outline-bg, rgba(255, 77, 79, 0.1));
  --tmm-bg: var(--ant-color-bg-container, #ffffff);
  --tmm-bg-disabled: var(--ant-color-bg-container-disabled, #f5f5f5);
  --tmm-text-disabled: var(--ant-color-text-disabled, rgba(0, 0, 0, 0.25));
  --tmm-radius: var(--ant-border-radius, 6px);

  display: inline-flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px; /* ant control-height 默认（middle） */
  padding: 0 11px; /* ant paddingInline（middle） */
  border: 1px solid var(--tmm-border);
  border-radius: var(--tmm-radius);
  background: var(--tmm-bg);
  transition: border-color 0.2s, box-shadow 0.2s;
}

/* 尺寸三档：高度/内边距对齐 ant control-height + paddingInline */
.tm-input-mac-sm {
  height: 24px;
  padding: 0 7px;
}

.tm-input-mac-lg {
  height: 40px;
  padding: 0 11px;
  font-size: 16px;
}

/* hover：边框高亮（ant colorPrimaryHover）；disabled 不响应 */
.tm-input-mac:hover:not(.tm-input-mac-disabled) {
  border-color: var(--tmm-primary-hover);
}

/* focus：CSS :focus-within 捕获任一内部段的聚焦，复刻 ant 输入框 focus 环 */
.tm-input-mac:focus-within:not(.tm-input-mac-disabled) {
  border-color: var(--tmm-primary);
  box-shadow: 0 0 0 2px var(--tmm-outline);
}

/* error 态：红框优先于 hover/focus 的默认蓝 */
.tm-input-mac-error,
.tm-input-mac-error:hover:not(.tm-input-mac-disabled),
.tm-input-mac-error:focus-within:not(.tm-input-mac-disabled) {
  border-color: var(--tmm-error);
}

.tm-input-mac-error:focus-within:not(.tm-input-mac-disabled) {
  box-shadow: 0 0 0 2px var(--tmm-error-outline);
}

/* disabled：置灰底色 + 弱化文字 + 禁止光标；取消 hover/focus 反馈 */
.tm-input-mac-disabled,
.tm-input-mac-disabled:hover,
.tm-input-mac-disabled:focus-within {
  border-color: var(--tmm-border);
  background: var(--tmm-bg-disabled);
  color: var(--tmm-text-disabled);
  cursor: not-allowed;
  box-shadow: none;
}

/* ── 内部段 —— 无边框透明体，颜色/字体继承外壳（disabled 置灰天然继承）── */
.tm-input-mac-segment {
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

/* 越界段（如程序设值 "GG"）：段内文字标红强调，外框同时挂 tm-input-mac-error */
.tm-input-mac-segment-error {
  color: var(--tmm-error);
}

/* 点分隔符：弱化色 + 不可选中，避免双击选中干扰 */
.tm-input-mac-sep {
  color: var(--ant-color-text-placeholder, rgba(0, 0, 0, 0.45));
  user-select: none;
  flex: none;
}

/* 视觉隐藏（仅供读屏）：保留布局流外的可访问性文本 */
.tm-input-mac-sr-only {
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