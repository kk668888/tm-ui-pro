<!-- packages/ui/src/components/breadcrumb/demos/separator.vue -->
<!--
  TmBreadcrumbSeparator 详细演示：分隔符的两种可控写法

  实测要点（ant-design-vue 4.2.6，勿凭直觉猜）：
  1. 容器级 `separator` 属性/slot 是**全局**替换分隔符的正道——Breadcrumb 会把该值
     cloneVNode 注入每个子项，各子项各自渲染一次分隔符。
  2. **Item 级 `separator=">"` 属性无效**：Breadcrumb 在 cloneVNode 时用容器的
     separator 覆盖了子项自身的同名属性，写 `>` 仍显示默认 `/`。
  3. 单独放 `<TmBreadcrumbSeparator>` 子节点会与子项自带的分隔符**重复渲染**
     （页面里出现两个分隔符）。要逐段自定义，必须同时把容器 separator 置空串
     `separator=""`——空串为假值，子项不再渲染自带分隔符，只留显式声明的那些。
-->
<script setup lang="ts">
import { TmBreadcrumb, TmBreadcrumbItem, TmBreadcrumbSeparator } from '../index'
</script>

<template>
  <div>
    <b>容器级 separator（全局替换，最常用）</b>
    <TmBreadcrumb separator="→">
      <TmBreadcrumbItem>首页</TmBreadcrumbItem>
      <TmBreadcrumbItem>订单管理</TmBreadcrumbItem>
      <TmBreadcrumbItem>订单详情</TmBreadcrumbItem>
    </TmBreadcrumb>
  </div>

  <div>
    <b>separator="" + 显式 TmBreadcrumbSeparator（逐段自定义）</b>
    <TmBreadcrumb separator="">
      <TmBreadcrumbItem>首页</TmBreadcrumbItem>
      <TmBreadcrumbSeparator>:</TmBreadcrumbSeparator>
      <TmBreadcrumbItem>订单管理</TmBreadcrumbItem>
      <!-- 分隔符内容可以是任意节点，如带样式的图标 -->
      <TmBreadcrumbSeparator>
        <span style="color: #d4380d">|</span>
      </TmBreadcrumbSeparator>
      <TmBreadcrumbItem>订单详情</TmBreadcrumbItem>
    </TmBreadcrumb>
  </div>
</template>
