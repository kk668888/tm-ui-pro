<!--
  CodeBlock.vue
  文档站可折叠代码块：命令式 API 文档（TmMessage/TmModal.confirm 等）的调用示例用
  本组件折叠展示（默认收起，点击展开 + 语法高亮 + 一键复制）。
  复用 DemoBlock 的代码区能力，独立组件便于在 md 中直接使用。

  使用方式（markdown 内）：
  ```vue
  <script setup>
  const code = `TmMessage.success('保存成功')`
  </script>
  <CodeBlock :code="code" />
  ```
-->
<script setup lang="ts">
import { computed, ref } from 'vue'
import hljs from 'highlight.js'

/** Props：code 代码字符串；language 高亮语言（默认 typescript） */
const props = defineProps<{ code: string; language?: string }>()

// 折叠状态：默认收起
const showCode = ref(false)

// 复制成功反馈（短暂显示「已复制」后复位）
const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | undefined

/** 语法高亮 HTML（hljs 转义 HTML，v-html 渲染安全——源码受控） */
const highlighted = computed<string>(() =>
  hljs.highlight(props.code, { language: props.language ?? 'ts', ignoreIllegals: true }).value,
)

/** 一键复制：clipboard API + 成功反馈；不可用时静默降级 */
const copyCode = async (): Promise<void> => {
  try {
    await navigator.clipboard.writeText(props.code)
    copied.value = true
    clearTimeout(copyTimer)
    copyTimer = setTimeout(() => (copied.value = false), 1500)
  } catch {
    // clipboard 不可用（非安全上下文）时静默降级
  }
}
</script>

<template>
  <div class="code-block">
    <div class="code-block__header">
      <span class="code-block__label">代码示例</span>
      <span class="code-block__actions">
        <a-button size="small" type="text" @click="showCode = !showCode">
          {{ showCode ? '收起代码' : '显示代码' }}
        </a-button>
        <a-button v-if="showCode" size="small" type="text" @click="copyCode">
          {{ copied ? '已复制' : '复制' }}
        </a-button>
      </span>
    </div>
    <pre v-if="showCode" class="code-block__code"><code v-html="highlighted"></code></pre>
  </div>
</template>

<style scoped>
.code-block {
  border: 1px solid var(--vp-c-border);
  border-radius: 8px;
  margin: 16px 0;
  overflow: hidden;
  background: var(--vp-c-bg);
}

.code-block__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 12px;
  min-height: 40px;
  border-bottom: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.code-block__label {
  font-size: 13px;
  color: var(--vp-c-text-2);
}

.code-block__actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.code-block__code {
  margin: 0;
  padding: 16px;
  max-height: 320px;
  overflow: auto;
  font-size: 13px;
  line-height: 1.6;
  font-family: var(--vp-font-family-mono);
  color: var(--vp-c-text-1);
  white-space: pre;
}
</style>

<!-- 语法高亮 token 配色（hljs 类名，非 scoped），与 DemoBlock 共用 -->
<style>
.code-block .hljs-keyword,
.code-block .hljs-selector-tag,
.code-block .hljs-subst { color: #cf222e; }

.code-block .hljs-string,
.code-block .hljs-regexp { color: #0a3069; }

.code-block .hljs-comment,
.code-block .hljs-quote { color: #6e7781; }

.code-block .hljs-attr,
.code-block .hljs-attribute { color: #0550ae; }

.code-block .hljs-title,
.code-block .hljs-title.function_,
.code-block .hljs-built_in { color: #8250df; }

.code-block .hljs-number,
.code-block .hljs-literal { color: #0550ae; }

.code-block .hljs-type { color: #116329; }

.dark .code-block .hljs-keyword,
.dark .code-block .hljs-selector-tag,
.dark .code-block .hljs-subst { color: #ff7b72; }

.dark .code-block .hljs-string,
.dark .code-block .hljs-regexp { color: #a5d6ff; }

.dark .code-block .hljs-comment,
.dark .code-block .hljs-quote { color: #8b949e; }

.dark .code-block .hljs-attr,
.dark .code-block .hljs-attribute { color: #79c0ff; }

.dark .code-block .hljs-title,
.dark .code-block .hljs-title.function_,
.dark .code-block .hljs-built_in { color: #d2a8ff; }

.dark .code-block .hljs-number,
.dark .code-block .hljs-literal { color: #79c0ff; }

.dark .code-block .hljs-type { color: #7ee787; }
</style>
