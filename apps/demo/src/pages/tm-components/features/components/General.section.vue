<script setup lang="ts">
import { ref, onBeforeUnmount } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';
import { TmButton, TmMessage } from '@tm/ui';

defineOptions({ name: 'GeneralSection' });

const loading = ref(false);

// 异步定时器句柄：组件卸载时清理，避免卸载后仍触发状态更新 / 消息提示
let fakeAsyncTimer: ReturnType<typeof setTimeout>;

function fakeAsync() {
  loading.value = true;
  fakeAsyncTimer = setTimeout(() => {
    loading.value = false;
    TmMessage.success('异步操作完成');
  }, 800);
}

onBeforeUnmount(() => {
  clearTimeout(fakeAsyncTimer);
});
</script>

<template>
  <a-card class="section-general" title="① 通用 General">
    <p class="mb-4 text-sm text-secondary">
      TmButton：继承 ant Button 全部 props / slots / events，另加 debounce 防抖与 confirm 二次确认。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <a-space wrap>
        <TmButton type="primary">主按钮</TmButton>
        <TmButton>默认按钮</TmButton>
        <TmButton type="dashed">虚线按钮</TmButton>
        <TmButton danger>危险按钮</TmButton>
        <TmButton type="link">链接按钮</TmButton>
        <TmButton type="text">文本按钮</TmButton>
      </a-space>
      <a-space wrap>
        <TmButton size="large">大尺寸</TmButton>
        <TmButton>中尺寸</TmButton>
        <TmButton size="small">小尺寸</TmButton>
        <TmButton :loading="loading" @click="fakeAsync">加载态</TmButton>
        <TmButton disabled>禁用</TmButton>
      </a-space>
      <a-space wrap>
        <TmButton :debounce="500" @click="TmMessage.success('防抖触发（500ms 内仅触发一次）')">
          防抖 500ms
        </TmButton>
        <TmButton confirm="确认删除这条数据？" danger @click="TmMessage.success('已确认删除')">
          二次确认删除
        </TmButton>
        <TmButton type="primary">
          <template #icon><SearchOutlined /></template>
          带图标
        </TmButton>
      </a-space>
    </a-space>
  </a-card>
</template>
