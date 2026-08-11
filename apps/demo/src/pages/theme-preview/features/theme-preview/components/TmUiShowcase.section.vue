<script setup lang="ts">
import { ref } from 'vue';
import { TmButton, TmInput, TmSelect, TmTag } from '@tm/ui';

defineOptions({ name: 'TmUiShowcaseSection' });

interface TmSelectOption {
  label: string;
  value: string;
}

const keyword = ref('组件库联调');
const scenario = ref('list');

/**
 * 预览页只需要稳定的本地选项，用来确认 TmSelect 的 v-model 与选项渲染正常。
 * 真实业务模块接入后再通过 api/composable 分层加载远程数据。
 */
const scenarioOptions: TmSelectOption[] = [
  { label: '列表筛选', value: 'list' },
  { label: '弹窗表单', value: 'form' },
  { label: '表格操作', value: 'table' },
];
</script>

<template>
  <a-card title="⑥ TM UI 组件库">
    <p class="mb-4 text-sm text-secondary">
      该区块直接从 <code>@tm/ui</code> 引入组件，用于验证 demo 应用已经正确安装、注册并加载组件库样式。
    </p>

    <a-space direction="vertical" :size="16" class="w-full">
      <a-space wrap>
        <TmButton type="primary">主按钮</TmButton>
        <TmButton>默认按钮</TmButton>
        <TmButton danger confirm="确认执行该操作？">确认操作</TmButton>
      </a-space>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <TmInput v-model="keyword" placeholder="请输入筛选关键词" />
        <TmSelect v-model="scenario" :options="scenarioOptions" placeholder="请选择业务场景" />
      </div>

      <a-space wrap>
        <TmTag color="processing">当前关键词：{{ keyword }}</TmTag>
        <TmTag color="success">场景：{{ scenario }}</TmTag>
      </a-space>
    </a-space>
  </a-card>
</template>
