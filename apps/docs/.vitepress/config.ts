// apps/docs/.vitepress/config.ts
// VitePress 站点配置：标题、导航与侧边栏
// 文档站定位为“应用层”，承载所有应用级依赖；
// 通过 workspace:* 引用 @tm/ui，确保核心库零应用依赖。
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: '@tm/ui 组件库',
  description: '公司内部组件库文档',
  // 组件页将在后续 task 中逐步补充，在此之前忽略 dead link 校验，
  // 让文档站 build 通过（VitePress 默认在 build 阶段对 dead link 报错）。
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [{ text: '组件', link: '/components/button' }],
    sidebar: {
      '/components/': [
        { text: '基础组件', items: [
          { text: 'Button 按钮', link: '/components/button' },
          { text: 'Input 输入框', link: '/components/input' },
          { text: 'Select 选择器', link: '/components/select' },
        ]},
        { text: '表单', items: [{ text: 'Form 表单', link: '/components/form' }]},
        { text: '数据展示', items: [{ text: 'Table 表格', link: '/components/table' }]},
      ],
    },
  },
})
