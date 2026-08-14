<!-- eslint-disable vue/no-v-html -- 受信内容渲染：md 源码经 markdown-it 编译（html 已转义） -->
<!--
  DemoBlock.vue
  文档站 demo 容器（Bug 1 自建方案 + 代码折叠增强）：
  - 预览区：默认 slot 接收真实可交互的 Vue 组件（由 markdown 的 <script setup> import + 渲染）
  - 代码区：接收 `code` prop（md 中 `import Demo from '...?raw'` 取源码字符串），
    默认折叠，提供「显示代码 / 收起」切换 + 一键复制按钮
  - 不依赖任何第三方 demo 插件，样式用 VitePress CSS 变量跟随明暗主题

  使用方式（markdown 内）：
  ```vue
  <script setup>
  import Demo from '../../../packages/ui/src/components/button/demos/basic.vue'
  import DemoCode from '../../../packages/ui/src/components/button/demos/basic.vue?raw'
  </script>

  <DemoBlock :code="DemoCode">
    <Demo />
  </DemoBlock>
  ```
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import hljs from 'highlight.js'

/**
 * Props：
 * - code: demo 源码字符串（?raw import），传入后在代码区可折叠展示与复制
 */
const props = defineProps<{ code?: string }>()

// 代码区折叠状态：默认收起（SSR 首渲染与客户端一致，无 hydration 闪烁）
const showCode = ref(false)

// 复制成功反馈（短暂显示「已复制」后复位）
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

/**
 * 语法高亮 HTML：用 docs 已依赖的 highlight.js 对源码做高亮。
 * demo 为 .vue SFC，用 xml 语言可高亮 template 标签；script 的 JS 会部分高亮。
 * hljs.highlight 转义 HTML，v-html 渲染安全（源码受控）。
 */
const highlightedCode = computed<string>(() => {
  if (!props.code) return ''
  return hljs.highlight(props.code, { language: 'xml', ignoreIllegals: true }).value
})

/** 一键复制源码：clipboard API + 成功反馈；不可用时静默降级 */
const copyCode = async (): Promise<void> => {
  if (!props.code) return
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard 不可用（非安全上下文）时静默降级，按钮不报错
  }
}
</script>

<template>
  <div class="demo-block">
    <div class="demo-block__preview">
      <slot />
    </div>

    <div class="demo-block__footer">
      <span class="demo-block__desc"><slot name="desc" /></span>
      <span class="demo-block__actions">
        <a-button size="small" type="text" @click="showCode = !showCode">
          {{ showCode ? '收起代码' : '显示代码' }}
        </a-button>
        <a-button v-if="showCode" size="small" type="text" @click="copyCode">
          {{ copied ? '已复制' : '复制源码' }}
        </a-button>
      </span>
    </div>

    <pre v-if="showCode" class="demo-block__code">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <code v-html="highlightedCode"></code>
    </pre>
  </div>
</template>

<style scoped>
/* 容器：边框 + 圆角 + 间距，颜色用 VitePress CSS 变量跟随主题 */
.demo-block {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
  background: var(--vp-c-bg);
}

/* 渲染区：内边距给组件呼吸空间，flex 便于横向并排按钮等 */
.demo-block__preview {
  padding: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  align-items: center;
}

/* 底部工具条：折叠切换 + 复制按钮 */
.demo-block__footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  min-height: 40px;
}

.demo-block__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* 代码区：滚动 + 等宽字体，背景与 VitePress 代码块一致 */
.demo-block__code {
  margin: 0;
  padding: 16px;
  max-height: 320px;
  overflow: auto;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
  font-size: 13px;
  line-height: 1.6;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  white-space: pre;
}
</style>

<!--
  语法高亮 token 配色（highlight.js 类名，非 scoped——hljs 输出的是全局类）
  明暗两套，跟随 VitePress 主题：默认浅色 / html.dark 深色
  色值对齐 hljs github / github-dark 主题
-->
<style>
.hljs-keyword,
.hljs-selector-tag,
.hljs-subst { color: #cf222e; }

.hljs-string,
.hljs-regexp { color: #0a3069; }

.hljs-comment,
.hljs-quote { color: #6e7781; }

.hljs-attr,
.hljs-attribute { color: #0550ae; }

.hljs-tag,
.hljs-name { color: #22863a; }

.hljs-title,
.hljs-title.function_,
.hljs-function .hljs-title,
.hljs-built_in { color: #8250df; }

.hljs-number,
.hljs-literal,
.hljs-symbol { color: #0550ae; }

.hljs-variable,
.hljs-template-variable { color: #953800; }

.hljs-type { color: #116329; }

.dark .hljs-keyword,
.dark .hljs-selector-tag,
.dark .hljs-subst { color: #ff7b72; }

.dark .hljs-string,
.dark .hljs-regexp { color: #a5d6ff; }

.dark .hljs-comment,
.dark .hljs-quote { color: #8b949e; }

.dark .hljs-attr,
.dark .hljs-attribute { color: #79c0ff; }

.dark .hljs-tag,
.dark .hljs-name { color: #7ee787; }

.dark .hljs-title,
.dark .hljs-title.function_,
.dark .hljs-function .hljs-title,
.dark .hljs-built_in { color: #d2a8ff; }

.dark .hljs-number,
.dark .hljs-literal,
.dark .hljs-symbol { color: #79c0ff; }

.dark .hljs-variable,
.dark .hljs-template-variable { color: #ffa657; }

.dark .hljs-type { color: #7ee787; }
</style>
