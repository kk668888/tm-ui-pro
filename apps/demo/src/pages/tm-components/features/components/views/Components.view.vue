<script setup lang="ts">
import GeneralSection from '../General.section.vue';
import FormSection from '../Form.section.vue';
import DataDisplaySection from '../DataDisplay.section.vue';
import FeedbackSection from '../Feedback.section.vue';
import ConfigSection from '../Config.section.vue';

defineOptions({ name: 'ComponentsView' });
</script>

<template>
  <div class="tm-components-page flex flex-col gap-6 lg:gap-8">
    <!-- 页头说明使用语义色，随亮 / 暗主题自动适配 -->
    <div
      class="flex flex-wrap items-start justify-between gap-6 rounded-lg border border-light bg-[var(--bg-container)] p-6"
    >
      <div class="min-w-0">
        <h2 class="m-0 mb-3 text-2xl font-bold text-title">TM 组件</h2>
        <p class="m-0 text-sm leading-relaxed text-secondary">
          集中陈列 <code>@kibus/tm-ui-plus</code> 全部组件：通用 / 表单 / 数据展示 / 反馈 / 全局配置。
          核心组件带交互示例；亮暗主题由顶栏切换器统一联动。
        </p>
      </div>
    </div>
    <GeneralSection />
    <FormSection />
    <DataDisplaySection />
    <FeedbackSection />
    <ConfigSection />
  </div>
</template>
