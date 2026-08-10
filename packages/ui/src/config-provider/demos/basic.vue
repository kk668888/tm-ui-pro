<!-- packages/ui/src/config-provider/demos/basic.vue -->
<!-- TmConfigProvider 基础演示：ant token → vxe CSS 变量桥接 + 亮/暗主题切换 + locale -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmConfigProvider } from '../index'
import { TmButton } from '../../components/button/index'
import { TmTable } from '../../components/table/index'

// 主题切换：light / dark（ant darkAlgorithm 驱动，vxe 变量随 token 联动）
const themeMode = ref<'light' | 'dark'>('light')

// 静态表格数据：演示 vxe 表格在 TmConfigProvider 包裹下视觉跟随 ant 主题
const columns = [
  { field: 'name', title: '项目' },
  { field: 'value', title: '取值' },
]
const data = [
  { name: '主色 primary', value: '由 ant colorPrimary 桥接' },
  { name: '边框 border', value: '由 ant colorBorder 桥接' },
  { name: '表头 header', value: '由 ant colorFillAlter 桥接' },
  { name: 'hover 行', value: '由 ant controlItemBgHover 桥接' },
]
</script>

<template>
  <div>
    <TmConfigProvider :theme-mode="themeMode">
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px">
        <a-button type="primary">ant 原生按钮</a-button>
        <TmButton>TmButton（同源主题）</TmButton>
        <TmButton @click="themeMode = themeMode === 'light' ? 'dark' : 'light'">
          切换{{ themeMode === 'light' ? '暗色' : '亮色' }}
        </TmButton>
      </div>

      <!-- 表格主色/边框/hover 等视觉跟随 ant token（经 --vxe-ui-* 变量桥接） -->
      <TmTable :data="data" :columns="columns" :pager-config="{ pageSize: 10, pageSizes: [10] }" />
    </TmConfigProvider>
  </div>
</template>
