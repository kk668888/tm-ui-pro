<script setup lang="ts">
import { ref } from 'vue';
import { TmConfigProvider, TmTable, TmButton, TmApp, TmMessage } from '@tm/ui';
import type { TmTableProps } from '@tm/ui';

defineOptions({ name: 'ConfigSection' });

const themeMode = ref<'light' | 'dark'>('light');

// 桥接表格：验证 ant token → vxe CSS 变量联动（静态常量，模板 :data 自动解包）
const bridgeRows: TmTableProps['data'] = [
  { name: '主色 primary', value: '由 ant colorPrimary 桥接' },
  { name: '边框 border', value: '由 ant colorBorder 桥接' },
  { name: '表头 header', value: '由 ant colorFillAlter 桥接' },
  { name: 'hover 行', value: '由 ant controlItemBgHover 桥接' },
];
const bridgeColumns = [
  { field: 'name', title: '项目' },
  { field: 'value', title: '取值' },
];
</script>

<template>
  <a-card class="section-config" title="⑤ 全局配置 Config">
    <p class="mb-4 text-sm text-secondary">
      TmConfigProvider 驱动 ant token → vxe CSS 变量桥接；TmApp 为命令式组件提供 holder 上下文。
    </p>
    <a-space direction="vertical" :size="16" class="w-full">
      <TmConfigProvider :theme-mode="themeMode">
        <div class="mb-3 flex items-center gap-3">
          <TmButton @click="themeMode = themeMode === 'light' ? 'dark' : 'light'">
            切换{{ themeMode === 'light' ? '暗色' : '亮色' }}
          </TmButton>
          <TmButton type="primary">主按钮（随 theme-mode 联动）</TmButton>
        </div>
        <TmTable :data="bridgeRows" :columns="bridgeColumns" />
      </TmConfigProvider>

      <a-divider />

      <TmApp>
        <TmButton type="primary" @click="TmMessage.success('TmApp holder 内的全局消息')">
          在 TmApp 内触发消息
        </TmButton>
      </TmApp>
    </a-space>
  </a-card>
</template>
