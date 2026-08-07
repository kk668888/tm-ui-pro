<!--
  apps/docs/.vitepress/theme/Layout.vue
  自定义 Layout：TmConfigProvider + ant StyleProvider 包裹 VitePress 默认主题

  背景（2026-08-06 bug 修复）：
  ant-design-vue 4.x 组件样式为 cssinjs 运行时注入，默认 hashPriority = 'low'，
  生成 `:where(.ant-input)` 选择器 —— `:where()` 优先级恒为 0。
  而 VitePress 默认主题 base.css 自带 `button,input,optgroup,select,textarea{border:0;padding:0}`（优先级 0,0,1），
  于是 input / select 的边框与内边距被 reset 覆盖，表现成「没有 antd 样式」。

  修复：hash-priority="high" 让 antd 生成 `.ant-input.css-hash`（优先级 0,0,2），
  高于 reset 的元素选择器（0,0,1），且运行时注入位置在 head 末尾晚于静态 <link>，
  antd 组件样式得以正常生效。这是 ant-design-vue 官方推荐的 cssinjs 覆盖优先级方案。

  外层 TmConfigProvider：
  - 提供 ant ConfigProvider 上下文：默认 locale=zh_CN，让全站 ant 组件（分页器 / 日期选择器 / 空态等）显示中文
  - 注入 ant token → vxe CSS 变量桥接，与 TmTable demo 的视觉联动保持一致
-->
<script setup lang="ts">
import DefaultTheme from 'vitepress/theme'
import { StyleProvider as AStyleProvider } from 'ant-design-vue'
import { TmConfigProvider } from '@tm/ui'

// 取出 VitePress 默认主题的 Layout 组件，在本层包裹后原样透传
const { Layout: DefaultLayout } = DefaultTheme
</script>

<template>
  <TmConfigProvider>
    <AStyleProvider hash-priority="high">
      <DefaultLayout />
    </AStyleProvider>
  </TmConfigProvider>
</template>
