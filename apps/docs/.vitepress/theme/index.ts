// apps/docs/.vitepress/theme/index.ts
// VitePress 自定义主题入口：扩展默认主题 + 真正注册 ant / vxe / @tm/ui
//
// 设计变更（Task 15 / Bug 3 收口）：
// Task 14 时本文件作为 @tm/ui dts portability 真实消费验证入口，仅把 TmButton /
// TmResolver / TmTable 挂到 globalProperties 作为「编译期 import 探针」（$tmDtsProbe），
// 不在页面真正渲染。Task 15 创建的各组件文档页通过 `<script setup>` 直接渲染 <TmXxx>
// demo，必须真正注册组件，故升级为「全量应用层注册」：
//   1. ant-design-vue：app.use(Antd)（ant 4.x 默认 export 是含 install 的插件对象）
//   2. vxe-pc-ui：app.use(VxeUIPCUI)（默认 export 是含 install 的 namespace，
//      注册 VxeButton/VxeInput/VxeSelect/VxeForm/VxeTooltip 等 PC UI 组件）
//   3. vxe-table：app.use(VxeUITable)（默认 export 含 install，注册
//      VxeTable/VxeColumn/VxeColgroup/VxeGrid/VxeToolbar —— TmTable demo 必需）
//      —— 收口 T11 deferred d：vxe-pc-ui 在文档站全量注册，消除运行时 console.warn
//   4. @tm/ui：app.use(install)（聚合 install，与业务方 app.use(@tm/ui) 一致，
//      一次性注册 TmButton/TmInput/TmSelect/TmForm/TmFormItem/TmTable）
//   5. 自建 DemoBlock：轻量 demo 容器（Bug 1 自建方案，零第三方 demo 插件依赖）
//
// 全量 CSS 引入：ant reset + vxe-pc-ui + vxe-table（保证 demo 视觉与生产一致）。
import type { Theme } from 'vitepress'
import DefaultTheme from 'vitepress/theme'

// 应用层依赖：ant + vxe + @tm/ui（与 packages/ui 业务方用法一致）
import Antd from 'ant-design-vue'
import VxeUIPCUI from 'vxe-pc-ui'
import VxeUITable from 'vxe-table'
// @tm/ui 的聚合 install：app.use(install) 一次性注册全部 Tm 组件
// （注意：这里 import 自 @tm/ui 主入口，走 packages/ui/package.json exports 的 dist，
//  与业务方一致；不直接 import 源码，避免与 packages/ui 的内部 import 混淆。）
import { install as tmInstall } from '@tm/ui'

// 自定义 demo 容器组件
import DemoBlock from './components/DemoBlock.vue'
// 自定义 API 表格组件（内部用 TmTable 渲染组件 Props）
import TmPropsTable from './components/TmPropsTable.vue'
// 自定义 Layout：用 ant cssinjs StyleProvider(hash-priority="high") 包裹默认主题，
// 修复 antd 4 默认 :where() 低优先级样式被 VitePress 主题 reset 覆盖的问题（2026-08-06）
import Layout from './Layout.vue'

// 全量样式：ant reset + vxe 主题（vxe-pc-ui 必须 + vxe-table 必须）
import 'ant-design-vue/dist/reset.css'
import 'vxe-pc-ui/lib/style.css'
import 'vxe-table/lib/style.css'
// 文档站布局微调：主内容区左右两侧只保留 100px 间距（2026-08-06）
import './custom.css'

/**
 * 自定义主题：扩展 VitePress 默认主题
 *
 * enhanceApp 钩子：在 Vue app 创建后注入全部运行时依赖，让 markdown 中的
 * `<TmButton>` / `<TmTable>` demo 能真实可交互渲染（不只是编译期 import）。
 */
const theme: Theme = {
  extends: DefaultTheme,
  // 覆盖默认 Layout：StyleProvider(hash-priority="high") 提升 antd 组件样式优先级，
  // 否则 antd 4 的 :where() 低优先级样式会被 VitePress 主题 reset 的 input{border:0;padding:0} 覆盖
  Layout,
  enhanceApp({ app }) {
    // 1) ant-design-vue：demo 内可能用到 a-button / a-form / a-input 等基础 ant 组件
    app.use(Antd)
    // 2) vxe-pc-ui：TmTable 内 vxe-grid 在 render 时会校验 VxeUI 注册表
    //    （pager、tooltip、input 等子组件依赖），未注册会 console.warn
    app.use(VxeUIPCUI)
    // 3) vxe-table：注册 VxeGrid / VxeTable / VxeColumn / VxeToolbar（TmTable 直接依赖）
    app.use(VxeUITable)
    // 4) @tm/ui：聚合 install，全量注册 Tm 组件（与业务方 app.use(@tm/ui) 一致）
    app.use(tmInstall)
    // 5) 自定义容器组件（markdown demo 用 <DemoBlock> 包裹）
    app.component('DemoBlock', DemoBlock)
    // 6) 自定义 API 表格（<TmPropsTable>，数据驱动渲染组件 Props）
    app.component('TmPropsTable', TmPropsTable)
  },
}

export default theme
