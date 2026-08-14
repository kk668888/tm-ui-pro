<!-- packages/ui/src/components/pagination/demos/basic.vue -->
<!-- TmPagination 基础演示：公司默认分页 + 业务覆盖 -->
<script setup lang="ts">
import { ref } from 'vue'
import { TmPagination } from '../index'

const current = ref(1)
const pageSize = ref(10)
</script>

<template>
  <div style="width: 100%">
    <p>公司默认（showSizeChanger + 10/20/50）</p>
    <TmPagination v-model:current="current" v-model:page-size="pageSize" :total="100" />
    <p>业务覆盖（隐藏切换器 + 每页 5 条）</p>
    <TmPagination :total="50" :show-size-changer="false" :default-page-size="5" />
    <p>展示总数 show-total</p>
    <TmPagination :total="200" :show-total="(total: number) => `共 ${total} 条`" />
  </div>
</template>
