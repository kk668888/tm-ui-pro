// apps/docs/.vitepress/theme/index.ts
// VitePress 自定义主题入口：扩展默认主题 + 作为 @tm/ui dts portability 真实消费验证入口
//
// 设计目的（T14 收口 5）：
// 文档站定位为「应用层」，是 @tm/ui 的首个真实消费方。本文件通过 import 主入口与子入口，
// 触发 VitePress build 编译链路对 @tm/ui 的运行时模块解析（vite resolve → 加载 es/index.js）
// 与类型链路（vue-tsc / IDE → 解析 es/index.d.ts）。任何残留的 node_modules 相对路径或传递
// 依赖无法解析都会在此处暴露，证明收口 1a/1b/2 的修复在真实消费侧生效。
//
// 验证范围：
//   1. import { TmButton, TmResolver } from '@tm/ui'        —— 主入口（含 TmResolver 类型脱钩验证）
//   2. import { TmTable } from '@tm/ui/table'               —— 子入口（多入口 exports 校对）
//   3. 注册到 app.config.globalProperties                    —— 引用 import 让 vite 不 tree-shake
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { TmButton, TmResolver } from '@tm/ui'
import { TmTable } from '@tm/ui/table'

/**
 * 自定义主题：扩展 VitePress 默认主题
 *
 * enhanceApp 钩子：在 Vue app 创建后注入 @tm/ui 成员引用，让 vitepress build 时
 * 必须真实加载 @tm/ui 的运行时与类型（避免因「未使用」被 tree-shake 跳过 dts portability 验证）。
 */
const theme: Theme = {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    // 把 TmButton / TmResolver / TmTable 挂到 globalProperties 作为消费探测点。
    // 这些成员不在文档站的 markdown 中实际渲染（避免污染页面），仅作为编译期 import 验证。
    app.config.globalProperties.$tmDtsProbe = {
      TmButton,
      TmResolver,
      TmTable,
    }
  },
}

export default theme
