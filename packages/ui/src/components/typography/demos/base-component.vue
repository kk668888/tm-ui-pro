<!-- packages/ui/src/components/typography/demos/base-component.vue -->
<!--
  TmTypography 本体（别名复用）详细演示：
  1. 本体作为容器承载排版子组件（与直接并列写子组件视觉一致）
  2. component 属性改写容器渲染标签（article / blockquote）
  说明：与原生 <a-typography> 是同一组件对象（别名复用），行为完全一致。
-->
<script setup lang="ts">
import {
  TmTypography,
  TmTypographyTitle,
  TmTypographyParagraph,
  TmTypographyText,
  TmTypographyLink,
} from '../index'
</script>

<template>
  <div>
    <b>本体作为容器承载排版子组件（默认渲染 div）</b>
    <TmTypography>
      <TmTypographyTitle :level="3">服务概览</TmTypographyTitle>
      <TmTypographyParagraph>
        这段正文由 TmTypography 本体作为容器承载，内部混排标题 / 正文 / 内联文本 / 链接。
      </TmTypographyParagraph>
      <TmTypographyText type="secondary">次要说明文本</TmTypographyText>
      <br />
      <TmTypographyLink href="https://www.antdv.com/components/typography-cn" target="_blank">
        查看 ant 排版文档
      </TmTypographyLink>
    </TmTypography>
  </div>

  <div>
    <b>component 改写容器标签（article / blockquote）</b>
    <TmTypography component="article">
      <TmTypographyParagraph>容器标签为 &lt;article&gt;，适合作为独立内容区块。</TmTypographyParagraph>
    </TmTypography>
    <TmTypography component="blockquote">
      <TmTypographyParagraph>容器标签为 &lt;blockquote&gt;，适合承载引用内容。</TmTypographyParagraph>
    </TmTypography>
  </div>
</template>
