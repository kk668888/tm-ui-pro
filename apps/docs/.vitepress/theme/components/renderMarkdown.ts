// apps/docs/.vitepress/theme/components/renderMarkdown.ts
// API 表格单元格 markdown 渲染：vxe-grid 单元格默认纯文本，数据中的内联 markdown
// （反引号代码 / 粗体 / 链接 / 箭头等）会显示为字面字符。这里用 markdown-it 把
// 内联语法转 HTML，供 TmPropsTable / TmMethodsTable 的 cell slot 以 v-html 输出。
import MarkdownIt from 'markdown-it'

// html:false：不解析原始 HTML，文档数据即使含标签也按文本转义，避免注入
// linkify:true：纯 URL 自动识别为可点击链接
const md = new MarkdownIt({
  html: false,
  linkify: true,
})

/** 渲染内联 markdown 为 HTML 字符串（null/undefined 兜底为空串） */
export function renderInline(src: unknown): string {
  return md.renderInline(String(src ?? ''))
}
