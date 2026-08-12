<!-- packages/ui/src/components/typography/demos/basic.vue -->
<!-- TmTypography 基础演示：标题 / 段落 / 文本 / 链接 -->
<script setup lang="ts">
import {
  TmTypographyTitle,
  TmTypographyParagraph,
  TmTypographyText,
  TmTypographyLink,
} from '../index'
</script>

<template>
  <div>
    <TmTypographyTitle :level="3">标题 Title level 3</TmTypographyTitle>
    <TmTypographyParagraph>段落 Paragraph：这是一段正文，用于展示基础排版。</TmTypographyParagraph>
    <p>
      <TmTypographyText>默认文本</TmTypographyText>
      &nbsp;
      <TmTypographyText type="secondary">次要文本</TmTypographyText>
      &nbsp;
      <TmTypographyText type="success">成功文本</TmTypographyText>
      &nbsp;
      <TmTypographyText code>code</TmTypographyText>
      &nbsp;
      <TmTypographyText mark>mark</TmTypographyText>
    </p>
    <p>
      <TmTypographyLink href="https://www.antdv.com" target="_blank">外部链接</TmTypographyLink>
    </p>
    <TmTypographyTitle :level="5">可复制标题</TmTypographyTitle>
    <TmTypographyTitle :level="5" copyable>点击复制我</TmTypographyTitle>
  </div>
</template>
